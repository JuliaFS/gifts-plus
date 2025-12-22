"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/services/types";
import { useGetProducts } from "./hooks/useGetProducts";

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((product: Product) => {
        const mainImage =
          product.product_images?.find((img) => img.is_main) ||
          product.product_images?.[0];

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded p-4 shadow-sm hover:shadow-md transition"
          >
            {mainImage && (
              <Image
                src={mainImage.image_url}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover rounded mb-2"
              />
            )}

            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <p className="mt-2 font-bold">${product.price}</p>
            <p className="text-sm text-gray-500">
              Stock: {product.stock}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
