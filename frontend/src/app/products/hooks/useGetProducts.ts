import { fetchProducts } from "@/services/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProducts = (page: number) => {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    placeholderData: (previousData) => previousData,
  });
};

