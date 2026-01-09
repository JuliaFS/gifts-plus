"use client";

import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/app/cart/hooks/useCheckout";

import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { syncCartToBackend } from "@/services/cart";

export default function CartSummary() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  //const userId = useAuthStore((s) => s.user?.id);
  const userId =  useCurrentUser().data?.id;

  const checkoutMutation = useCheckout();

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!userId) {
      alert("You must be logged in");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      // 1️⃣ Sync cart to backend
      await syncCartToBackend(items, userId);

      // 2️⃣ Call checkout
      checkoutMutation.mutate(undefined, {
        onSuccess: () => {
          clearCart();
          alert("Order completed");
        },
        onError: (err: any) => {
          alert(err.message || "Checkout failed");
        },
      });
    } catch (err: any) {
      alert(err.message || "Failed to sync cart");
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">
        Total: {total.toFixed(2)} €
      </p>

      <button
        onClick={handleCheckout}
        disabled={checkoutMutation.isPending || items.length === 0}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
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
