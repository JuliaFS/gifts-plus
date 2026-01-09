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

export async function sendOrderStatusEmail(
  orderId: string,
  status: string
) {
  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `Order ${orderId} is now ${status}`,
    html: `
      <h2>Order Update</h2>
      <p>Your order <strong>${orderId}</strong> status changed to:</p>
      <p><strong>${status}</strong></p>
    `,
  });
}
