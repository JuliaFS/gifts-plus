import { supabase } from "../db/supabaseClient";
import { OrderStatus } from "../utils/orderStatus";
import { sendOrderStatusEmail } from "../utils/sendOrderStatusEmail";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  // 1. Update order status
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id, total_amount")
    .single();



  if (error || !order) throw error;

  // 2. Fetch order items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      quantity,
      products (
        name,
        price
      )
    `)
    .eq("order_id", orderId);

  if (itemsError) throw itemsError;

  // 3. Send detailed email
  await sendOrderStatusEmail({
    orderId: order.id,
    status,
    items: items ?? [],
    total: order.total_amount,
  });
}

