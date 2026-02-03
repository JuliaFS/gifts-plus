"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "./CkeckoutForm";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const [isHydrated, setIsHydrated] = useState(false);

  // Add payment method state
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isHydrated) return <p>Loading cart...</p>;
  if (!items.length) return <p>Your cart is empty</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}

      {/* COD summary */}
      <CartSummary />

      {/* Payment method selection */}
      <div className="mt-3">
        <label className="mr-4">
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />{" "}
          Pay on Delivery
        </label>
        <label>
          <input
            type="radio"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />{" "}
          Pay Online
        </label>
      </div>

      {/* Stripe checkout only if online payment */}
      {paymentMethod === "online" && (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useCartStore } from "@/store/cartStore";
// import CartItem from "./CartItem";
// import CartSummary from "./CartSummary";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CkeckoutForm";

// export default function CartDrawer() {
//   const items = useCartStore((s) => s.items);
//   const [isHydrated, setIsHydrated] = useState(false);

//   // Wait until Next.js hydration + Zustand/localStorage is ready
//   useEffect(() => {
//     // Schedule state update after render to avoid synchronous setState warning
//     const id = requestAnimationFrame(() => setIsHydrated(true));
//     return () => cancelAnimationFrame(id);
//   }, []);

//   if (!isHydrated) {
//     // Show loading while state is hydrated
//     return <p>Loading cart...</p>;
//   }

//   if (!items.length) return <p>Your cart is empty</p>;

//   return (
//     <div className="space-y-4">
//       {items.map((item) => (
//         <CartItem key={item.product.id} item={item} />
//       ))}
//       <CartSummary />
//       {/* Stripe online payment */}
//       <Elements stripe={stripePromise}>
//         <CheckoutForm />
//       </Elements>
//     </div>
//   );
// }

