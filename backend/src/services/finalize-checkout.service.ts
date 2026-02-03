
import { supabase } from "../db/supabaseClient";
import { generateInvoice } from "../utils/pdf/invoice.generator";
import { sendOrderEmail } from "../utils/sendOrderEmail";
import { getOrderById } from "./order.service";

interface CheckoutItem {
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export async function finalizeCheckout(orderId: string) {
  // 1️⃣ Get order and userId
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Order not found");

  const userId = order.user_id;
  if (!userId) throw new Error("User ID not found on order");

  // Fetch customer email
  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();
  if (!user?.email) throw new Error("Customer email not found");

  const cartItems = order.items as CheckoutItem[];

  // 2️⃣ Decrease stock (atomic)
  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });

    if (error) throw new Error("Insufficient stock");
  }

  // 3️⃣ Generate invoice
  const invoiceBuffer = await generateInvoice(order.id, order.items);

  // 4️⃣ Send confirmation email
  await sendOrderEmail({
    orderId: order.id,
    items: order.items,
    total: order.total_amount,
    customerEmail: user.email,
    invoiceBuffer,
  });

  // 5️⃣ Clear cart
  await supabase.from("shopping_cart").delete().eq("user_id", userId);

  // 6️⃣ Update order status
  await supabase
    .from("orders")
    .update({ status: "PAID" })
    .eq("id", orderId);
}