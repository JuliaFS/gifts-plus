"use client";

import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/app/cart/hooks/useCheckout";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { syncCartToBackend } from "@/services/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function CartSummary() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const userId = useCurrentUser().data?.id;
  const checkoutMutation = useCheckout();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    // 🚫 Not logged in
    if (!userId) {
      setMessage("You must be logged in to checkout.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return;
    }

    // 🚫 Empty cart
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      // 1️⃣ Sync cart to backend
      await syncCartToBackend(items);

      // 2️⃣ Checkout (awaitable)
      await checkoutMutation.mutateAsync();

      // 3️⃣ Success UI
      clearCart();
      alert("Order completed");
    } catch (err) {
      alert(getErrorMessage(err, "Checkout failed"));
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>

      {message && <p className="text-red-600 mt-2">{message}</p>}

      <button
        onClick={handleCheckout}
        disabled={checkoutMutation.isPending || items.length === 0}
        className="mt-3 w-full bg-purple-500 cursor-pointer text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {checkoutMutation.isPending ? "Processing..." : "Checkout"}
      </button>

      {checkoutMutation.isError && (
        <p className="text-red-600 mt-2">
          {(checkoutMutation.error as Error).message}
        </p>
      )}
    </div>
  );
}
