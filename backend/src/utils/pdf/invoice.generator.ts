import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateInvoice(order: any, items: any[]) {
  const filePath = path.join(
    __dirname,
    `../../invoices/invoice-${order.id}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.text(`Order ID: ${order.id}`);

  items.forEach((i) => {
    doc.text(
      `${i.products.name} × ${i.quantity} = ${
        i.quantity * i.products.price
      }`
    );
  });

  doc.moveDown();
  doc.text(`Total: ${order.total_amount}`);

  doc.end();
  return filePath;
}
