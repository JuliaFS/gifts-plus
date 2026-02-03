import { OrderItem } from "../services/types";
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

export async function sendOrderEmail({
  orderId,
  items,
  total,
  customerEmail,
  invoicePath,
  invoiceBuffer,
}: SendOrderEmailPayload) {
  if (!customerEmail) throw new Error("No recipient email defined");
  if (!orderId || !items || !total) throw new Error("Missing required order info");

  // Use passed buffer or generate PDF
  const pdfBuffer = invoiceBuffer ?? (invoicePath ? undefined : await generateInvoice(orderId, items));

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation #${orderId}`,
    text: `
Order confirmation
Order ID: ${orderId}

${items
  .map(
    (i) =>
      `${i.products.name} × ${i.quantity} = ${i.products.price.toFixed(2)} € (Stock: ${i.products.stock})`
  )
  .join("\n")}

Total: ${total.toFixed(2)} €
`,
    attachments: [
      invoicePath
        ? { path: invoicePath, filename: `invoice-${orderId}.pdf` }
        : { content: pdfBuffer, filename: `invoice-${orderId}.pdf` },
    ],
  });

  console.log(`Order email sent to ${customerEmail} for order ${orderId}`);
}