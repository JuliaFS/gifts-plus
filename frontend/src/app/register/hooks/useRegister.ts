import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth";
import { RegisterData, User } from "@/services/types";

export function useRegister() {
  return useMutation<User, Error, RegisterData>({
    mutationFn: registerUser,
  });
}

// // hooks/useRegister.ts
// import { useMutation, UseMutationOptions } from '@tanstack/react-query';
// import { registerUser } from '@/services/auth'; // Adjust path

// export const useRegister = (options?: UseMutationOptions<any, Error, RegisterData>) => {
//   return useMutation({
//     mutationFn: registerUser,
//     onSuccess: (data) => {
//       // Optional: Add logic here like redirecting the user or showing a global success toast
//       console.log("Registration successful:", data);
//       options?.onSuccess?.(data, undefined as any, undefined as any);
//     },
//     onError: (error) => {
//       // Optional: Handle errors globally if needed
//       console.error("Registration error:", error.message);
//       options?.onError?.(error, undefined as any, undefined as any);
//     }
//   });
// };
