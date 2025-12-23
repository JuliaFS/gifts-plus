"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/services/types";
import AddToCartButton from "./cart/AddToCartButton";
import { useRef } from "react";

type ProductCardProps = {
  product: Product;
  showStock?: boolean;
  showDescription?: boolean;
  href?: string;
};

export default function ProductCard({
  product,
  showStock = true,
  showDescription = true,
  href = `/products/${product.id}`,
}: ProductCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const mainImage =
    product.product_images?.find((img) => img.is_main) ||
    product.product_images?.[0];
  const imageRef = useRef<HTMLImageElement>(null);
  return (
    <div ref={wrapperRef} className="border rounded p-4 shadow-sm hover:shadow-md">
      <Link href={href} className="transition block">
        {mainImage && (
          <Image
            ref={imageRef}
            src={mainImage.image_url}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover rounded mb-2"
          />
        )}

        <h2 className="text-xl font-semibold">{product.name}</h2>

        {showDescription && (
          <p className="text-gray-600 line-clamp-2">{product.description}</p>
        )}

        <p className="mt-2 font-bold">{product.price} €</p>

        {showStock && (
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        )}
      </Link>

      <AddToCartButton product={product} imgRef={wrapperRef} />
    </div>
  );
}
