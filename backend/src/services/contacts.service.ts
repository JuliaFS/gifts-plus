import { transporter } from "../utils/mailer";

interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: ContactFormPayload) {
  if (!process.env.ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL is not set. Cannot send contact form email.");
    throw new Error("Server configuration error: Admin email not set.");
  }

  const mailOptions = {
    from: `"Gifts Plus Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    replyTo: email, // Allows you to reply directly to the user's email
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}