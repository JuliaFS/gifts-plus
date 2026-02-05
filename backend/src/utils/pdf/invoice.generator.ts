import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { OrderItem } from "../../services/order.service";

export function generateInvoice(orderId: string, items: OrderItem[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // ---------------------------------------------------------
    // 1. Register Fonts (Crucial for Bulgarian/Cyrillic)
    // ---------------------------------------------------------
    const fontName = "DejaVuSans.ttf";
    const fontBoldName = "DejaVuSans-Bold.ttf";

    // Check multiple paths to handle dev (src/) vs prod (dist/) structures
    const possibleDirs = [
      path.join(__dirname, "fonts"),
      path.join(process.cwd(), "fonts"), // Check root/fonts
      path.join(process.cwd(), "src", "utils", "pdf", "fonts"),
      path.join(process.cwd(), "backend", "src", "utils", "pdf", "fonts"),
    ];

    let regularFontPath = "";
    let boldFontPath = "";
    let hasCustomFont = false;

    for (const dir of possibleDirs) {
      const reg = path.join(dir, fontName);
      const bold = path.join(dir, fontBoldName);
      if (fs.existsSync(reg) && fs.existsSync(bold)) {
        regularFontPath = reg;
        boldFontPath = bold;
        hasCustomFont = true;
        console.log(`✅ PDF Generator: Loaded fonts from ${dir}`);
        break;
      }
    }

    if (hasCustomFont) {
      doc.registerFont("DejaVu", regularFontPath);
      doc.registerFont("DejaVu-Bold", boldFontPath);
      doc.font("DejaVu");
    } else {
      console.warn("⚠️ PDF Generator: Custom fonts NOT found. Checked paths:", possibleDirs);
      console.warn("👉 Please download DejaVuSans.ttf and DejaVuSans-Bold.ttf and place them in src/utils/pdf/fonts/");
      doc.font("Helvetica");
    }

    // ---------------------------------------------------------
    // 2. Header & Company Info
    // ---------------------------------------------------------
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("INVOICE", 50, 57)
      .fontSize(10)
      .text("Gifts Plus", 200, 50, { align: "right" })
      .text("123 Gift Street", 200, 65, { align: "right" })
      .text("Sofia, Bulgaria", 200, 80, { align: "right" })
      .moveDown();

    // ---------------------------------------------------------
    // 3. Order Details
    // ---------------------------------------------------------
    doc
      .fillColor("#000000")
      .fontSize(12)
      .text(`Order ID: ${orderId}`, 50, 130)
      .text(`Date: ${new Date().toLocaleDateString("bg-BG")}`, 50, 145)
      .moveDown();

    // ---------------------------------------------------------
    // 4. Table Header
    // ---------------------------------------------------------
    const tableTop = 200;
    const itemX = 50;
    const quantityX = 300;
    const priceX = 370;
    const totalX = 450;

    doc
      .font(hasCustomFont ? "DejaVu-Bold" : "Helvetica-Bold")
      .fontSize(10);

    // Draw Header Background
    doc
      .rect(itemX, tableTop - 5, 500, 20)
      .fillColor("#f0f0f0")
      .fill();
    
    doc.fillColor("#000000"); // Reset text color

    doc
      .text("Item", itemX + 5, tableTop)
      .text("Quantity", quantityX, tableTop)
      .text("Price", priceX, tableTop)
      .text("Total", totalX, tableTop);

    // ---------------------------------------------------------
    // 5. Table Rows
    // ---------------------------------------------------------
    let y = tableTop + 25;
    let grandTotal = 0;

    doc.font(hasCustomFont ? "DejaVu" : "Helvetica");

    items.forEach((item) => {
      const name = item.products.name;
      const qty = item.quantity;
      const price = item.price_at_purchase;
      const lineTotal = price * qty;
      grandTotal += lineTotal;

      // Check for page break
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc
        .fontSize(10)
        .text(name, itemX + 5, y, { width: 240 })
        .text(qty.toString(), quantityX, y)
        .text(price.toFixed(2) + " €", priceX, y)
        .text(lineTotal.toFixed(2) + " €", totalX, y);

      // Draw line below row
      doc
        .moveTo(itemX, y + 15)
        .lineTo(550, y + 15)
        .strokeColor("#eeeeee")
        .lineWidth(1)
        .stroke();

      y += 25;
    });

    // ---------------------------------------------------------
    // 6. Grand Total
    // ---------------------------------------------------------
    const totalY = y + 10;
    
    doc
      .font(hasCustomFont ? "DejaVu-Bold" : "Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000000")
      .text("Grand Total:", 350, totalY)
      .text(grandTotal.toFixed(2) + " €", totalX, totalY);

    // ---------------------------------------------------------
    // 7. Footer
    // ---------------------------------------------------------
    doc
      .fontSize(10)
      .fillColor("#555555")
      .text(
        "Thank you for your business!",
        50,
        700,
        { align: "center", width: 500 }
      );

    doc.end();
  });
}

