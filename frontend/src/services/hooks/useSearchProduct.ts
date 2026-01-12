import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/services/products";
import { Product } from "@/services/types";

export function useSearchProducts(query: string) {
  return useQuery<Product[], Error>({
    queryKey: ["search-products", query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0, // only run when user typed something
  });
}
