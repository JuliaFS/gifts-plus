import { supabase } from "../db/supabaseClient";

interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function createProduct(product: CreateProductData) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
