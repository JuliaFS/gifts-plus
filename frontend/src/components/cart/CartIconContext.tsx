// components/cart/CartIconContext.tsx
'use client';

import { createContext, useContext, useRef } from 'react';

const CartIconContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);


export function CartIconProvider({ children }: { children: React.ReactNode }) {
  const cartIconRef = useRef<HTMLDivElement>(null);

  return (
    <CartIconContext.Provider value={cartIconRef}>
      {children}
    </CartIconContext.Provider>
  );
}

export function useCartIconRef() {
  const ctx = useContext(CartIconContext);
  if (!ctx) {
    throw new Error('useCartIconRef must be used inside CartIconProvider');
  }
  return ctx;
}
