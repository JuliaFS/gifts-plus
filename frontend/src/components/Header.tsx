"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: useCurrentUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 🔑 Clear user from cache
      queryClient.setQueryData(["currentUser"], null);

      // Optional: remove query completely
      // queryClient.removeQueries({ queryKey: ["currentUser"] });

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


