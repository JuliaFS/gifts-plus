import { useCartStore } from "@/store/cartStore";
import { useValidateCart } from "@/app/cart/hooks/useValidateCart";
import { useRef } from "react";

export function useCartValidation() {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const { mutate, isPending } = useValidateCart();
  const prevItemsRef = useRef<typeof items>([]);

  const validate = () => {
    if (!items.length) return;

    const currIds = items.map((i) => i.product.id + i.quantity);
    const prevIds = prevItemsRef.current.map((i) => i.product.id + i.quantity);

    if (currIds.join() === prevIds.join()) return;

    const payload = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    mutate(payload, {
      onSuccess: (data) => {
        data.invalid.forEach((invalidItem) => {
          removeFromCart(invalidItem.productId); // reuse function here
        });
      },
    });

    prevItemsRef.current = items;
  };

  return { validate, isPending };
}


