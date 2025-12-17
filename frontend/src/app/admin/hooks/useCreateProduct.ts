import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/services/products";
import { CreateProductInput, Product } from  "@/services/types";

export function useCreateProduct() {
  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: createProduct,
  });
}

