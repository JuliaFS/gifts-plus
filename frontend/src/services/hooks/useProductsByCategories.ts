import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../categories";

export function useCategoryWithProducts(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchProductsByCategory(slug),
    enabled: !!slug,
  });
}
