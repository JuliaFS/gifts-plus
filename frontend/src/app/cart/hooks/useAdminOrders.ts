import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders } from "@/services/adminOrders";
import { Order } from "@/services/types";


export function useAdminOrders() {
  return useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });
}
