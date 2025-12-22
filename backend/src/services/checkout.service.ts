import { supabase } from "../db/supabaseClient";

export async function checkout(
  userId: string
) {
  // 1. Load cart
  const { data: cartItems, error } = await supabase
    .from("shopping_cart")
    .select("product_id, quantity")
    .eq("user_id", userId);

  if (error || !cartItems?.length) {
    throw new Error("Cart is empty");
  }

  // 2. Decrease stock (atomic)
  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });

    if (error) {
      throw new Error("Insufficient stock");
    }
  }

  // 3. (Optional) create order
  // 4. Clear cart
  await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId);
}
