"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import CartIcon from "./cart/CartIcon";
import FavoritesIcon from "./favorites/FavoritesIcon";
import { useCategories } from "@/services/hooks/useCategories";
import TopLineCarousel from "./TopLineCarousel";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="w-full">
      {/* Top carousel line */}
      <TopLineCarousel />

      {/* Top bar */}
      <div className="bg-white shadow">
        <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center py-3 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Gifts Plus
          </Link>

          {/* Search */}
          <div className="my-2 flex items-stretch rounded-lg border border-gray-300 overflow-hidden bg-white focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 w-64 text-sm text-black outline-none"
            />

            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition self-stretch"
            >
              <FaSearch size={14} />
            </button>
          </div>

          {/* User & Icons */}
          <div className="flex gap-4 items-center">
            {/* Login / Register */}
            <div className="flex gap-2 min-w-[120px]">
              {isLoading ? (
                <span className="opacity-0">Loading</span>
              ) : !currentUser ? (
                <>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              ) : null}
            </div>

            {/* Admin */}
            {currentUser?.role === "ADMIN" && (
              <div className="flex gap-2 items-center">
                <Link href="/admin/products" className="hover:underline">
                  Admin Products
                </Link>
                <span>Welcome, {currentUser.email}</span>
              </div>
            )}

            {/* Logout */}
            {currentUser && (
              <button
                onClick={() => logoutMutation.mutate()}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
              >
                Logout
              </button>
            )}

            {/* Cart & Favorites */}
            <CartIcon />
            <FavoritesIcon />
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="bg-purple-800 border-t border-purple-900 text-white shadow-lg">
        <nav className="container mx-auto flex items-center py-2 px-4 space-x-6 relative">
          {/* Browse Categories Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-green-300 transition-colors cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Browse Categories <FaChevronDown />
            </button>

            {dropdownOpen && !categoriesLoading && (
              <ul className="absolute top-full left-0 mt-1 bg-white text-black min-w-[200px] shadow-lg rounded overflow-hidden z-50">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 hover:bg-green-100 hover:text-green-800 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Other menu links */}
          <Link
            href="/about"
            className="hover:text-green-300 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-green-300 transition-colors"
          >
            Contact
          </Link>

          {/* Phone info */}
          <span className="hidden md:inline-block">
            Call us: +1 234 567 890
          </span>
        </nav>
      </div>
    </header>
  );
}
