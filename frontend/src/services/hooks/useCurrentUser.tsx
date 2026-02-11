import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchCurrentUser } from "../auth";
import { User } from "../types";

export function useCurrentUser(): UseQueryResult<User | null> {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,

    staleTime: 0, // always stale

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    retry: false,
  });
}
