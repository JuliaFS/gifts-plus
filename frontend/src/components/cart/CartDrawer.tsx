// "use client";

// import { useCartStore } from "@/store/cartStore";
// import CartItem from "./CartItem";
// import CartSummary from "./CartSummary";

// export default function CartDrawer() {
//   const items = useCartStore((s) => s.items);

//   if (!items.length) {
//     return <p>Your cart is empty</p>;
//   }

//   return (
//     <div className="space-y-4">
//       {items.map((item) => (
//         <CartItem
//           key={item.product.id}
//           item={item}
//         />
//       ))}

//       <CartSummary />
//     </div>
//   );
// }
"use client";

import { useCartStore } from "@/store/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);


  if (!items.length) return <p>Your cart is empty</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}
      <CartSummary />
    </div>
  );
}
