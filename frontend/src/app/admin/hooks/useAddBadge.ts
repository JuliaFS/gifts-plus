import { addBadgeToProduct } from "@/services/products";
import { Product } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddBadge() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: string; badge?: string; promotion?: string }>({
    mutationFn: ({ id, badge, promotion }) => addBadgeToProduct(id, badge, promotion),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}