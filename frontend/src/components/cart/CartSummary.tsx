// "use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { syncCartToBackend } from "@/services/cart";
import { useCheckout } from "@/app/cart/hooks/useCheckout";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage"; // make sure the path is correct

export default function CartSummary() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const userId = useCurrentUser().data?.id;
  const router = useRouter();

  const { mutate: checkoutCOD, isPending, error } = useCheckout();

  const [commonError, setCommonError] = useState<string | null>(null);

  const total = items.reduce((sum, i) => {
    const price =
      i.product.sales_price && i.product.sales_price < i.product.price
        ? i.product.sales_price
        : i.product.price;
    return sum + price * i.quantity;
  }, 0);

  const handleCODCheckout = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      return;
    }

    try {
      setCommonError(null); // clear previous errors
      await syncCartToBackend(items);
      checkoutCOD(undefined, {
        onSuccess: () => {
          clearCart();
          router.push(`/success?payment=delivery&total=${total.toFixed(2)}`);
        },
      });
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to sync cart");
      console.error(errorMessage);
      setCommonError(errorMessage); // show error to user
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>

      {/* Show backend error from useCheckout */}
      {error && <p className="text-red-600 mt-2">{error.message}</p>}

      {/* Show common error from catch block */}
      {commonError && <p className="text-red-600 mt-2">{commonError}</p>}

      <button
        onClick={handleCODCheckout}
        disabled={isPending || items.length === 0}
        className="mt-3 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center"
      >
        {isPending && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {isPending ? "Processing..." : "Checkout (Pay on Delivery)"}
      </button>
    </div>
  );
}
