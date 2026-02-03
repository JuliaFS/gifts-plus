import nodemailer from "nodemailer";
import { generateInvoice } from "../utils/pdf/invoice.generator";
import { supabase } from "../db/supabaseClient";
import { sendCustomerConfirmation } from "../utils/customerConfirmation";
import { createOrder, OrderItem } from "./order.service";
import { sendOrderEmail } from "../utils/sendOrderEmail";
import { validateCartService } from "./cart-validation.service";
import { transporter } from "../utils/mailer";



export async function checkout(userId: string, customerEmail: string) {
  const validation = await validateCartService(userId);
  if (!validation.valid || !validation.items) throw new Error("Cart invalid");

  const cartItems = validation.items;

  const order = await createOrder(userId, cartItems);

  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });
    if (error) throw new Error("Insufficient stock");
  }

  // Generate PDF invoice
  const invoiceBuffer = await generateInvoice(order.id, order.items);

  // Ensure we have an email
  let email = customerEmail;
  if (!email) {
    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();
    email = user?.email;
  }

  // Customer email
  await sendOrderEmail({
    orderId: order.id,
    items: order.items,
    total: order.total_amount,
    customerEmail: email,
    invoiceBuffer,
  });

  // Admin email
  if (process.env.ADMIN_EMAIL) {
    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order.id}`,
      text: `New order received!\nOrder ID: ${order.id}\nTotal: ${order.total_amount} €`,
      attachments: [
        {
          content: invoiceBuffer,
          filename: `invoice-${order.id}.pdf`,
        },
      ],
    });
    console.log(`Admin notified for order ${order.id}`);
  }

  // Clear cart
  await supabase.from("shopping_cart").delete().eq("user_id", userId);

  return order.id;
}