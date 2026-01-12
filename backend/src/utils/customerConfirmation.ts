import { transporter } from "./mailer";
import { supabase } from "../db/supabaseClient";

export async function sendCustomerConfirmation({
  userId,
  order,
  invoicePath,
}: any) {
  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  if (!user?.email) return;

  const html = `
    <h2>Order confirmation</h2>
    <p>Order ID: ${order.id}</p>
    <p>Total: ${order.total_amount}</p>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Order confirmation",
    html,
    attachments: [
      {
        filename: `invoice-${order.id}.pdf`,
        path: invoicePath,
      },
    ],
  });
}
