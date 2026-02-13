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

  if (favoritesQuery.isLoading)
    return (
      <div className="container mx-auto px-6 mt-10">
        <p>Loading favorites...</p>
      </div>
    );
  if (favoritesQuery.isError)
    return (
      <div className="container mx-auto px-6 mt-10">
        <p className="text-red-500">Failed to load favorites.</p>
      </div>
    );
  if (!favoritesQuery.data || favoritesQuery.data.length === 0)
    return (
      <div className="container mx-auto px-6 mt-10">
        <p>No favorites yet.</p>
      </div>
    );

  return (
    <div className="container mx-auto px-6 mt-10 space-y-10">
      <h1 className="text-3xl font-bold mb-6 text-center">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritesQuery.data.map((fav: Favorite) => (
          <ProductCard key={fav.product_id} product={fav.products} />
        ))}
      </div>
    </div>
  );
}
