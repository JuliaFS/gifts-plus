"use client";

import { Product } from "@/services/types";
import { useGetProducts } from "./hooks/useGetProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

