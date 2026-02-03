import { PrepareCheckoutResponse } from "@/services/types";
import { useMutation } from "@tanstack/react-query";
import { prepareCheckout } from "@/services/checkout";

export function usePrepareCheckout() {
  return useMutation<PrepareCheckoutResponse, Error>({
    mutationFn: prepareCheckout,
  });
}