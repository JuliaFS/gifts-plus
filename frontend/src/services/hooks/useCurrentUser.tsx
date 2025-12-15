import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

