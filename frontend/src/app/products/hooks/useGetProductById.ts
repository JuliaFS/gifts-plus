import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/products";
import { Product } from "@/services/types";

export function useGetProductById(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId, // prevents undefined calls
  });
}
