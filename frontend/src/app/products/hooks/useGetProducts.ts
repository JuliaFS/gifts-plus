import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/products";

export function useGetProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}
