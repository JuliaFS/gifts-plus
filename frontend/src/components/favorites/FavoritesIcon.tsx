"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { useFavorites } from "@/services/hooks/useFavorites";
import { FaRegHeart } from "react-icons/fa";

export default function FavoritesIcon() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { guard, showMessage, currentUser: user } = useAuthGuard();

  // Fetch favorites if user is logged in to show counter
  const { favoritesQuery } = useFavorites(!!user);
  const favoritesData = useMemo(
    () => favoritesQuery.data ?? [],
    [favoritesQuery.data],
  );

  const handleClick = () => {
    if (!user) {
      setIsPromptOpen((prev) => !prev);
    }
    guard(() => router.push("/favorites"));
  };

  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (showMessage) setIsPromptOpen(true);
  }, [showMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPromptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleClick}
        className="p-2 text-2xl cursor-pointer"
        title="Favorites"
      >
        <FaRegHeart size={22}/>
        {user && favoritesData.length > 0 && (
          <span className="absolute top-0.5 -right-1 bg-brand-green border border-white text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
