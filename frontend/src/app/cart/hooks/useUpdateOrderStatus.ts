import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/services/adminOrders";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: "SHIPPED" | "CANCELLED";
    }) => updateOrderStatus(orderId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });
}
