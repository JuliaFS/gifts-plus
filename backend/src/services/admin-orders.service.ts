import { supabase } from "../db/supabaseClient";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      status,
      created_at,
      order_items (
        quantity,
        price_at_purchase,
        products (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
