"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaBars,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import CartIcon from "./cart/CartIcon";
import FavoritesIcon from "./favorites/FavoritesIcon";
import { useCategories } from "@/services/hooks/useCategories";
import { useSearchProducts } from "@/services/hooks/useSearchProduct";
import TopLineCarousel from "./TopLineCarousel";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live search check to show "No results" message
  const { data: searchResults, isError: isSearchError, isLoading: isSearchLoading } = useSearchProducts(searchQuery);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search query when closed and focus when opened
  useEffect(() => {
    if (!isSearchOpen) {
      const timer = setTimeout(() => setSearchQuery(""), 500);
      return () => clearTimeout(timer);
    } else {
      // Delay focus slightly to allow transition to start
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      router.push("/");
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="w-full relative">
      {/* Top carousel line */}
      <TopLineCarousel />

      {/* Top bar */}
      <div className="bg-white shadow">
        <nav className="w-full flex flex-col md:flex-row justify-between items-center py-3 px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Gifts Plus
          </Link>

          {/* User & Icons */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Login / Register */}

            {/* Admin */}
            {currentUser?.role === "ADMIN" && (
              <div className="flex gap-2 items-center w-full md:w-auto justify-center order-last md:order-0">
                <Link href="/admin/products" className="hover:underline">
                  Admin Products
                </Link>
                <span>Welcome, {currentUser.email}</span>
              </div>
            )}
            {/* Enter site (when NOT logged in) */}
            <Link
              href="/login"
              className="hover:underline"
              title="Enter your account"
            >
              <FaRegUserCircle className="text-xl" />
            </Link>

            {/* Logout */}
            {currentUser && (
              <button
                onClick={() => logoutMutation.mutate()}
                className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600 text-white order-4"
                title="Logout"
              >
                Logout
              </button>
            )}

            {/* Search Trigger */}
            <button
              ref={searchButtonRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-purple-600 cursor-pointer"
              title="Search"
            >
              <IoSearch size={24} />
            </button>

            {/* Cart & Favorites */}
            <CartIcon />
            <FavoritesIcon />
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="bg-purple-800 border-t border-purple-900 text-white shadow-lg">
        <nav className="w-full flex items-center py-2 px-6 space-x-6 relative">
          {/* Browse Categories Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-green-300 transition-colors cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="md:hidden">
                <FaBars size={20} />
              </span>
              <span className="hidden md:flex items-center gap-1">
                Categories <FaChevronDown />
              </span>
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
            className="hover:text-green-300 transition-colors cursor-pointer"
          >
            About Us
          </Link>
          <Link
            href="/contacts"
            className="hover:text-green-300 transition-colors cursor-pointer"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Search Bar Overlay */}
      <div
        ref={searchRef}
        className={`absolute left-0 w-full bg-purple-100 border-b border-purple-200 p-4 shadow-md z-40 transition-all duration-500 ease-in-out ${
          isSearchOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-12 invisible pointer-events-none"
        }`}
        style={{ top: "100%" }}
      >
        <div className="w-full px-6 flex flex-col justify-start">
          <div className="flex w-full max-w-md rounded-lg border border-purple-300 overflow-hidden bg-white shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 text-sm text-black outline-none"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition"
            >
              <IoSearch size={24} />
            </button>
          </div>
          
          {/* Feedback for no results */}
          {searchQuery.trim().length > 0 && !isSearchLoading && searchResults?.length === 0 && (
            <p className="mt-2 text-sm text-red-600 font-semibold italic">
              No products found matching "{searchQuery}"
            </p>
          )}
          {isSearchError && (
            <p className="mt-2 text-sm text-red-500 font-semibold">
              Error connecting to search service.
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
