import { useMutation } from "@tanstack/react-query";
import { sendContactMessage, ContactFormData } from "@/services/contacts";

export function useContactForm() {
  return useMutation<
    { message: string },
    Error,
    ContactFormData
  >({
    mutationFn: sendContactMessage,
  });
}