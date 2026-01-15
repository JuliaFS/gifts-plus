import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchCurrentUser } from "../auth";
import { User } from "../types";

export function useCurrentUser(): UseQueryResult<User | null> {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData<User>(["currentUser"]);

  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,

    // Set staleTime to Infinity. This means once the data is in the cache,
    // it never becomes "old" enough to trigger a refetch automatically.
    staleTime: Infinity,

    // Only fetch if the cache is empty (undefined).
    // If you log in or reset password, you use setQueryData,
    // which fills the cache and turns this 'false'.
    enabled: cachedUser !== null && cachedUser !== undefined ? false : true,

    // Disable all "automatic" background triggers
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,

    initialData: cachedUser,
  });
}
