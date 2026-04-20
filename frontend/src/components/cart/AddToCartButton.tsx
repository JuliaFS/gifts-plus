import { Product } from "@/services/types";
import FlyToCart from "./FlyAnimation";
import { useCartIconRef } from "./CartIconContext";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

type Props = {
  product: Product;
  imgRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

export default function AddToCartButton({
  product,
  imgRef,
  disabled = false,
}: Props) {
  const cartIconRef = useCartIconRef();
  const { addToCart } = useCartStore();
  const [fly, setFly] = useState<{
    imageUrl: string;
    from: DOMRect;
    to: DOMRect;
  } | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = () => {
    if (disabled) return;

    addToCart(product, 1);
    
    // Clear and reset message to ensure the animation/re-render triggers every click
    setMessage(null);
    setTimeout(() => {
      setMessage(`${product.name} added to cart`);
    }, 10);

    if (!imgRef.current || !cartIconRef.current) return;

    const from = imgRef.current.getBoundingClientRect();
    const to = cartIconRef.current.getBoundingClientRect();

    setFly({
      imageUrl: product.product_images?.[0]?.image_url || "",
      from,
      to,
    });
  };

  // Auto-clear message
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`mt-2 px-3 py-1 rounded text-white shadow-sm transition cursor-pointer z-[1000]
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
          }
        `}
      >
        {disabled ? "Out of stock" : "Add to Cart"}
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
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-[9999] animate-bounce">
          {message}
        </div>
      )}
    </>
  );
}