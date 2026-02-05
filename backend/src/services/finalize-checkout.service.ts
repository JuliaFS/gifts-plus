import { supabase } from "../db/supabaseClient";
import { generateInvoice } from "../utils/pdf/invoice.generator";
import { transporter } from "../utils/mailer";
import { getOrderById } from "./order.service";
import { sendOrderEmail } from "../utils/sendOrderEmail";

interface CheckoutItem {
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export async function finalizeCheckout(orderId: string, emailFromWebhook?: string) {
  // 1️⃣ Get order and userId
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Order not found");

  // 🛑 Idempotency Check: If order is already finalized, stop here.
  if (order.status === "PAID") {
    console.log(`Order ${orderId} is already finalized. Skipping.`);
    return { message: "Already finalized", invoiceUrl: order.invoice_url || null };
  }

  const userId = order.user_id;
  if (!userId) throw new Error("User ID not found on order");

  let customerEmail = emailFromWebhook;

  // Fallback to DB email if missing
  if (!customerEmail) {
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();
    customerEmail = user?.email;
  }
  if (!customerEmail) throw new Error("Customer email not found");

  const cartItems = order.items as CheckoutItem[];

  // 2️⃣ Decrease stock (atomic)
  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });

    if (error) throw new Error("Insufficient stock");
  }

  // 3️⃣ Generate PDF invoice
  const invoiceBuffer = await generateInvoice(order.id, order.items);

  // 4️⃣ Upload invoice to Supabase Storage
  const invoiceFileName = `invoice-${order.id}.pdf`;
  let uploadResult = await supabase.storage
    .from("invoices")
    .upload(invoiceFileName, invoiceBuffer, {
      contentType: "application/pdf",
      upsert: true, // replace if exists
    });

  if (uploadResult.error?.message.includes("Bucket not found")) {
    await supabase.storage.createBucket("invoices", { public: true });
    uploadResult = await supabase.storage.from("invoices").upload(invoiceFileName, invoiceBuffer, { contentType: "application/pdf", upsert: true });
  }

  if (uploadResult.error) throw uploadResult.error;

  const { data } = supabase.storage
    .from("invoices")
    .getPublicUrl(invoiceFileName);
  const publicUrl = data.publicUrl;

  // 5️⃣ Insert record into invoices table
  await supabase.from("invoices").insert({
    user_id: userId,
    order_id: order.id,
    pdf_url: publicUrl,
    amount: order.total_amount,
    payment_type: "online",
    status: "paid",
  });

  // 6️⃣ Send email to customer with PDF attachment
  await sendOrderEmail({
    orderId: order.id,
    items: order.items,
    total: order.total_amount,
    customerEmail,
    invoiceBuffer,
  });

  // 7️⃣ Send email to admin
  if (process.env.ADMIN_EMAIL) {
    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order.id} (Paid Online)`,
      text: `New order received and paid online!\nOrder ID: ${order.id}\nTotal: ${order.total_amount} €`,
      attachments: [
        {
          content: invoiceBuffer,
          filename: invoiceFileName,
          contentType: "application/pdf",
        },
      ],
    });
    console.log(`Admin notified for paid order ${order.id}`);
  }

  // 8️⃣ Clear user's shopping cart
  await supabase.from("shopping_cart").delete().eq("user_id", userId);

  // 9️⃣ Update order status and save invoice URL
  await supabase
    .from("orders")
    .update({ status: "PAID", invoice_url: publicUrl })
    .eq("id", orderId);

  // 🔟 Return invoice URL for frontend or webhook
  return {
    message: "Checkout finalized",
    invoiceUrl: publicUrl,
  };
}

// import { supabase } from "../db/supabaseClient";
// import { generateInvoice } from "../utils/pdf/invoice.generator";
// import { transporter } from "../utils/mailer";
// import { getOrderById, sendOrderEmail } from "./order.service";

// interface CheckoutItem {
//   product_id: string;
//   quantity: number;
//   products: {
//     name: string;
//     price: number;
//     stock: number;
//   };
// }

// export async function finalizeCheckout(orderId: string, emailFromWebhook?: string) {
//   // 1️⃣ Get order and userId
//   const order = await getOrderById(orderId);
//   if (!order) throw new Error("Order not found");

//   // 🛑 Idempotency Check: If order is already paid, stop here.
//   if (order.status === "PAID") {
//     console.log(`Order ${orderId} is already finalized. Skipping.`);
//     return;
//   }

//   const userId = order.user_id;
//   if (!userId) throw new Error("User ID not found on order");

//   let customerEmail = emailFromWebhook;

//   // If email wasn't in metadata, fallback to fetching from DB
//   if (!customerEmail) {
//     const { data: user } = await supabase
//       .from("users")
//       .select("email")
//       .eq("id", userId)
//       .single();
//     customerEmail = user?.email;
//   }
//   console.log("Customer email:", customerEmail);
//   if (!customerEmail) throw new Error("Customer email not found");

//   const cartItems = order.items as CheckoutItem[];

//   // 2️⃣ Decrease stock (atomic)
//   for (const item of cartItems) {
//     const { error } = await supabase.rpc("decrease_stock", {
//       product_id: item.product_id,
//       qty: item.quantity,
//     });

//     if (error) throw new Error("Insufficient stock");
//   }

//   // 3️⃣ Generate invoice
//   const invoiceBuffer = await generateInvoice(order.id, order.items);

//   // 4️⃣ Send confirmation email
//   await sendOrderEmail({
//     orderId: order.id,
//     items: order.items,
//     total: order.total_amount,
//     customerEmail: customerEmail,
//     invoiceBuffer,
//   });

//   // Admin email
//   if (process.env.ADMIN_EMAIL) {
//     await transporter.sendMail({
//       from: `"Shop" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Order #${order.id} (Paid Online)`,
//       text: `New order received and paid online!\nOrder ID: ${order.id}\nTotal: ${order.total_amount} €`,
//       attachments: [
//         {
//           content: invoiceBuffer,
//           filename: `invoice-${order.id}.pdf`,
//         },
//       ],
//     });
//     console.log(`Admin notified for paid order ${order.id}`);
//   }

//   // 5️⃣ Clear cart
//   await supabase.from("shopping_cart").delete().eq("user_id", userId);

//   // 6️⃣ Update order status
//   await supabase
//     .from("orders")
//     .update({ status: "PENDING" })
//     .eq("id", orderId);
// }