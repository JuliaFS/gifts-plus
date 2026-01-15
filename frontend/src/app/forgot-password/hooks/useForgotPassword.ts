import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth";
import { ForgotPasswordResponse } from "@/services/types";

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: (email: string) => forgotPassword(email),
  });
}
