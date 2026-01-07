"use client";

import { useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/app/cart/hooks/useCheckout";
import { useCartValidation } from "@/app/cart/hooks/useCardValidation";

export default function CartSummary() {
  const { items, clearCart } = useCartStore();

  // Hooks
  const checkoutMutation = useCheckout();
  const { validate } = useCartValidation();

  // Total amount
  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  // Handle checkout button click
  const handleCheckout = async () => {
    try {
      // 1️⃣ Validate cart before checkout
      await validate(); // removes invalid products if needed

      // 2️⃣ If cart is empty after validation, stop
      if (items.length === 0) {
        alert("Cart is empty or all products are invalid");
        return;
      }

      // 3️⃣ Trigger checkout mutation
      checkoutMutation.mutate(undefined, {
        onSuccess: () => {
          clearCart(); // clear local cart after successful checkout
          alert("Order completed");
        },
        onError: (err: any) => {
          alert(err.message || "Checkout failed");
        },
      });
    } catch (err: any) {
      // Handle validation errors
      alert(err.message || "Cart validation failed");
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">
        Total: {total.toFixed(2)} €
      </p>

      <button
        onClick={handleCheckout}
        disabled={checkoutMutation.isPending}
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


