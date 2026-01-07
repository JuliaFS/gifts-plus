import { supabase } from "../db/supabaseClient";

export async function createOrder(userId: string, cartItems: any[]) {
  // Filter invalid products (deleted)
  const validItems = cartItems.filter(i => i.products !== null);

  if (!validItems.length) throw new Error("No valid products in cart");

  // Calculate total
  const total = validItems.reduce(
    (sum, i) => sum + i.quantity * i.products.price,
    0
  );

  // Create order
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: total,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = validItems.map((i) => ({
    order_id: order.id,
    product_id: i.product_id,
    quantity: i.quantity,
    price_at_purchase: i.products.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return { ...order, items: orderItems };
}

