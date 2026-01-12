import { supabase } from "../db/supabaseClient";
import { CreateProductData, Product } from "./types";

export async function getProducts(page: number = 1, limit: number = 12) {
  const offset = (page - 1) * limit;

  // Get total count
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  // Get paginated data
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (*)
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function createProduct(product: CreateProductData) {
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
    .select(
      `
      *,
      product_images (
        id,
        image_url,
        position,
        is_main
      )
    `
    )
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
  const { error } = await supabase.from("shopping_cart").upsert({
    user_id: userId,
    product_id: productId,
    quantity,
  });

  if (error) throw error;
}

export async function updateProduct(
  productId: string,
  updates: Partial<CreateProductData>
) {
  const { image_urls, ...productUpdates } = updates;

  const { data, error } = await supabase
    .from("products")
    .update(productUpdates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (!product) {
    throw new Error("Product does not exist");
  }

  if (image_urls?.length) {
    const images = image_urls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      position: index,
    }));

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(images);

    if (imageError) throw imageError;
  }

  return data;
}

export async function deleteProduct(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete product images by URL
export async function deleteProductImages(
  productId: string,
  imageUrls: string[]
) {
  if (!imageUrls.length) return;

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .in("image_url", imageUrls);

  if (error) throw error;
}

// Optional: dedicated function for badge/promotion
export async function addBadgeToProduct(
  productId: string,
  badge?: string,
  promotion?: string
) {
  const { data, error } = await supabase
    .from("products")
    .update({ badge, promotion })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchProducts(query: string) {
  if (!query) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        image_url,
        is_main
      )
    `
    )
    .ilike("name", `%${query}%`); // case-insensitive search

  if (error) throw error;
  return data;
}
