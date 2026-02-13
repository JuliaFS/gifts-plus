import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration on server startup
transporter.verify(function (error, success) {
  if (error) {
    console.error(
      "❌ Nodemailer transporter verification failed. Check your EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS environment variables. If using Gmail, you may need an App Password.",
      error,
    );
  } else {
    console.log("✅ Nodemailer transporter is ready to send emails.");
  }
});

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Gifts Plus" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully. Message ID:", info.messageId);
    // If using ethereal.email for testing, this will provide a preview link
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("👀 Preview URL:", previewUrl);
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Re-throw to be handled by the calling service
    throw new Error("Failed to send email due to a server error.");
  }
}
