"use client";

import Link from "next/link";
import { RiShoppingCartFill } from "react-icons/ri";
import { useCartStore } from "@/store/cartStore";
import { useCartIconRef } from "./CartIconContext";
import { useCartValidation } from "@/app/cart/hooks/useCardValidation";

export default function CartIcon() {
  const cartIconRef = useCartIconRef();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const { validate, isPending } = useCartValidation();

  const handleClick = () => {
    if (!isPending) {
      validate();
    }
  };

  return (
    <Link href="/cart" className="relative" onClick={handleClick}>
      <div ref={cartIconRef}>
        <RiShoppingCartFill size={24} />
      </div>

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}


// 'use client';

// import Link from "next/link";
// import { RiShoppingCartFill } from "react-icons/ri";
// import { useCartStore } from "@/store/cartStore";
// import { useCartIconRef } from "./CartIconContext";

// export default function CartIcon() {
//   const cartIconRef = useCartIconRef();
//   const items = useCartStore((s) => s.items);
//   const count = items.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <Link href="/cart" className="relative">
//       <div ref={cartIconRef}>
//         <RiShoppingCartFill size={24} />
//       </div>

//       {count > 0 && (
//         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//           {count}
//         </span>
//       )}
//     </Link>
//   );
// }



// "use client";

// import Link from "next/link";
// import { useCartStore } from "@/store/cartStore";
// import { RiShoppingCartFill } from "react-icons/ri";


// export default function CartIcon() {
//   const items = useCartStore((s) => s.items);

//   const count = items.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   return (
//     <Link href="/cart" className="relative">
//       <RiShoppingCartFill size={24}/>

//       {count > 0 && (
//         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//           {count}
//         </span>
//       )}
//     </Link>
//   );
// }
