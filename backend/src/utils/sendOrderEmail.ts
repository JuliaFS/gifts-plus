import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

type OrderEmailPayload = {
  orderId: string;
  items: {
    quantity: number;
    products: {
      name: string;
      price: number;
    };
  }[];
  total: number;
  invoicePath: string;
};

export async function sendOrderEmail(payload: OrderEmailPayload) {
  const html = `
    <h2>🛒 New Order: ${payload.orderId}</h2>

    <ul>
      ${payload.items
        .map(
          (i) =>
            `<li>${i.products.name} × ${i.quantity}</li>`
        )
        .join("")}
    </ul>

    <p><strong>Total:</strong> ${payload.total.toFixed(2)} €</p>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `New Order #${payload.orderId}`,
    html,
    attachments: [
      {
        filename: `invoice-${payload.orderId}.pdf`,
        path: payload.invoicePath,
        contentType: "application/pdf",
      },
    ],
  });
}


