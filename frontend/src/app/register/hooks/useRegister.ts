import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth";
import { RegisterData, User } from "@/services/types";

export function useRegister() {
  return useMutation<User, Error, RegisterData>({
    mutationFn: registerUser,
  });
}
