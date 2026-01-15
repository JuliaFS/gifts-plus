import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders } from "@/services/adminOrders";
import { Order } from "@/services/types";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export function useAdminOrders() {
  const { data: currentUser} = useCurrentUser();

  return useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
    // Only run query if user exists and has ADMIN permission
    enabled: !!currentUser && currentUser.role.includes("ADMIN"),
    
  });
}
