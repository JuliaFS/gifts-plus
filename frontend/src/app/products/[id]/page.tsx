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
  // Handle null/undefined stock safely
  const isOutOfStock = (product.stock ?? 0) <= 0;

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
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-32 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        
        {/* LEFT COLUMN: IMAGES */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                    currentImage?.id === img.id ? "border-brand-green" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div ref={mainImageRef} className="relative w-full aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Image
              src={displayImageUrl}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & ACTIONS */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 flex flex-col gap-6 relative z-30">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl font-bold text-gray-900">
                  {product.sales_price ? (
                    <span className="flex items-center gap-3">
                      <span className="text-red-600">{Number(product.sales_price).toFixed(2)} €</span>
                      <span className="text-lg line-through text-gray-400 font-normal">{Number(product.price).toFixed(2)} €</span>
                    </span>
                  ) : (
                    `${Number(product.price).toFixed(2)} €`
                  )}
                </p>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={toggleFavorite} 
                className="p-3 rounded-full bg-gray-50 text-2xl transition-all active:scale-125 hover:bg-gray-100"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
              </button>
              {showMessage && (
                <div className="absolute top-full right-0 mt-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg z-50 whitespace-nowrap shadow-xl font-bold">
                  Login to favorite ❤️
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-4">
            <p className={`text-sm font-medium ${isOutOfStock ? "text-red-500" : "text-emerald-600"}`}>
              {isOutOfStock ? "Currently out of stock" : `In Stock: ${product.stock} units available`}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <AddToCartButton product={product} imgRef={mainImageRef} disabled={isOutOfStock} />
            
            {/* ADMIN ACTIONS */}
            {isAdmin && (
              <div className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <EditButton product={product} onEdit={setEditingProduct} />
                <DeleteButton
                  productId={product.id}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              </div>
            )}
          </div>
        </div>
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
