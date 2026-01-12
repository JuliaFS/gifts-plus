"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/login");
    }
  }, [isLoading, isError, router]);

  // if (isLoading) return <p>Loading...</p>;

  if (isError || !user) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user.email}
      </h1>
      <p>This is a dashboard only for registered users.</p>
    </div>
  );
}

