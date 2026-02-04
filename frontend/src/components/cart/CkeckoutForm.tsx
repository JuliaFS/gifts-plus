"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncCartToBackend } from "@/services/cart";
import { prepareCheckout } from "@/services/checkout";
import { PrepareCheckoutResponse } from "@/services/types";

type PaymentType = "online" | "delivery";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const userId = useCurrentUser().data?.id;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("delivery");

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
      // Sync cart to backend
      await syncCartToBackend(items);

      // Prepare checkout → backend creates order
      const checkoutData: PrepareCheckoutResponse = await prepareCheckout();

      if (paymentType === "online") {
        // Stripe payment
        if (!stripe || !elements) throw new Error("Stripe not loaded");

        const clientSecret = checkoutData.clientSecret;
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! },
        });

        if (result.error) throw new Error(result.error.message || "Payment failed");

        if (result.paymentIntent?.status === "succeeded") {
          clearCart();
          router.push("/success?payment=online");
        }
      } else {
        // Pay on Delivery
        clearCart();
        router.push("/success?payment=delivery");
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
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
            onChange={() => setPaymentType("delivery")}
          />
          Pay on Delivery
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentType === "online"}
            onChange={() => setPaymentType("online")}
          />
          Pay Online
        </label>
      </div>

      {/* Stripe Card input only for online */}
      {paymentType === "online" && (
        <CardElement
          className="my-3 p-2 border rounded"
          options={{ hidePostalCode: true }}
        />
      )}

      {/* Single checkout button based on selected payment */}
      {/* {paymentType === "delivery" && (
        <button
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? "Processing..." : "Place Order (Pay on Delivery)"}
        </button>
      )}

      {paymentType === "online" && (
        <button
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? "Processing..." : "Pay Online"}
        </button>
      )} */}
      <button
  onClick={handleCheckout}
  disabled={loading || items.length === 0}
  className={`w-full py-2 text-white rounded flex justify-center items-center disabled:opacity-50 ${
    paymentType === "delivery" ? "bg-purple-500 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"
  }`}
>
  {loading
    ? "Processing..."
    : paymentType === "delivery"
    ? "Place Order (Pay on Delivery)"
    : "Pay Online"}
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
// import { prepareCheckout } from "@/services/checkout";
// import { PrepareCheckoutResponse } from "@/services/types";

// type PaymentType = "online" | "delivery";

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const items = useCartStore((s) => s.items);
//   const clearCart = useCartStore((s) => s.clearCart);
//   const userId = useCurrentUser().data?.id;
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [paymentType, setPaymentType] = useState<PaymentType>("delivery");

//   const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

//   const handleCheckout = async () => {
//     if (!userId) {
//       setError("You must be logged in to checkout.");
//       setTimeout(() => router.push("/login"), 2000);
//       return;
//     }

//     if (items.length === 0) {
//       setError("Cart is empty");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // 1️⃣ Sync cart to backend
//       await syncCartToBackend(items);

//       // 2️⃣ Prepare checkout → backend creates order
//       const checkoutData: PrepareCheckoutResponse = await prepareCheckout();

//       if (paymentType === "online") {
//         // 3️⃣ Online payment via Stripe
//         if (!stripe || !elements) throw new Error("Stripe not loaded");

//         const clientSecret = checkoutData.clientSecret;
//         const result = await stripe.confirmCardPayment(clientSecret, {
//           payment_method: { card: elements.getElement(CardElement)! },
//         });

//         if (result.error) throw new Error(result.error.message || "Payment failed");

//         if (result.paymentIntent?.status === "succeeded") {
//           clearCart();
//           setSuccess("✅ Payment successful! Order confirmed.");
//           setTimeout(() => router.push("/success"), 1500);
//         }
//       } else {
//         // 3️⃣ Pay on delivery
//         clearCart();
//         setSuccess("✅ Order placed! Please pay when your delivery arrives.");
//         setTimeout(() => router.push("/success"), 1500);
//       }
//     } catch (err: any) {
//       setError(err.message || "Checkout failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border-t pt-4 mt-4 max-w-md mx-auto">
//       <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>

//       {/* Error / Success messages */}
//       {error && <p className="text-red-600 mt-2">{error}</p>}
//       {success && <p className="text-green-600 mt-2">{success}</p>}

//       {/* Payment type selector */}
//       <div className="flex gap-2 mt-2">
//         <button
//           type="button"
//           className={`py-1 px-3 rounded border ${
//             paymentType === "delivery" ? "bg-purple-500 text-white" : ""
//           }`}
//           onClick={() => setPaymentType("delivery")}
//         >
//           Pay on Delivery
//         </button>
//         <button
//           type="button"
//           className={`py-1 px-3 rounded border ${
//             paymentType === "online" ? "bg-purple-500 text-white" : ""
//           }`}
//           onClick={() => setPaymentType("online")}
//         >
//           Pay Online
//         </button>
//       </div>

//       {/* Stripe Card Input only for online */}
//       {paymentType === "online" && (
//         <CardElement
//           className="my-3 p-2 border rounded"
//           options={{ hidePostalCode: true }}
//         />
//       )}

//       {/* Checkout button */}
//       {paymentType === "delivery" && (
//         <button
//           onClick={handleCheckout}
//           disabled={loading || items.length === 0}
//           className="mt-3 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center"
//         >
//           {loading && (
//             <svg
//               className="animate-spin h-5 w-5 mr-2 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//               />
//             </svg>
//           )}
//           {loading ? "Processing..." : "Place Order (Pay on Delivery)"}
//         </button>
//       )}

//       {/* Stripe payment button is handled by CardElement + confirmCardPayment */}
//       {paymentType === "online" && (
//         <button
//           onClick={handleCheckout}
//           disabled={loading || items.length === 0}
//           className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center"
//         >
//           {loading && (
//             <svg
//               className="animate-spin h-5 w-5 mr-2 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//               />
//             </svg>
//           )}
//           {loading ? "Processing..." : "Pay Online"}
//         </button>
//       )}
//     </div>
//   );
// }

// "use client";

// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { useCartStore } from "@/store/cartStore";
// import { useCurrentUser } from "@/services/hooks/useCurrentUser";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { syncCartToBackend } from "@/services/cart";
// import { prepareCheckout } from "@/services/checkout";
// import { PrepareCheckoutResponse } from "@/services/types";

// export default function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const items = useCartStore((s) => s.items);
//   const clearCart = useCartStore((s) => s.clearCart);
//   const userId = useCurrentUser().data?.id;
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

//   const handleCheckout = async () => {
//     if (!userId) {
//       setError("You must be logged in to checkout.");
//       setTimeout(() => router.push("/login"), 2000);
//       return;
//     }

//     if (items.length === 0) {
//       setError("Cart is empty");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       // 1️⃣ Sync cart to backend
//       await syncCartToBackend(items);

//       // 2️⃣ Prepare checkout → backend creates order
//       const checkoutData: PrepareCheckoutResponse = await prepareCheckout();

//       // 3️⃣ Online payment via Stripe
//       if (!stripe || !elements) {
//         throw new Error("Stripe not loaded");
//       }

//       const clientSecret = checkoutData.clientSecret; // returned from backend
//       const result = await stripe.confirmCardPayment(clientSecret!, {
//         payment_method: { card: elements.getElement(CardElement)! },
//       });

//       if (result.error) throw new Error(result.error.message || "Payment failed");

//       if (result.paymentIntent?.status === "succeeded") {
//         clearCart();
//         setSuccess("✅ Payment successful! Order confirmed.");
//         setTimeout(() => router.push("/success"), 1500); // redirect after short delay
//       }
//     } catch (err: any) {
//       setError(err.message || "Checkout failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border-t pt-4 mt-4 max-w-md mx-auto">
//       <p className="font-bold text-lg">Total: {total.toFixed(2)} €</p>

//       {/* Error / Success messages */}
//       {error && <p className="text-red-600 mt-2">{error}</p>}
//       {success && <p className="text-green-600 mt-2">{success}</p>}

//       {/* Stripe Card Input */}
//       <CardElement
//         className="my-3 p-2 border rounded"
//         options={{ hidePostalCode: true }}
//       />

//       {/* Checkout button */}
//       <button
//         onClick={handleCheckout}
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
//         {loading ? "Processing..." : "Pay Online"}
//       </button>
//     </div>
//   );
// }
