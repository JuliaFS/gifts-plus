"use client";

import { useFavorites } from "@/services/hooks/useFavorites";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";

interface Favorite {
  product_id: string;
  products: Product;
}

export default function FavoritesPage() {
  const { favoritesQuery } = useFavorites(true);

  if (favoritesQuery.isLoading) return <p>Loading favorites...</p>;
  if (favoritesQuery.isError) return <p className="text-red-500">Failed to load favorites.</p>;
  if (!favoritesQuery.data || favoritesQuery.data.length === 0) return <p>No favorites yet.</p>;

  return (
    <div className="container mx-6 mt-10 md:mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-6 px-14 text-center">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12">
        {favoritesQuery.data.map((fav: Favorite) => (
          <ProductCard key={fav.product_id} product={fav.products} />
        ))}
      </div>
    </div>
  );
}
