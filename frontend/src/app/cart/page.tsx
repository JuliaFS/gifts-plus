//"use client";

import CartDrawer from "@/components/cart/CartDrawer";

export default function CartPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Shopping Cart
      </h1>

      <CartDrawer />
    </div>
  );
}
