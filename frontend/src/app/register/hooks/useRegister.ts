// hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/services/auth'; // Adjust path

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Optional: Add logic here like redirecting the user or showing a global success toast
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      // Optional: Handle errors globally if needed
      console.error("Registration error:", error.message);
    }
  });
};
