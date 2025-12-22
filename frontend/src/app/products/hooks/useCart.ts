// hooks/useCart.ts
import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState<{productId: string, quantity: number}[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('guest_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToGuestCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { productId, quantity: 1 }];
      }
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  return { cart, addToGuestCart };
}