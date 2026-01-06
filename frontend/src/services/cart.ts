export type CartItemPayload = {
  productId: string;
  quantity: number;
};

export type InvalidCartItem = {
  productId: string;
  reason: "DELETED" | "OUT_OF_STOCK" | "UNAVAILABLE";
};

export type CartValidationResponse = {
  invalid: InvalidCartItem[];
};
const API_URL = "http://localhost:8080/api/cart";
// POST /api/cart/validate
export async function validateCart(
  items: CartItemPayload[]
): Promise<CartValidationResponse> {
  const res = await fetch(`${API_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || "Failed to validate cart");
  }

  return res.json();
}
