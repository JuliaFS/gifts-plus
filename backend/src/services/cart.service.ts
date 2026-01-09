// import { supabase } from "../db/supabaseClient";
// import { CartValidationItem } from "./types";

// export async function validateCart(items: CartValidationItem[]) {
//   if (!Array.isArray(items) || items.length === 0) {
//     return [];
//   }

//   const productIds = items.map(i => i.productId);

//   const { data: products, error } = await supabase
//     .from('products')
//     .select('id, stock')
//     .in('id', productIds);

//   if (error) {
//     throw new Error(error.message);
//   }

//   const safeProducts = products ?? [];

//   return items.filter(item => {
//     const product = safeProducts.find(p => p.id === item.productId);
//     return (
//       product &&
//       product.stock >= item.quantity
//     );
//   });
// }

// // This function just fetches product info from Supabase for validation
// export async function getProductsForValidation(
//   items: CartValidationItem[]
// ) {
//   if (!items || items.length === 0) return [];

//   const productIds = items.map((i) => i.productId);

//   const { data, error } = await supabase
//     .from("products")
//     .select("id, stock")
//     .in("id", productIds);

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data ?? [];
// }

import { supabase } from "../db/supabaseClient";

type CartItemPayload = {
  productId: string;
  quantity: number;
};

export async function getCart(userId: string) {
  const { data, error } = await supabase
    .from("shopping_cart")
    .select(`
      product_id,
      quantity,
      products (
        id,
        name,
        price,
        image
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  const { data } = await supabase
    .from("shopping_cart")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (data) {
    await supabase
      .from("shopping_cart")
      .update({ quantity: data.quantity + quantity })
      .eq("id", data.id);
  } else {
    await supabase.from("shopping_cart").insert({
      user_id: userId,
      product_id: productId,
      quantity,
    });
  }
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  await supabase
    .from("shopping_cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function removeFromCart(
  userId: string,
  productId: string
) {
  await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}



/**
 * Syncs frontend cart items to Supabase shopping_cart table
 */
// export async function syncCartToBackend(items: CartItem[], userId: string) {
//   for (const item of items) {
//     await supabase
//       .from("shopping_cart")
//       .upsert({
//         user_id: userId,
//         product_id: item.product_id,
//         quantity: item.quantity,
//       })
//       .select(); // optional
//   }
// }



type SyncItem = {
  productId: string;
  quantity: number;
};

export async function syncCart(
  userId: string,
  items: SyncItem[]
) {
  // 1️⃣ Remove ALL existing cart items for user
  const { error: deleteError } = await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  // 2️⃣ If cart is empty → stop here
  if (items.length === 0) return;

  // 3️⃣ Insert fresh cart items
  const payload = items.map((i) => ({
    user_id: userId,
    product_id: i.productId,
    quantity: i.quantity,
  }));

  const { error: insertError } = await supabase
    .from("shopping_cart")
    .insert(payload);

  if (insertError) throw insertError;
}






