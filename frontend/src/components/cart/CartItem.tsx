'use client';

import Image from "next/image";
import { CartItem as Item } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

type Props = {
  item: Item;
};

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const [draft, setDraft] = useState(String(item.quantity));
  const [message, setMessage] = useState<string | null>(null);

  const DEBOUNCE_MS = 500;

  const mainImage =
    item.product.product_images?.find((i) => i.is_main) ||
    item.product.product_images?.[0];

  // ✅ Debounced quantity update
  useEffect(() => {
    if (draft === "") return;

    const timer = setTimeout(() => {
      const value = Math.max(1, Number(draft));
      updateQuantity(item.product.id, value);
      showMessage("Quantity updated");
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [draft, updateQuantity, item.product.id]);

  // ✅ Helper to show message for 2 seconds
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const increase = () => {
    const value = Number(draft) + 1;
    setDraft(String(value));
    updateQuantity(item.product.id, value);
    showMessage("Quantity updated");
  };

  const decrease = () => {
    const value = Math.max(1, Number(draft) - 1);
    setDraft(String(value));
    updateQuantity(item.product.id, value);
    showMessage("Quantity updated");
  };

  return (
    <div className="flex gap-4 border-b pb-4 relative">
      {mainImage && (
        <Image
          src={mainImage.image_url}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded"
        />
      )}

      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-sm">{item.product.price} €</p>

        <div className="flex items-center gap-2 mt-2">
          <button onClick={decrease} className="px-2 border rounded">−</button>

          <input
            type="text"
            inputMode="numeric"
            value={draft}
            className="w-12 text-center border rounded"
            onChange={(e) => {
              if (!/^\d*$/.test(e.target.value)) return;
              setDraft(e.target.value);
            }}
            onBlur={() => {
              const value = Math.max(1, Number(draft || "1"));
              updateQuantity(item.product.id, value);
              setDraft(String(value));
              showMessage("Quantity updated");
            }}
          />

          <button onClick={increase} className="px-2 border rounded">+</button>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="text-red-500 text-sm ml-4"
          >
            Remove
          </button>
        </div>

        {/* ✅ Temporary message */}
        {message && (
          <p className="absolute text-green-600 text-xs mt-0.5">{message}</p>
        )}
      </div>
    </div>
  );
}


// "use client";

// import Image from "next/image";
// import { CartItem as Item } from "@/store/cartStore";
// import { useCartStore } from "@/store/cartStore";
// import { useEffect, useState } from "react";

// type Props = {
//   item: Item;
// };

// export default function CartItem({ item }: Props) {
//   const { updateQuantity, removeFromCart } = useCartStore();
//   const [draft, setDraft] = useState(String(item.quantity));

//   const DEBOUNCE_MS = 500;

//   const mainImage =
//     item.product.product_images?.find((i) => i.is_main) ||
//     item.product.product_images?.[0];

//   // ✅ Debounced quantity update
//   useEffect(() => {
//     if (draft === "") return;

//     const timer = setTimeout(() => {
//       const value = Math.max(1, Number(draft));
//       updateQuantity(item.product.id, value);
//     }, DEBOUNCE_MS);

//     return () => clearTimeout(timer);
//   }, [draft, updateQuantity, item.product.id]);

//   const increase = () => {
//     const value = Number(draft) + 1;
//     setDraft(String(value));
//     updateQuantity(item.product.id, value);
//   };

//   const decrease = () => {
//     const value = Math.max(1, Number(draft) - 1);
//     setDraft(String(value));
//     updateQuantity(item.product.id, value);
//   };

//   return (
//     <div className="flex gap-4 border-b pb-4 relative">
//       {mainImage && (
//         <Image
//           src={mainImage.image_url}
//           alt={item.product.name}
//           width={80}
//           height={80}
//           className="rounded"
//         />
//       )}

//       <div className="flex-1">
//         <h3 className="font-semibold">{item.product.name}</h3>
//         <p className="text-sm">{item.product.price} €</p>

//         <div className="flex items-center gap-2 mt-2">
//           {/* ➖ */}
//           <button onClick={decrease} className="px-2 border rounded">
//             −
//           </button>

//           {/* quantity */}
//           <input
//             type="text"
//             inputMode="numeric"
//             value={draft}
//             className="w-12 text-center border rounded"
//             onChange={(e) => {
//               if (!/^\d*$/.test(e.target.value)) return;
//               setDraft(e.target.value);
//             }}
//             onBlur={() => {
//               const value = Math.max(1, Number(draft || "1"));
//               updateQuantity(item.product.id, value);
//               setDraft(String(value));
//             }}
//           />

//           {/* ➕ */}
//           <button onClick={increase} className="px-2 border rounded">
//             +
//           </button>

//           <button
//             onClick={() => removeFromCart(item.product.id)}
//             className="text-red-500 text-sm ml-4"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Image from "next/image";
// import { CartItem as Item } from "@/store/cartStore";
// import { useCartStore } from "@/store/cartStore";
// import { useEffect, useState } from "react";

// type Props = {
//   item: Item;
// };

// export default function CartItem({ item }: Props) {
//   const { updateQuantity, removeFromCart } = useCartStore();
//   const [draft, setDraft] = useState(String(item.quantity));

//   const DEBOUNCE_MS = 500;

//   const mainImage =
//     item.product.product_images?.find((i) => i.is_main) ||
//     item.product.product_images?.[0];

//   useEffect(() => {
//     if (draft === "") return;

//     const timer = setTimeout(() => {
//       const value = Math.max(1, Number(draft));
//       updateQuantity(item.product.id, value);
//     }, DEBOUNCE_MS);

//     return () => clearTimeout(timer);
//   }, [draft, updateQuantity, item.product.id]);

//   return (
//     <div className="flex gap-4 border-b pb-4">
//       {mainImage && (
//         <Image
//           src={mainImage.image_url}
//           alt={item.product.name}
//           width={80}
//           height={80}
//           className="rounded"
//         />
//       )}

//       <div className="flex-1">
//         <h3 className="font-semibold">{item.product.name}</h3>
//         <p className="text-sm">{item.product.price} €</p>

//         <div className="flex items-center gap-2 mt-2">
//           <input
//             type="text"
//             inputMode="numeric"
//             value={draft}
//             onChange={(e) => {
//               if (!/^\d*$/.test(e.target.value)) return;
//               setDraft(e.target.value);
//             }}
//             onBlur={() => {
//               const value = Math.max(1, Number(draft || "1"));
//               updateQuantity(item.product.id, value);
//               setDraft(String(value));
//             }}
//           />

//           <button
//             onClick={() => removeFromCart(item.product.id)}
//             className="text-red-500 text-sm"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
