import { CartItem } from "@/store/cartStore";

const API_URL = "http://localhost:8080/api/cart";

export async function syncCartToBackend(items: CartItem[]) {
  const payload = items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
  }));

  const res = await fetch(`${API_URL}/sync`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: payload }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to sync cart");
  }

  return res.json();
}
