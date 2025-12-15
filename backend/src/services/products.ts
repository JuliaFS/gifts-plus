import { supabase } from "../db/supabaseClient";
import { Product } from "./types";

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}
