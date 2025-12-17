"use client";
import Image from "next/image";
import { Product } from "@/services/types";
import { useGetProducts } from "./hooks/useGetProducts";
import { Autour_One } from "next/font/google";

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((product: Product) => (
        <div key={product.id} className="border rounded p-4 shadow-sm">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              width={150}
              height={150}
              className="object-cover rounded"
            />
          )}

          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>

          <p className="mt-2 font-bold">${product.price}</p>

          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
