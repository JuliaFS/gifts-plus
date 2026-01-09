import { supabase } from "../db/supabaseClient";

export async function createOrder(userId: string, cartItems: any[]) {
  // 1️⃣ Filter invalid products (keep your logic)
  const validItems = cartItems.filter(
    (i) => i.products !== null
  );

  if (!validItems.length) {
    throw new Error("No valid products in cart");
  }

  // 2️⃣ Calculate total (keep your logic)
  const total = validItems.reduce(
    (sum, i) => sum + i.quantity * i.products.price,
    0
  );

  // 3️⃣ Prepare items for DB (NEW)
  const itemsPayload = validItems.map((i) => ({
    product_id: i.product_id,
    quantity: i.quantity,
    price_at_purchase: i.products.price,
  }));

  // 4️⃣ Create order + items ATOMICALLY (NEW)
  const { data: orderId, error } = await supabase.rpc(
    "create_order_with_items",
    {
      p_user_id: userId,
      p_total: total,
      p_items: itemsPayload,
    }
  );

  if (error) throw error;

  // 5️⃣ Return same shape as before
  return {
    id: orderId,
    total_amount: total,
    status: "PENDING",
    items: itemsPayload,
  };
}


