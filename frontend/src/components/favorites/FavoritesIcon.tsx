"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { useFavorites } from "@/services/hooks/useFavorites";
import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/services/types";

export default function FavoritesIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();

  const { data: user } = useCurrentUser();

  // Fetch favorites only when modal opens
  const { favoritesQuery } = useFavorites(isOpen);
  const favoritesData = favoritesQuery.data ?? [];

  const handleClick = () => {
    if (!user) {
      alert("You need to login first. Redirecting...");
      setTimeout(() => {
        router.push(`/login?redirect=${currentPath}`);
      }, 2000);
      return;
    }
    setIsOpen(true); // triggers favorites fetch
  };

  const handleProductClick = (productId: string) => {
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
      <button
        onClick={handleClick}
        className="ml-4 p-2 text-2xl"
        title="Favorites"
      >
        ❤️
      </button>

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
                {favoritesData.map((fav: Favorite) => (
                  <div
                    key={fav.product_id}
                    onClick={() => handleProductClick(fav.product_id)}
                    className="cursor-pointer"
                  >
                    <ProductCard product={fav.products} />
                  </div>
                ))}
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


