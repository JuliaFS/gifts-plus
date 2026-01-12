"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // optional, for search icon
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import CartIcon from "./cart/CartIcon";
import FavoritesIcon from "./favorites/FavoritesIcon";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isLoading) return null;

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo / Dashboard Link */}
        <Link href="/dashboard" className="font-bold text-xl">
          Gifts Plus
        </Link>

        {/* Search input */}
        <div className="flex items-center border rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="p-2 outline-none w-64 text-black"
          />
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="p-2 bg-gray-200 hover:bg-gray-300 text-black"
          >
            <FaSearch />
          </button>
        </div>

        {/* User / Admin / Icons */}
        <div className="flex gap-4 items-center">
          {!currentUser && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}

          {currentUser && currentUser.role === "ADMIN" && (
            <>
              <Link href="/admin/products" className="hover:underline">
                Admin Products
              </Link>
              <span>Welcome, {currentUser.email}</span>
            </>
          )}

          {currentUser && (
            <button
              onClick={() => logoutMutation.mutate()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}

          {/* Cart & Favorites */}
          <CartIcon />
          <FavoritesIcon />
        </div>
      </nav>
    </header>
  );
}



