import { deleteProduct } from "@/services/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["products"]}),
  });
}