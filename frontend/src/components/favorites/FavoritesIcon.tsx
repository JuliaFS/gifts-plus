"use client";

import { useState, useEffect, useMemo, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { useFavorites } from "@/services/hooks/useFavorites";
import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/services/types";

export default function FavoritesIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { guard, showMessage, currentUser: user } = useAuthGuard();

  // Fetch favorites if user is logged in to show counter
  const { favoritesQuery } = useFavorites(!!user);
  const favoritesData = useMemo(
    () => favoritesQuery.data ?? [],
    [favoritesQuery.data],
  );

  const handleClick = () => {
    guard(() => setIsOpen(true));
  };

  // const handleProductClick = (productId: string) => {
  const handleProductClick = (e: MouseEvent, productId: string) => {
    // Prevent navigation if clicking a button inside the card (e.g., add to cart, favorite)
    if ((e.target as HTMLElement).closest("button")) return;

    setIsOpen(false);
    router.push(`/products/${productId}`);
  };

  const goToFavoritesPage = () => {
    setIsOpen(false);
    router.push("/favorites");
  };

  // Close modal automatically if no favorites after loading
  useEffect(() => {
    if (!favoritesQuery.isLoading && favoritesData.length === 0 && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 2000); // show message for 2 seconds before closing
      return () => clearTimeout(timer);
    }
  }, [favoritesQuery.isLoading, favoritesData, isOpen]);

  return (
    <>
      {/* Favorites Icon */}
      <div className="relative ml-4">
        <button
          onClick={handleClick}
          className="p-2 text-2xl"
          title="Favorites"
        >
          ❤️
          {user && favoritesData.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {favoritesData.length}
            </span>
          )}
        </button>
        {showMessage && (
          <div className="absolute top-full right-0 mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap">
            You need to login first
          </div>
        )}
      </div>

      {/* Favorites Modal */}
      {isOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Favorites</h2>
              <button
                className="text-red-500 text-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Loading / Error / Empty States */}
            {favoritesQuery.isLoading && <p>Loading favorites...</p>}
            {favoritesQuery.isError && (
              <p className="text-red-500">Failed to load favorites.</p>
            )}
            {!favoritesQuery.isLoading && favoritesData.length === 0 && (
              <p className="text-black">No favorites added.</p>
            )}

            {/* Favorites Grid */}
            {favoritesData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* {favoritesData.map((fav: Favorite) => (
                  <div
                    key={fav.product_id}
                    onClick={() => handleProductClick(fav.product_id)}
                    className="cursor-pointer"
                  >
                    <ProductCard product={fav.products} />
                  </div>
                ))} */}
                {favoritesData.map((fav: Favorite) => {
                  if (!fav.products) return null; // 👈 THIS IS THE FIX

                  return (
                    <div
                      key={fav.product_id}
                      onClick={(e) => handleProductClick(e, fav.product_id)}
                      className="cursor-pointer"
                    >
                      <ProductCard product={fav.products} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* See All Favorites Button */}
            {favoritesData.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={goToFavoritesPage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  See All Favorites
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
