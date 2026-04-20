"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";

import { useGetProductById } from "../hooks/useGetProductById";
import { useDeleteProduct } from "@/app/admin/hooks/useDeleteProduct";
import { ProductImage, Product, Favorite } from "@/services/types";

import AddToCartButton from "@/components/cart/AddToCartButton";
import EditButton from "@/app/admin/products/EditButton";
import DeleteButton from "@/app/admin/products/DeleteButton";
import EditProductModal from "@/app/admin/products/EditProductModal";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useFavorites } from "@/services/hooks/useFavorites";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const productId = id as string;
  const { data: product, isLoading, isError } = useGetProductById(productId);

  const deleteMutation = useDeleteProduct();
  const { data: user } = useCurrentUser();
  const { guard, showMessage } = useAuthGuard();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<ProductImage | null>(null);
  const mainImageRef = useRef<HTMLDivElement | null>(null);

  const { favoritesQuery, addMutation, removeMutation } = useFavorites();

  const images = useMemo(() => {
    if (!product) return []; // Guard for initial render when product is undefined
    const list = product.product_images ?? [];
    return list.map((img, i) => ({
      ...img,
      id: `img-${i}`, // Generate a stable key for local rendering
      position: i, // Use index as position for local rendering
    })) as ProductImage[];
  }, [product]);

  const isFavorite = useMemo(
    () =>
      favoritesQuery.data?.some((f: Favorite) => String(f.product_id) === String(product?.id)),
    [favoritesQuery.data, product?.id],
  );

  // ---- LOADING GUARDS (IMPORTANT) ----
  if (isLoading) return <p>Loading product...</p>;
  if (isError || !product) return <p>Product not found.</p>;

  // ✅ SAFE: product exists here
  const isAdmin = user?.role === "ADMIN";
  const isOutOfStock = product.stock <= 0;

  const toggleFavorite = () => {
    guard(() => {
      if (isFavorite) removeMutation.mutate(product.id);
      else addMutation.mutate(product.id);
    });
  };

  const currentImage =
    activeImage ?? images.find((img) => img.is_main) ?? images[0];

  const displayImageUrl = currentImage?.image_url || "/placeholder.png";

  const handleDelete = (productId: string) => {
    if (!confirm("Delete this product?")) return;

    deleteMutation.mutate(productId, {
      onSuccess: () => router.push("/products"),
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="relative">
          <button 
            onClick={toggleFavorite} 
            className="text-2xl ml-4 transition-transform active:scale-125 hover:scale-110"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          {showMessage && (
            <div className="absolute top-full right-0 mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap shadow-lg">
              Login to favorite ❤️
            </div>
          )}
        </div>
      </div>

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
                  currentImage?.id === img.id
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}

        <div ref={mainImageRef} className="relative w-full h-[250px]">
          <Image
            src={displayImageUrl}
            alt={product.name}
            fill
            className="object-contain rounded"
            priority
          />
        </div>
      </div>

      {/* DETAILS */}
      <p className="mt-6 text-gray-700">{product.description}</p>

      <p className="mt-4 text-2xl font-bold">
        {product.sales_price ? (
          <>
            <span className="line-through text-gray-400 mr-2">
              {product.price.toFixed(2)} €
            </span>
            <span className="text-red-600">
              {product.sales_price.toFixed(2)} €
            </span>
          </>
        ) : (
          `${product.price.toFixed(2)} €`
        )}
      </p>

      <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>

      <div className="mt-6">
        {/* ✅ ADD TO CART DISABLED WHEN OUT OF STOCK */}
        <AddToCartButton
          product={product}
          imgRef={mainImageRef}
          disabled={isOutOfStock}
        />
      </div>

      {/* EDIT MODAL (ADMIN ONLY, NEVER DISABLED BY STOCK) */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
