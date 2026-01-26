"use client";

import { useState } from "react";
import { Product } from "@/services/types";
import { useGetProducts } from "./hooks/useGetProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useGetProducts(currentPage);

  const products = paginatedData?.data || [];
  const totalPages = paginatedData?.totalPages || 0;

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className="container mx-auto p-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-visible">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
