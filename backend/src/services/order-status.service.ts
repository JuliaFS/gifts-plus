import { supabase } from "../db/supabaseClient";
// import { sendOrderStatusEmail } from "../utils/sendOrderStatusEmail";
import { sendOrderStatusEmail } from "../utils/sendOrderStatusEmail";

export async function updateOrderStatus(
  orderId: string,
  status: "SHIPPED" | "CANCELLED"
) {
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id, user_id")
    .single();

  if (error) throw error;

  await sendOrderStatusEmail(order.id, status);
}
