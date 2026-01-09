import { supabase } from "../db/supabaseClient";

export async function validateCartService(userId: string) {
  const { data: itemsData, error } = await supabase
    .from("shopping_cart")
    .select(`
      product_id,
      quantity,
      products (
        name,
        price,
        stock
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  const items = itemsData as any[];

  if (!items || !items.length) {
    return { valid: false, reason: "Cart is empty" };
  }

  let total = 0;
  const issues: string[] = [];

  for (const item of items) {
    if (item.quantity > item.products.stock) {
      issues.push(
        `${item.products.name} has only ${item.products.stock} left`
      );
    }

    total += item.quantity * item.products.price;
  }

  if (issues.length) {
    return { valid: false, issues };
  }

  return {
    valid: true,
    total,
    items,
  };
}
