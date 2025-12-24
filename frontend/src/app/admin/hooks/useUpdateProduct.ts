import { updateProduct } from "@/services/products";
import { Product, UpdateProductInput } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductInput>({
    mutationFn: ({ productId, updates }) =>
      updateProduct(productId, updates),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

