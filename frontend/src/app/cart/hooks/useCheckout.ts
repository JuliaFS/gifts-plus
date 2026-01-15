import { useMutation } from "@tanstack/react-query";
import { checkout} from "@/services/checkout";
import { FetchError } from "@/utils/handleFetchError";
import { CheckoutResponse } from "@/services/types";

export function useCheckout() {
  return useMutation<CheckoutResponse, FetchError>({
    mutationFn: checkout,
  });
}

