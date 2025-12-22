import { supabase } from "../db/supabaseClient";
import { CreateProductData } from "./types";



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

export async function createProduct(
  product: CreateProductData
) {
  const { image_urls, ...productData } = product;

  const { data: createdProduct, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) throw error;

  if (image_urls?.length) {
    const images = image_urls.map((url, index) => ({
      product_id: createdProduct.id,
      image_url: url,
      position: index,
      is_main: index === 0,
    }));

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(images);

    if (imageError) throw imageError;
  }

  return createdProduct;
}

export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        position,
        is_main
      )
    `)
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}
export async function addToFavorites(userId: string, productId: string) {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
}
export async function removeFromFavorites(userId: string, productId: string) {
  await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}
export async function upsertCartItem(
  userId: string,
  productId: string,
  quantity: number
) {
  const { error } = await supabase
    .from("shopping_cart")
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity,
    });

  if (error) throw error;
}



// export async function createProduct(product: CreateProductData) {
//   const { data, error } = await supabase
//     .from("products")
//     .insert(product)
//     .select()
//     .single();

//   if (error) {
//     throw error;
//   }

//   return data;
// }
