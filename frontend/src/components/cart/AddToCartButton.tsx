import { Product } from "@/services/types";
import FlyToCart from "./FlyAnimation";
import { useCartIconRef } from "./CartIconContext";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

type Props = {
  product: Product;
  imgRef: React.RefObject<HTMLDivElement | null>;
};

export default function AddToCartButton({ product, imgRef }: Props) {
  const cartIconRef = useCartIconRef();
  const { addToCart } = useCartStore();
  const [fly, setFly] = useState<{
    imageUrl: string;
    from: DOMRect;
    to: DOMRect;
  } | null>(null);

   const [message, setMessage] = useState<string | null>(null);

  const handleAdd = () => {
    addToCart(product, 1);

    if (!imgRef.current || !cartIconRef.current) return;

    const from = imgRef.current.getBoundingClientRect();
    const to = cartIconRef.current.getBoundingClientRect();

    setFly({
      imageUrl: product.product_images?.[0]?.image_url || "",
      from,
      to,
    });
      // Show message
  setMessage(`${product.name} added to cart`);

  setTimeout(() => {
    setMessage(null); // disappears after 2 seconds
  }, 2000);
  };

   // Clear message after 2 seconds
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <button
        onClick={handleAdd}
        className="mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm cursor-pointer text-white rounded"
      >
        Add to Cart
      </button>

      {fly && (
        <FlyToCart
          imageUrl={fly.imageUrl}
          from={fly.from}
          to={fly.to}
          onComplete={() => setFly(null)}
        />
      )}
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </>
  );
}




// "use client";

// import { Product } from "@/services/types";
// import { useCartStore } from "@/store/cartStore";

// type Props = {
//   product: Product;
// };

// export default function AddToCartButton({ product }: Props) {
//   const addToCart = useCartStore((s) => s.addToCart);

  

//   return (
//     <button
//       onClick={() => {
//         console.log("ADD TO CART CLICKED", product.id);
//         addToCart(product);
//       }}
//       className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
//     >
//       Add to Cart
//     </button>
//   );
// }
