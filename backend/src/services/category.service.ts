import { supabase } from "../db/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export async function createCategory(name: string, slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProductsByCategory(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (*),
      product_categories!inner (
        categories!inner (
          slug
        )
      )
    `)
    .eq("product_categories.categories.slug", slug);

  if (error) throw error;
  return data;
}
