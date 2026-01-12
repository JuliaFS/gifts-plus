import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/services/adminOrders";
import { OrderStatus } from "@/services/types";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

