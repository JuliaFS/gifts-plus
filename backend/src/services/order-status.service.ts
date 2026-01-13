import { supabase } from "../db/supabaseClient";
import { OrderStatus } from "../utils/orderStatus";
import { sendOrderStatusEmail } from "../utils/sendOrderStatusEmail";

interface OrderItem {
  quantity: number;
  products: {
    name: string;
    price: number;
  };
}

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
  const { data: itemsData, error: itemsError } = await supabase
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

  const items = itemsData as unknown as OrderItem[] | null;

  // 3. Send detailed email
  await sendOrderStatusEmail({
    orderId: order.id,
    status,
    items: items ?? [],
    total: order.total_amount,
  });
}
