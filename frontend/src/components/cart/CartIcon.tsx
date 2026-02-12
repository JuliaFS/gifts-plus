"use client";

import Link from "next/link";
import { RiShoppingCartFill } from "react-icons/ri";
import { useCartStore } from "@/store/cartStore";
import { useCartIconRef } from "./CartIconContext";

export default function CartIcon() {
  const cartIconRef = useCartIconRef();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link href="/cart" className="relative">
      <div ref={cartIconRef}>
        <RiShoppingCartFill size={24} />
      </div>

      {count > 0 && (
        <span className="absolute -top-2.5 -right-2 bg-purple-500 border border-white text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

