"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait until Next.js hydration + Zustand/localStorage is ready
  useEffect(() => {
    // Schedule state update after render to avoid synchronous setState warning
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isHydrated) {
    // Show loading while state is hydrated
    return <p>Loading cart...</p>;
  }

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

