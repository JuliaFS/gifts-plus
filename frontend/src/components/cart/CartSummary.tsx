"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartSummary() {
  const { items, clearCart } = useCartStore();

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  async function checkout() {
    const res = await fetch(
      "http://localhost:8080/checkout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      alert("Checkout failed");
      return;
    }

    clearCart();
    alert("Order completed");
  }

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">
        Total: {total.toFixed(2)} €
      </p>

      <button
        onClick={checkout}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Checkout
      </button>
    </div>
  );
}
