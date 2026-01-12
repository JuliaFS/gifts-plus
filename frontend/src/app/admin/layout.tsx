"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  //const { data: currentUser, isLoading } = useCurrentUser();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg font-medium">Check authorization...</p>
//       </div>
//     );
//   }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
