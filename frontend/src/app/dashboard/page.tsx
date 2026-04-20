"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";

import { useAdminOrders } from "../admin/hooks/useAdminOrders";
import { useFavorites } from "@/services/hooks/useFavorites";
import { useGetProducts } from "../products/hooks/useGetProducts";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { getBadges } from "@/utils/productUtils";

export default function DashboardPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement | null>(null);

  const { data: orders = [] } = useAdminOrders();
  const { currentUser, showMessage } = useAuthGuard();
  const { favoritesQuery } = useFavorites(!!currentUser);
  const { data: productsData, isLoading: productsLoading } = useGetProducts(1);

  // Animation variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const products = productsData?.data || [];

  const hotProducts = products.filter((p) => getBadges(p).includes("HOT"));
  const newProducts = products.filter((p) => getBadges(p).includes("NEW"));
  const saleProducts = products.filter((p) => getBadges(p).includes("SALE"));

  const popularFavorites = (favoritesQuery.data ?? [])
    .filter((f) => f.products)
    .sort(
      (a, b) => (b.products?.sales_count || 0) - (a.products?.sales_count || 0)
    )
    .slice(0, 8);

  useEffect(() => {
    if (!heroRef.current) return;

    // Sophisticated entrance animation that settles and stops completely
    gsap.fromTo(
      heroRef.current,
      { y: 60, opacity: 0, scale: 0.9, filter: "blur(10px)" },
      { 
        y: 0, opacity: 1, scale: 1, filter: "blur(0px)", 
        duration: 1.2, 
        ease: "power4.out" 
      }
    );
  }, []);

  const renderProducts = (productList: Product[]) =>
    productList.map((p) => (
      <div
        key={p.id}
        className="relative min-w-[220px] max-w-[220px] pb-4 transition-all duration-300 hover:scale-[1.02] hover:z-20"
      >
        <ProductCard product={p} />

        {showMessage && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            Login to ❤️
          </div>
        )}
      </div>
    ));

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full pb-16 space-y-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        {/* 🎁 HERO */}
        <motion.div
          ref={heroRef}
          className="relative overflow-hidden h-[250px] md:h-[300px] bg-gradient-to-br from-brand-green via-brand-green to-pink-500 flex items-center justify-center text-white shadow-2xl p-2 md:p-1"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 text-center space-y-6 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl md:text-6xl font-extrabold tracking-tight"
            >
              Find the Perfect Gift 🎁
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-base md:text-xl opacity-90 max-w-xl mx-auto font-medium"
            >
              Make every moment special with unique presents
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/products")}
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 font-bold text-base md:text-lg transition-all hover:bg-white hover:text-brand-green"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>

        {/* 🎀 CATEGORIES SECTION */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Occasion</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Birthday", emoji: "🎂", color: "bg-blue-50 text-blue-600", slug: "birthday" },
              { name: "Anniversary", emoji: "💍", color: "bg-pink-50 text-pink-600", slug: "anniversary" },
              { name: "Christmas", emoji: "🎄", color: "bg-green-50 text-green-600", slug: "christmas" },
              { name: "Graduation", emoji: "🎓", color: "bg-purple-50 text-purple-600", slug: "graduation" },
            ].map((cat, idx) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push(`/categories/${cat.slug}`)}
                className={`${cat.color} p-8 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-current/10`}
              >
                <span className="text-4xl mb-3">{cat.emoji}</span>
                <p className="text-lg font-bold">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🔥 TRENDING */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-red-500">🔥</span> Trending Gifts
            </h2>
            <button onClick={() => router.push("/products")} className="text-purple-600 font-semibold hover:underline">View All</button>
          </div>

          {productsLoading ? (
            <div className="flex gap-6 overflow-hidden"><SkeletonLoader /></div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {renderProducts(hotProducts)}
            </div>
          )}
        </div>

        {/* 💸 DEALS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-emerald-500">💸</span> Best Deals
            </h2>
            <button onClick={() => router.push("/products")} className="text-purple-600 font-semibold hover:underline">View All</button>
          </div>

          {productsLoading ? (
            <div className="flex gap-6 overflow-hidden"><SkeletonLoader /></div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {renderProducts(saleProducts)}
            </div>
          )}
        </div>

        {/* 🆕 NEW ARRIVALS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-blue-500">🆕</span> New Arrivals
            </h2>
            <button onClick={() => router.push("/products")} className="text-purple-600 font-semibold hover:underline">View All</button>
          </div>

          {productsLoading ? (
            <div className="flex gap-6 overflow-hidden"><SkeletonLoader /></div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {renderProducts(newProducts)}
            </div>
          )}
        </div>

        {/* ❤️ MOST LOVED */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-pink-500">❤️</span> Most Loved
          </h2>

          {popularFavorites.length === 0 ? (
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800">
              <p className="text-gray-500 font-medium">No favorites yet. Start liking products to see them here!</p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
              {renderProducts(popularFavorites.map((f) => f.products!))}
            </div>
          )}
        </div>

        {/* ADMIN */}
        {currentUser?.role === "ADMIN" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest text-sm">Admin Insights</h2>

            <div className="p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-zinc-400 font-medium">Total Platform Orders</p>
                <p className="text-5xl font-black mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {orders.length}
                </p>
              </div>
              <button 
                onClick={() => router.push("/admin/orders")}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
              >
                Manage Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonLoader() {
  return [1, 2, 3, 4].map((i) => (
    <div key={i} className="min-w-[220px] h-[300px] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-2xl" />
  ));
}