import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth";
import { LoginData, User } from "@/services/types";

export function useLogin() {
  return useMutation<User, Error, LoginData>({
    mutationFn: loginUser,
  });
}