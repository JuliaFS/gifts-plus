"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetProductById } from "../hooks/useGetProductById";
import { useEffect, useState } from "react";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading, isError } = useGetProductById(productId);

  // ✅ Hooks MUST be here (top level)
  const [activeImage, setActiveImage] = useState<any | null>(null);
  const [count, setCount] = useState(1);


  // ✅ Sync active image once product loads
  useEffect(() => {
  if (product && images.length > 0 && !activeImage) {
    setActiveImage(images[0]); // ✅ only runs once when product loads
  }
}, [product, images, activeImage]);



  // ⛔ returns AFTER hooks
  if (isLoading) return <p>Loading product...</p>;
  if (isError || !product) return <p>Product not found.</p>;

  const images = product.product_images ?? [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6">
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-3">
            {images.map((img: any) => (
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
        {activeImage && (
          <Image
            src={activeImage.image_url}
            alt={product.name}
            width={800}
            height={600}
            className="w-full h-[450px] object-cover rounded"
            priority
          />
        )}
      </div>

      <p className="mt-6 text-gray-700">{product.description}</p>
      <p className="mt-4 text-2xl font-bold">${product.price}</p>
      <p className="text-sm text-gray-500 mt-1">
        Stock: {product.stock}
      </p>
    </div>
  );
}



