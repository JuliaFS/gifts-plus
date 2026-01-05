"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";

import { useGetProductById } from "../hooks/useGetProductById";
import { useDeleteProduct } from "@/app/admin/hooks/useDeleteProduct";
import { ProductImage, Product } from "@/services/types";

import AddToCartButton from "@/components/cart/AddToCartButton";
import EditButton from "@/app/admin/products/EditButton";
import DeleteButton from "@/app/admin/products/DeleteButton";
import EditProductModal from "@/app/admin/products/EditProductModal";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const productId = id as string;
  const { data: product, isLoading, isError } = useGetProductById(productId);

  const deleteMutation = useDeleteProduct();

  const { data: user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [activeImage, setActiveImage] = useState<ProductImage | null>(null);

  const mainImageRef = useRef<HTMLDivElement | null>(null);

  const images = useMemo(() => {
    const list = product?.product_images ?? [];
    return list.map((img, i) => ({
      ...img,
      id: (img as ProductImage).id || `img-${i}`,
      position: (img as ProductImage).position || i,
    })) as ProductImage[];
  }, [product]);

  // Derive the image to show: user selected OR default to first image
  const displayImage = activeImage ?? images[0];

  if (isLoading) return <p>Loading product...</p>;
  if (isError || !product) return <p>Product not found.</p>;

  const handleDelete = (productId: string) => {
    if (!confirm("Delete this product?")) return;

    deleteMutation.mutate(productId, {
      onSuccess: () => router.push("/products"),
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div className="flex gap-2 mb-4">
          <EditButton product={product} onEdit={setEditingProduct} />

          <DeleteButton
            productId={product.id}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      )}

      {/* IMAGES */}
      <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6">
        {images.length > 0 && (
          <div className="flex md:flex-col gap-3">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img)}
                className={`border rounded p-1 ${
                  displayImage?.id === img.id
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

        {displayImage && (
          <div ref={mainImageRef} className="relative w-full h-[250px]">
            <Image
              src={displayImage.image_url}
              alt={product.name}
              fill
              className="object-contain rounded"
              priority
            />
          </div>
        )}
      </div>

      {/* DETAILS */}
      <p className="mt-6 text-gray-700">{product.description}</p>
      <p className="mt-4 text-2xl font-bold">
        ${Number(product.price).toFixed(2)}
      </p>
      <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>

      <AddToCartButton product={product} imgRef={mainImageRef} />

      {/* EDIT MODAL */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
