"use client";

import { Suspense } from "react";
import { useSearchProducts } from "@/services/hooks/useSearchProduct";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { data: products, isLoading, isError } = useSearchProducts(query);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for "{query}"
      </h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to load search results</p>}
      {products?.length === 0 && query && <p>No results found</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading search results...</p>}>
      <SearchResults />
    </Suspense>
  );
}
