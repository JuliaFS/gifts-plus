import { useQuery } from "@tanstack/react-query";
import { checkEmailExists } from "@/services/auth";

export function useCheckEmail(email: string) {
  return useQuery({
    queryKey: ["checkEmail", email],
    queryFn: () => checkEmailExists(email),
    enabled: false, // <-- important! Only run manually
  });
}
