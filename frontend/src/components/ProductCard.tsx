"use client";

import Image from "next/image";
import Link from "next/link";
import { Favorite, Product } from "@/services/types";
import { motion, AnimatePresence } from "framer-motion";
import AddToCartButton from "./cart/AddToCartButton";
import { useRef, useState, useEffect } from "react";
import { useFavorites } from "@/services/hooks/useFavorites";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { getBadges } from "@/utils/productUtils";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  showStock?: boolean;
  showDescription?: boolean;
  href?: string;
}

export default function ProductCard({
  product,
  showStock = true,
  showDescription = true,
  href = `/products/${product.id}`,
}: ProductCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { favoritesQuery, addMutation, removeMutation } = useFavorites();
  const { guard, showMessage } = useAuthGuard(); // use guard
  const [successMessage, setSuccessMessage] = useState("");

  // Effect to clear the success message after 2 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Check if this product is favorited
  const isFavorite = favoritesQuery.data?.some(
    (f: Favorite) => f.product_id === product.id,
  );

  const isOutOfStock = product.stock <= 0;

  // Toggle favorite with guard
  const toggleFavorite = () => {
    guard(() => {
      if (isFavorite) {
        removeMutation.mutate(product.id, {
          onSuccess: () =>
            setSuccessMessage("Product removed from your favorites"),
        });
      } else {
        addMutation.mutate(product.id, {
          onSuccess: () =>
            setSuccessMessage("Product is added to your favorites"),
        });
      }
    });
  };

  // Main image logic
  const mainImage =
    product.product_images?.find((img) => img.is_main)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";

  const badges = getBadges(product);

  return (
    <div className="relative w-full p-2">
      {/* Purple rotated background */}
      <div className="absolute inset-2 bg-brand-green shadow-md rotate-2 rounded-xl z-0" />
      <div
        ref={wrapperRef}
        className="rounded p-4 shadow-sm hover:shadow-md relative z-10 bg-white flex flex-col h-96"
      >
        {/* BADGES */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`px-2 py-1 text-xs font-bold rounded text-white
${badge === "NEW" && "bg-green-500"}
${badge === "SALE" && "bg-red-500"}
${badge === "HOT" && "bg-orange-500"}`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* FAVORITE BUTTON */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 text-xl z-20 transition-transform active:scale-125 hover:scale-110"
        >
          {isFavorite ? <FaHeart size={24} className="text-red-500"/> : <FaRegHeart size={24} />}
        </button>

        {/* TEMP MESSAGE */}
        {showMessage && (
          <div className="absolute top-10 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
            Login to add favorite
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: -20, x: "-50%" }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-bold px-4 py-3 rounded-xl z-50 shadow-2xl text-center pointer-events-none"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT LINK */}
        <Link href={href} className="flex flex-col flex-1">
          <div className="relative mb-2 min-h-32">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain rounded"
            />
          </div>

          <h2 className="text-xl font-semibold line-clamp-2 min-h-12">
            {product.name}
          </h2>

          {showDescription && (
            <p className="text-gray-600 line-clamp-2 mt-2 flex-1">
              {product.description}
            </p>
          )}

          <div className="mt-2 font-bold flex-1 flex flex-col justify-end items-end pr-4">
            {product.sales_price ? (
              <div>
                <span className="line-through text-gray-400 mr-2">
                  {product.price.toFixed(2)} €
                </span>
                <span className="text-red-600">
                  {product.sales_price.toFixed(2)} €
                </span>
              </div>
            ) : (
              <span>{product.price.toFixed(2)} €</span>
            )}
            {showStock && (
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            )}
          </div>
        </Link>

        <div className="mx-auto pt-2">
          <AddToCartButton
            product={product}
            imgRef={wrapperRef}
            disabled={isOutOfStock}
          />
        </div>
      </div>
    </div>
  );
}
