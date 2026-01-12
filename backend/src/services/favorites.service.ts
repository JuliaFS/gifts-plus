import { supabase } from "../db/supabaseClient";

export async function addFavorite(userId: string, productId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, product_id: productId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, productId: string) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      product_id,
      products (
        *,
        product_images (
          image_url,
          is_main
        )
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

