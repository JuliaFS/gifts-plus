import { supabase } from "../db/supabaseClient";
import { OrderItem } from "../services/order.service";
import { transporter } from "./mailer";
import { generateInvoice } from "./pdf/invoice.generator";

interface SendOrderEmailPayload {
  orderId: string;
  items: OrderItem[];
  total: number;
  customerEmail: string;
  invoicePath?: string;
  invoiceBuffer?: Buffer;  // <-- keep this
}

// export async function sendOrderEmail({
//   orderId,
//   items,
//   total,
//   customerEmail,
//   invoicePath,
//   invoiceBuffer,
// }: SendOrderEmailPayload) {
//   if (!customerEmail) throw new Error("No recipient email defined");
//   if (!orderId || !items || !total) throw new Error("Missing required order info");

//   // Use passed buffer or generate PDF
//   const pdfBuffer = invoiceBuffer ?? (invoicePath ? undefined : await generateInvoice(orderId, items));

//   await transporter.sendMail({
//     from: `"Shop" <${process.env.EMAIL_USER}>`,
//     to: customerEmail,
//     subject: `Order Confirmation #${orderId}`,
//     text: `
// Order confirmation
// Order ID: ${orderId}

// ${items
//   .map(
//     (i) =>
//       `${i.products.name} × ${i.quantity} = ${i.products.price.toFixed(2)} € (Stock: ${i.products.stock})`
//   )
//   .join("\n")}

// Total: ${total.toFixed(2)} €
// `,
//     attachments: [
//       invoicePath
//         ? { path: invoicePath, filename: `invoice-${orderId}.pdf` }
//         : { content: pdfBuffer, filename: `invoice-${orderId}.pdf` },
//     ],
//   });

//   console.log(`Order email sent to ${customerEmail} for order ${orderId}`);
// }

export async function sendOrderEmail({
  orderId,
  items,
  total,
  invoicePath,
  customerEmail,
  invoiceBuffer,
}: {
  orderId: string;
  items: OrderItem[];
  total: number;
  invoicePath?: string;
  customerEmail: string;
  invoiceBuffer?: Buffer;
}) {
  if (!orderId || !items || !total) {
    throw new Error("Missing order info for email");
  }

  let finalBuffer: Buffer | undefined = invoiceBuffer;

  // Generate invoice if buffer not provided
  if (!finalBuffer) {
    finalBuffer = await generateInvoice(orderId, items);
  }

  // Upload invoice to Supabase Storage if not using a path
  let invoiceUrl: string | null = null;
  if (!invoicePath && finalBuffer) {
    const invoiceFileName = `invoice-${orderId}.pdf`;
    let uploadResult = await supabase.storage
      .from("invoices")
      .upload(invoiceFileName, finalBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadResult.error?.message.includes("Bucket not found")) {
      await supabase.storage.createBucket("invoices", { public: true });
      uploadResult = await supabase.storage.from("invoices").upload(invoiceFileName, finalBuffer, { contentType: "application/pdf", upsert: true });
    }

    if (uploadResult.error) {
      console.error("Supabase Storage upload failed:", uploadResult.error);
      throw uploadResult.error;
    }

    const { data } = supabase.storage
      .from("invoices")
      .getPublicUrl(invoiceFileName);

    invoiceUrl = data.publicUrl;
  }

  // Email body
  const body = `
Thank you for your order!

Order ID: ${orderId}

${items
  .map((i) => `${i.products.name} × ${i.quantity} = ${i.price_at_purchase.toFixed(2)} €`)
  .join("\n")}

Total: ${total.toFixed(2)} €

${invoiceUrl ? `Download your invoice here: ${invoiceUrl}` : ""}
`;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation #${orderId}`,
    text: body,
    attachments: [
      invoicePath
        ? { path: invoicePath, filename: `invoice-${orderId}.pdf` }
        : { content: finalBuffer, filename: `invoice-${orderId}.pdf`, contentType: "application/pdf" },
    ],
  });

  console.log(`Order email sent to ${customerEmail} for order ${orderId}`);
  return invoiceUrl; // return link if needed for frontend or API
}
