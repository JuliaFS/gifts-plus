"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useCurrentUser();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 🔑 Clear user from cache
      //queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser"], null); 

      router.push("/login");
    },
  });

  if (isLoading) return null;

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard">Gifts Plus</Link>

        <div className="flex gap-4 items-center">
          {!currentUser && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}

          {(currentUser && currentUser.role === "ADMIN") && (
            <>
              <Link href="/admin/products" className="hover:underline">
                Admin Products
              </Link>
          
            <span>Welcome, {currentUser?.email}</span>
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
        </div>
      </nav>
    </header>
  );
}


