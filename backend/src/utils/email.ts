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
  items: any[];
  total: number;
};

export async function sendOrderEmail(payload: OrderEmailPayload) {
  const html = `
    <h2>New Order: ${payload.orderId}</h2>
    <ul>
      ${payload.items
        .map(
          (i) =>
            `<li>${i.products.name} × ${i.quantity}</li>`
        )
        .join("")}
    </ul>
    <p><strong>Total:</strong> ${payload.total}</p>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: "yuliya.f.s@gmail.com", // admin email
    subject: "New Order Received",
    html,
  });
}
