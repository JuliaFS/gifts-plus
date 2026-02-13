"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { syncCartToBackend } from "@/services/cart";
import { useCheckout } from "@/app/cart/hooks/useCheckout";
import { usePrepareCheckout } from "@/app/cart/hooks/usePrepareToCheckout";
import { useVerifyPayment } from "@/services/hooks/useVerifyPayment";

type PaymentType = "online" | "delivery";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const userId = useCurrentUser().data?.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>(
    searchParams.get("payment") === "online" ? "online" : "delivery"
  );
  const [isConfirmingStripe, setIsConfirmingStripe] = useState(false);

  const total = items.reduce((sum, i) => {
    const price =
      i.product.sales_price && i.product.sales_price < i.product.price
        ? i.product.sales_price
        : i.product.price;
    return sum + price * i.quantity;
  }, 0);

  // Mutations for each checkout flow
  const { mutate: checkoutCOD, isPending: isPlacingCOD } = useCheckout();
  const { mutate: prepareOnline, isPending: isPreparingOnline } =
    usePrepareCheckout();
  const { mutateAsync, isPending } = useVerifyPayment();

  const isLoading = isPlacingCOD || isPreparingOnline || isConfirmingStripe || isPending;

  const handleCheckout = async () => {
    setError(null);
    if (!userId) {
      setError("You must be logged in to checkout.");
      const returnUrl = `${pathname}?payment=${paymentType}`;
      setTimeout(() => router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`), 2000);
      return;
    }
    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    try {
      // Sync cart first, as both flows rely on backend cart state
      await syncCartToBackend(items);

      if (paymentType === "online") {
        // Prepare online payment (gets client_secret)
        prepareOnline(undefined, {
          onSuccess: async (data) => {
            const clientSecret = data.clientSecret;
            if (!stripe || !elements || !clientSecret) {
              setError("Failed to initialize payment.");
              return;
            }
            setIsConfirmingStripe(true);
            const result = await stripe.confirmCardPayment(clientSecret, {
              payment_method: { card: elements.getElement(CardElement)! },
            });
            setIsConfirmingStripe(false);

            if (result.error) {
              setError(result.error.message || "Payment failed");
              elements.getElement(CardElement)?.clear();
              return;
            }
            if (result.paymentIntent?.status === "succeeded") {
              // 🔹 Notify backend manually to ensure email is sent (fallback for webhook)
              // try {
              //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout/verify-payment`, {
              //     method: "POST",
              //     headers: { "Content-Type": "application/json" },
              //     body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
              //   });
              //   if (!response.ok) {
              //     const errorData = await response.json();
              //     throw new Error(errorData.message || "Backend verification failed.");
              //   }
              //   // ✅ Only redirect on successful verification
              //   clearCart();
              //   router.push(`/success?payment=online&total=${total.toFixed(2)}`);
              // } catch (err) {
              //   setError((err as Error).message || "An error occurred during order finalization.");
              // }
            }
            try {
              await mutateAsync({ paymentIntentId: result.paymentIntent.id });

              // ✅ Only redirect on successful verification
              clearCart();
              router.push(`/success?payment=online&total=${total.toFixed(2)}`);
            } catch (err) {
              setError(
                (err as Error).message ||
                  "An error occurred during order finalization.",
              );
            }
          },
          onError: (err) => {
            setError(err.message || "Failed to prepare payment.");
          },
        });
      } else {
        // Finalize Pay on Delivery order
        checkoutCOD(undefined, {
          onSuccess: () => {
            clearCart();
            router.push(`/success?payment=delivery&total=${total.toFixed(2)}`);
          },
          onError: (err) => {
            setError(err.message || "Failed to place order.");
          },
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync cart with server.");
    }
  };

  return (
    <div className="border-t pt-4 mt-4 max-w-md mx-auto">
      <p className="font-bold text-lg mb-2">Total: {total.toFixed(2)} €</p>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Payment type selector */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="delivery"
            checked={paymentType === "delivery"}
            onChange={() => {
              setPaymentType("delivery");
              setError(null);
            }}
          />
          Pay on Delivery
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentType === "online"}
            onChange={() => {
              setPaymentType("online");
              setError(null);
            }}
          />
          Pay Online
        </label>
      </div>

      {/* Stripe Card input only for online */}
      {paymentType === "online" && userId && (
        <CardElement
          className="my-3 p-2 border rounded"
          options={{ hidePostalCode: true }}
        />
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full py-2 text-white rounded flex justify-center items-center disabled:opacity-50 bg-purple-500 hover:bg-purple-700"
  
      >
        {isLoading
          ? "Processing..."
          : paymentType === "delivery"
            ? "Place Order (Pay on Delivery)"
            : "Pay Online"}
      </button>
    </div>
  );
}
