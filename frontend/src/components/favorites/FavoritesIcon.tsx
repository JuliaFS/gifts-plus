"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { useFavorites } from "@/services/hooks/useFavorites";

export default function FavoritesIcon() {
  const router = useRouter();

  const { guard, showMessage, currentUser: user } = useAuthGuard();

  // Fetch favorites if user is logged in to show counter
  const { favoritesQuery } = useFavorites(!!user);
  const favoritesData = useMemo(
    () => favoritesQuery.data ?? [],
    [favoritesQuery.data],
  );

  const handleClick = () => {
    guard(() => router.push("/favorites"));
  };

  return (
    <div className="relative ml-4">
      <button
        onClick={handleClick}
        className="p-2 text-2xl"
        title="Favorites"
      >
        ❤️
        {user && favoritesData.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
  );
}
