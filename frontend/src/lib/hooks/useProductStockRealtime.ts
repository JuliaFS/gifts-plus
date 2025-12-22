"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useProductStockRealtime() {
  useEffect(() => {
    const channel = supabase
      .channel("product-stock")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Stock updated:", payload.new);
          // 🔁 update React Query / Zustand / Redux here
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
