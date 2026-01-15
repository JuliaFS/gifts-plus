import { resetPassword } from "@/services/auth";
import { ResetPasswordResponse } from "@/services/types";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordPayload = {
  token: string;
  password: string;
};

export function useResetPassword() {
  return useMutation<
    ResetPasswordResponse, // ✅ response
    Error,                 // ✅ error
    ResetPasswordPayload   // ✅ variables
  >({
    mutationFn: ({ token, password }) =>
      resetPassword(token, password),
  });
}
