import { useMutation } from "@tanstack/react-query";
import { checkout } from "@/services/checkout";

export function useCheckout() {
  return useMutation({
    mutationFn: checkout,
  });
}
