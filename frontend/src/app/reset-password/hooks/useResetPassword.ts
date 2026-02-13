import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/resetPasswordService";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};