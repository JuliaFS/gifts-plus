import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/services/products";
import { CreateProductInput, Product } from  "@/services/types";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
