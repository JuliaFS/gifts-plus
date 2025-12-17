import { useCurrentUser } from "./useCurrentUser";

export function useIsAdmin() {
  const { data: user, isLoading } = useCurrentUser();

  return {
    isAdmin: user?.role === "admin",
    isLoading,
  };
}
