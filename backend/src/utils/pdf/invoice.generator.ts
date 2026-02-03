//import PDFDocument from "pdfkit";
import PDFDocument = require("pdfkit");

import fs from "fs";
import path from "path";
import { OrderItem } from "../../services/types";

// export function generateInvoice(order: any, items: any[]) {
//   const invoicesDir = path.join(__dirname, "../../invoices");

//   // ✅ Ensure invoices folder exists
//   if (!fs.existsSync(invoicesDir)) {
//     fs.mkdirSync(invoicesDir, { recursive: true });
//   }

//   const filePath = path.join(
//     invoicesDir,
//     `invoice-${order.id}.pdf`
//   );

//   const doc = new PDFDocument();
//   doc.pipe(fs.createWriteStream(filePath));

//   doc.fontSize(20).text("Invoice", { align: "center" });
//   doc.moveDown();
//   doc.text(`Order ID: ${order.id}`);

//   items.forEach((i) => {
//     doc.text(
//       `${i.products.name} × ${i.quantity} = ${
//         i.quantity * i.products.price
//       }`
//     );
//   });

//   doc.moveDown();
//   doc.text(`Total: ${order.total_amount}`);

//   doc.end();

//   return filePath;
// }
export async function generateInvoice(orderId: string, items: OrderItem[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Invoice content
    doc.fontSize(18).text("Order Invoice", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${orderId}`);
    doc.text(`Total: ${items.reduce((sum, i) => sum + i.quantity * i.products.price, 0).toFixed(2)} €`);
    doc.moveDown();

    doc.text("Items:");
    items.forEach((i) => {
      doc.text(`${i.products.name} × ${i.quantity} = ${i.products.price.toFixed(2)} € (Stock: ${i.products.stock})`);
    });

    doc.end();
  });
}