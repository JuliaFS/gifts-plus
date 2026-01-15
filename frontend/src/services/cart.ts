import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CartItem } from "@/store/cartStore";

export async function syncCartToBackend(items: CartItem[]) {
  const payload = items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
  }));

  const res = await fetch(API.cart.sync(), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: payload }),
  });

  return handleFetchError(res, "Failed to sync cart.");
}
