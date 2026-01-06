import { useMutation } from "@tanstack/react-query";
import { CartItemPayload, CartValidationResponse, validateCart } from "@/services/cart";

export function useValidateCart() {
  return useMutation<CartValidationResponse, Error, CartItemPayload[]>({
    mutationFn: validateCart,
  });
}


