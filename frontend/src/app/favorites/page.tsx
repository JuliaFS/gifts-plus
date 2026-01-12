"use client";

import { useFavorites } from "@/services/hooks/useFavorites";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";

interface Favorite {
  product_id: string;
  products: Product;
}

export default function FavoritesPage() {
  const { favoritesQuery } = useFavorites();

  if (favoritesQuery.isLoading) return <p>Loading favorites...</p>;
  if (favoritesQuery.isError) return <p className="text-red-500">Failed to load favorites.</p>;
  if (!favoritesQuery.data || favoritesQuery.data.length === 0) return <p>No favorites yet.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favoritesQuery.data.map((fav: Favorite) => (
          <ProductCard key={fav.product_id} product={fav.products} />
        ))}
      </div>
    </div>
  );
}
