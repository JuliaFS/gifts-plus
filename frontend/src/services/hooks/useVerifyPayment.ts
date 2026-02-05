import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../checkout";

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
  });
};
