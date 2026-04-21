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
  const [isHydrated, setIsHydrated] = useState(false);

  // Set isHydrated to true once the component mounts on the client
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleAdd = () => {
    // If stock is disabled, do nothing
    if (disabled) return;
    // If not hydrated yet, ignore the click silently rather than showing a 'dead' button
    if (!isHydrated) return;

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
        className={`mt-2 px-6 py-2 rounded-xl text-white shadow-md transition-all duration-200 font-bold relative
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-brand-green to-pink-400 to-green-600 hover:opacity-90 hover:shadow-lg active:scale-95 cursor-pointer"
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