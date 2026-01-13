'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
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
      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="font-bold text-xl">
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

        {/* User & Icons */}
        <div className="flex gap-4 items-center relative">
          {/* Guest links (always visible) */}
          <div
            className={`transition-opacity duration-500 ${
              !isLoading && !currentUser ? "opacity-100" : "opacity-0"
            } flex gap-2 items-center`}
          >
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>

          {/* Admin links (fade in) */}
          {currentUser?.role === "ADMIN" && (
            <div className="transition-opacity duration-500 opacity-100 flex gap-2 items-center">
              <Link href="/admin/products" className="hover:underline">
                Admin Products
              </Link>
              <span>Welcome, {currentUser.email}</span>
            </div>
          )}

          {/* Logout button (fade in) */}
          {currentUser && (
            <button
              onClick={() => logoutMutation.mutate()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-opacity duration-500 opacity-100"
            >
              Logout
            </button>
          )}

          {/* Cart & Favorites always visible */}
          <CartIcon />
          <FavoritesIcon />
        </div>
      </nav>
    </header>
  );
}



// 'use client';

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import { logout } from "@/services/auth";
// import { useCurrentUser } from "@/services/hooks/useCurrentUser";
// import CartIcon from "./cart/CartIcon";
// import FavoritesIcon from "./favorites/FavoritesIcon";

// export default function Header() {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const { data: currentUser, isLoading } = useCurrentUser();
//   const [searchQuery, setSearchQuery] = useState("");

//   const logoutMutation = useMutation({
//     mutationFn: logout,
//     onSuccess: () => {
//       queryClient.setQueryData(["currentUser"], null);
//       router.push("/login");
//     },
//   });

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && searchQuery.trim()) {
//       router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   if (isLoading) return null; // wait for client fetch

//   return (
//   <header className="bg-blue-600 text-white p-4">
//     <nav className="container mx-auto flex justify-between items-center">
//       <Link href="/dashboard" className="font-bold text-xl">
//         Gifts Plus
//       </Link>

//       <div className="flex items-center border rounded overflow-hidden">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="p-2 outline-none w-64 text-black"
//         />
//         <button
//           onClick={() => {
//             if (searchQuery.trim()) {
//               router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
//             }
//           }}
//           className="p-2 bg-gray-200 hover:bg-gray-300 text-black"
//         >
//           <FaSearch />
//         </button>
//       </div>

//       <div className="flex gap-4 items-center">
//         {!currentUser && (
//           <>
//             <Link href="/login">Login</Link>
//             <Link href="/register">Register</Link>
//           </>
//         )}

//         {currentUser && currentUser.role === "ADMIN" && (
//           <>
//             <Link href="/admin/products" className="hover:underline">
//               Admin Products
//             </Link>
//             <span>Welcome, {currentUser.email}</span>
//           </>
//         )}

//         {currentUser && (
//           <button
//             onClick={() => logoutMutation.mutate()}
//             className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         )}

//         <CartIcon />
//         <FavoritesIcon />
//       </div>
//     </nav>
//   </header>
// );
// }




