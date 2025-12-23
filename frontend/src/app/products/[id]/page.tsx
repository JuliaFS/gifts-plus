"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetProductById } from "../hooks/useGetProductById";
import { useEffect, useState, useMemo, useRef } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { ProductImage } from "@/services/types";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading, isError } = useGetProductById(productId);

  // ✅ Hooks always at the top
  const [activeImage, setActiveImage] = useState<ProductImage | null>(null);
  const mainImageRef = useRef<HTMLDivElement | null>(null);

  // ✅ Memoize images array
  const images = useMemo(() => product?.product_images ?? [], [product]);

  // ✅ Set first image once
 useEffect(() => {
  if (images.length > 0 && !activeImage) {
    // defer setting state to the next tick
    const id = setTimeout(() => {
      setActiveImage(images[0]);
    }, 0);

    return () => clearTimeout(id); // cleanup
  }
}, [images, activeImage]);

  // Early returns AFTER hooks
  if (isLoading) return <p>Loading product...</p>;
  if (isError || !product) return <p>Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-3">
            {images.map((img: ProductImage) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img)}
                className={`border rounded p-1 ${
                  activeImage?.id === img.id
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt=""
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        {/* {activeImage && (
          <Image
            src={activeImage.image_url}
            alt={product.name}
            width={800}
            height={600}
            className="w-full max-h-[450px] object-contain rounded"
            priority
          />
        )} */}
        {activeImage && (
  <div ref={mainImageRef} className="w-full max-h-[450px] relative rounded">
    <Image
      src={activeImage.image_url}
      alt={product.name}
      fill
      className="object-contain rounded"
      priority
    />
  </div>
)}
      </div>

      <p className="mt-6 text-gray-700">{product.description}</p>
      <p className="mt-4 text-2xl font-bold">${product.price}</p>
      <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>
      <AddToCartButton product={product} imgRef={mainImageRef} />
    </div>
  );
}




