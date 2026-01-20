import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../categories";

export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["products", "category", slug],
    queryFn: () => fetchProductsByCategory(slug),
    enabled: !!slug,
  });
}
