import { resetPassword } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordPayload = {
  token: string | null;
  password: string;
};

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordPayload) =>
      resetPassword(token!, password),
  });
}
