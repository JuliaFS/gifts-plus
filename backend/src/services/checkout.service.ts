import { generateInvoice } from "../utils/pdf/invoice.generator";
import { supabase } from "../db/supabaseClient";
import {  createOrder } from "./order.service";
import { validateCartService } from "./cart-validation.service";
import { transporter } from "../utils/mailer";
import { sendOrderEmail } from "../utils/sendOrderEmail";

export async function checkout(userId: string, customerEmail?: string) {
  // 1️⃣ Validate cart
  const validation = await validateCartService(userId);
  if (!validation.valid || !validation.items) throw new Error("Cart invalid");

  const cartItems = validation.items;

  // 2️⃣ Create order
  const order = await createOrder(userId, cartItems, { paymentMethod: "ON DELIVERY" });

  // 3️⃣ Decrease stock
  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });
    if (error) throw new Error("Insufficient stock");
  }

  // 4️⃣ Generate PDF buffer
  const invoiceBuffer = await generateInvoice(order.id, order.items);

  // 5️⃣ Upload PDF to Supabase Storage
  const invoiceFileName = `invoice-${order.id}.pdf`;
  let uploadResult = await supabase.storage
    .from("invoices")
    .upload(invoiceFileName, invoiceBuffer, {
      contentType: "application/pdf",
      upsert: true,
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

  // 6️⃣ Ensure we have an email
  if (!customerEmail) {
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();
    customerEmail = user?.email;
  }

  if (!customerEmail) throw new Error("No customer email found");

  // 7️⃣ Send email to customer (attach PDF)
  await sendOrderEmail({
    orderId: order.id,
    items: order.items,
    total: order.total_amount,
    customerEmail,
    invoiceBuffer,
  });

  // 8️⃣ Send email to admin
  if (process.env.ADMIN_EMAIL) {
    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order.id}`,
      text: `New order received!\nOrder ID: ${order.id}\nTotal: ${order.total_amount} €`,
      attachments: [
        {
          content: invoiceBuffer,
          filename: invoiceFileName,
          contentType: "application/pdf",
        },
      ],
    });
    console.log(`Admin notified for order ${order.id}`);
  }

  // 9️⃣ Insert row into invoices table
  const { error: invoiceError } = await supabase.from("invoices").insert({
    user_id: userId,
    order_id: order.id,
    pdf_url: publicUrl,
    amount: order.total_amount,
    payment_type: "delivery",
    status: "pending",
  });

  if (invoiceError) {
    console.error("❌ Failed to insert invoice record:", invoiceError);
  }

  // 🔟 Clear cart
  await supabase.from("shopping_cart").delete().eq("user_id", userId);

  // 1️⃣1️⃣ Return order info + invoice URL
  return {
    orderId: order.id,
    invoiceUrl: publicUrl,
  };
}


// import nodemailer from "nodemailer";
// import { generateInvoice } from "../utils/pdf/invoice.generator";
// import { supabase } from "../db/supabaseClient";
// import { sendCustomerConfirmation } from "../utils/customerConfirmation";
// import { createOrder, OrderItem, sendOrderEmail } from "./order.service";
// import { validateCartService } from "./cart-validation.service";
// import { transporter } from "../utils/mailer";



// export async function checkout(userId: string, customerEmail: string) {
//   const validation = await validateCartService(userId);
//   if (!validation.valid || !validation.items) throw new Error("Cart invalid");

//   const cartItems = validation.items;

//   const order = await createOrder(userId, cartItems, { paymentMethod: "ON DELIVERY" });

//   for (const item of cartItems) {
//     const { error } = await supabase.rpc("decrease_stock", {
//       product_id: item.product_id,
//       qty: item.quantity,
//     });
//     if (error) throw new Error("Insufficient stock");
//   }

//   // Generate PDF invoice
//   const invoiceBuffer = await generateInvoice(order.id, order.items);

//   // Ensure we have an email
//   let email = customerEmail;
//   if (!email) {
//     const { data: user } = await supabase
//       .from("users")
//       .select("email")
//       .eq("id", userId)
//       .single();
//     email = user?.email;
//   }

//   // Customer email
//   await sendOrderEmail({
//     orderId: order.id,
//     items: order.items,
//     total: order.total_amount,
//     customerEmail: email,
//     invoiceBuffer,
//   });

//   // Admin email
//   if (process.env.ADMIN_EMAIL) {
//     await transporter.sendMail({
//       from: `"Shop" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Order #${order.id}`,
//       text: `New order received!\nOrder ID: ${order.id}\nTotal: ${order.total_amount} €`,
//       attachments: [
//         {
//           content: invoiceBuffer,
//           filename: `invoice-${order.id}.pdf`,
//         },
//       ],
//     });
//     console.log(`Admin notified for order ${order.id}`);
//   }

//   // Clear cart
//   await supabase.from("shopping_cart").delete().eq("user_id", userId);

//   return order.id;
// }