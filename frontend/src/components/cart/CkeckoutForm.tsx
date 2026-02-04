"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncCartToBackend } from "@/services/cart";
import { prepareCheckout} from "@/services/checkout";
import { PrepareCheckoutResponse } from "@/services/types";

type PaymentType = "online" | "offline";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const userId = useCurrentUser().data?.id;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("online"); // <-- dynamic

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!userId) {
      setError("You must be logged in to checkout.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Sync cart to backend
      await syncCartToBackend(items);

      // 2️⃣ Prepare checkout → backend creates order
      const checkoutData: PrepareCheckoutResponse = await prepareCheckout();

      if (paymentType === "online") {
        // 3️⃣ Online payment via Stripe
        if (!stripe || !elements) {
          throw new Error("Stripe not loaded");
        }

        const clientSecret = checkoutData.clientSecret; // assume backend returns this
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! },
        });

        if (result.error) throw new Error(result.error.message || "Payment failed");

        if (result.paymentIntent?.status === "succeeded") {
          clearCart();
          alert("✅ Payment successful! Order confirmed.");
          router.push("/success");
        }
      } else {
        // 3️⃣ Offline payment (cash / manual)
        clearCart();
        alert("✅ Order placed successfully! Please pay at delivery.");
        router.push("/success");
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>
      {error && <p className="text-red-600 mt-2">{error}</p>}

      {paymentType === "online" && (
        <CardElement className="my-3 p-2 border rounded" />
      )}

      {/* Payment type selector */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className={`py-1 px-3 rounded border ${paymentType === "online" ? "bg-purple-500 text-white" : ""}`}
          onClick={() => setPaymentType("online")}
        >
          Pay Online
        </button>
        <button
          type="button"
          className={`py-1 px-3 rounded border ${paymentType === "offline" ? "bg-purple-500 text-white" : ""}`}
          onClick={() => setPaymentType("offline")}
        >
          Pay Offline
        </button>
      </div>

      {/* Single checkout button */}
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="mt-3 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center"
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {loading ? "Processing..." : `Checkout (${paymentType === "online" ? "Pay Online" : "Pay Offline"})`}
      </button>
    </div>
  );
}

// "use client";

// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { useCartStore } from "@/store/cartStore";
// import { useCurrentUser } from "@/services/hooks/useCurrentUser";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { syncCartToBackend } from "@/services/cart";

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const items = useCartStore((s) => s.items);
//   const clearCart = useCartStore((s) => s.clearCart);
//   const userId = useCurrentUser().data?.id;
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

//   const handleOnlineCheckout = async () => {
//     if (!userId) {
//       setError("You must be logged in to checkout.");
//       setTimeout(() => router.push("/login"), 2000);
//       return;
//     }

//     if (items.length === 0) {
//       setError("Cart is empty");
//       return;
//     }

//     if (!stripe || !elements) {
//       setError("Stripe not loaded");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Sync cart to backend
//       await syncCartToBackend(items);

//       // Prepare checkout → backend creates order + Stripe PaymentIntent
//       const res = await fetch("/api/checkout/prepare", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       const clientSecret = data.clientSecret;

//       // Confirm payment
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement)! },
//       });

//       if (result.error) {
//         setError(result.error.message || "Payment failed");
//         return;
//       }

//       if (result.paymentIntent?.status === "succeeded") {
//         clearCart();
//         alert("✅ Payment successful! Order confirmed.");
//         router.push("/success");
//       }
//     } catch (err: any) {
//       setError(err.message || "Checkout failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border-t pt-4 mt-4">
//       <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>
//       {error && <p className="text-red-600 mt-2">{error}</p>}

//       <CardElement className="my-3 p-2 border rounded" />

//       <button
//         onClick={handleOnlineCheckout}
//         disabled={loading || items.length === 0}
//         className="mt-3 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center"
//       >
//         {loading && (
//           <svg
//             className="animate-spin h-5 w-5 mr-2 text-white"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             />
//           </svg>
//         )}
//         {loading ? "Processing..." : "Checkout (Pay Online)"}
//       </button>
//     </div>
//   );
// }