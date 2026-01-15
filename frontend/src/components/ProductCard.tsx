"use client";

import Image from "next/image";
import Link from "next/link";
import { Favorite, Product } from "@/services/types";
import AddToCartButton from "./cart/AddToCartButton";
import { useRef } from "react";
import { useFavorites } from "@/services/hooks/useFavorites";

type BadgeType = "NEW" | "SALE" | "HOT";

function isNew(createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();
  return (now.getTime() - created.getTime()) / 86400000 <= 20;
}

function getBadges(product: Product): BadgeType[] {
  const badges: BadgeType[] = [];

  if (isNew(product.created_at)) badges.push("NEW");
  if (product.sales_price != null) badges.push("SALE");
  if ((product.sales_count ?? 0) >= 50) badges.push("HOT");

  return badges;
}

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

  // Check if this product is favorited
  const isFavorite = favoritesQuery.data?.some(
    (f: Favorite) => f.product_id === product.id
  );

  // Toggle favorite
  const toggleFavorite = () => {
    if (isFavorite) removeMutation.mutate(product.id);
    else addMutation.mutate(product.id);
  };

  // Main image logic: main -> first -> fallback
  const mainImage =
    product.product_images?.find((img) => img.is_main)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png"; // fallback if no image

  const badges = getBadges(product);

  return (
    <div
      ref={wrapperRef}
      className="border rounded p-4 shadow-sm hover:shadow-md relative"
    >
      {/* BADGES */}
      <div className="absolute top-2 left-2 flex gap-1 z-10">
        {badges.map((badge) => (
          <span
            key={badge}
            className={`px-2 py-1 text-xs font-bold rounded text-white
              ${badge === "NEW" && "bg-green-500"}
              ${badge === "SALE" && "bg-red-500"}
              ${badge === "HOT" && "bg-orange-500"}
            `}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* FAVORITE BUTTON */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-xl z-10"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* PRODUCT LINK */}
      <Link href={href} className="transition block">
        {mainImage && (
          <Image
            src={mainImage}
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

        {/* PRICE */}
        <div className="mt-2 font-bold">
          {product.sales_price ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                {product.price} €
              </span>
              <span className="text-red-600">{product.sales_price} €</span>
            </>
          ) : (
            <span>{product.price} €</span>
          )}
        </div>

        {showStock && (
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        )}
      </Link>

      <AddToCartButton product={product} imgRef={wrapperRef} />
    </div>
  );
}
