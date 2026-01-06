import { supabase } from "../db/supabaseClient";
import { CartValidationItem } from "./types";

export async function validateCart(items: CartValidationItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const productIds = items.map(i => i.productId);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, stock')
    .in('id', productIds);

  if (error) {
    throw new Error(error.message);
  }

  const safeProducts = products ?? [];

  return items.filter(item => {
    const product = safeProducts.find(p => p.id === item.productId);
    return (
      product &&
      product.stock >= item.quantity
    );
  });
}

// This function just fetches product info from Supabase for validation
export async function getProductsForValidation(
  items: CartValidationItem[]
) {
  if (!items || items.length === 0) return [];

  const productIds = items.map((i) => i.productId);

  const { data, error } = await supabase
    .from("products")
    .select("id, stock")
    .in("id", productIds);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}



