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

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
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
    <header>
      {/* TOP BAR */}
      <div className="bg-white shadow">
        <nav className="container mx-auto flex justify-between items-center py-3 px-4">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl text-black">
            Gifts Plus
          </Link>

          {/* Search */}
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
              onClick={handleSearch}
              className="p-2 bg-gray-200 hover:bg-gray-300 text-black"
            >
              <FaSearch />
            </button>
          </div>

          {/* User & Icons */}
          <div className="flex gap-4 items-center">
            {!isLoading && !currentUser && (
              <div className="flex gap-2">
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </div>
            )}

            {currentUser?.role === "ADMIN" && (
              <div className="flex gap-2 items-center">
                <Link href="/admin/products" className="hover:underline">
                  Admin Products
                </Link>
                <span>Welcome, {currentUser.email}</span>
              </div>
            )}

            {currentUser && (
              <button
                onClick={() => logoutMutation.mutate()}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
              >
                Logout
              </button>
            )}

            <CartIcon />
            <FavoritesIcon />
          </div>
        </nav>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-green-800 border-t border-green-900 text-white">
        <nav className="container mx-auto flex items-center py-2 px-4 space-x-6 relative">
          {/* Phone Info */}
          <span className="hidden md:inline-block">Call us: +1 234 567 890</span>

          {/* Browse Categories Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-green-300 transition-colors cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Browse Categories <FaChevronDown />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && !categoriesLoading && (
              <ul className="absolute top-full left-0 mt-1 bg-white text-black min-w-[200px] shadow-lg rounded overflow-hidden z-50">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 hover:bg-green-100 hover:text-green-800 transition-colors"
                      onClick={() => setDropdownOpen(false)} // close menu on click
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Other menu links */}
          <Link href="/about" className="hover:text-green-300 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-green-300 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}


