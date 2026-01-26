"use client";

import { useAdminOrders } from "../admin/hooks/useAdminOrders";
import { useFavorites } from "@/services/hooks/useFavorites";
import { useGetProducts } from "../products/hooks/useGetProducts";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";

export default function DashboardPage() {
  // Queries
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { favoritesQuery } = useFavorites();
  const { data: productsData, isLoading: productsLoading } = useGetProducts(1); // first page
  const products = productsData?.data || [];
  const { data: currentUser } = useCurrentUser();

  // Helper: compute badges for a product
  const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;
  const referenceTime = new Date().getTime(); // timestamp in ms

  const getBadges = (product: Product) => {
    return [
      new Date(product.created_at).getTime() >= referenceTime - TWENTY_DAYS_MS
        ? "NEW"
        : null,
      product.sales_price != null ? "SALE" : null,
      product.sales_count != null && product.sales_count >= 50 ? "HOT" : null,
    ].filter(Boolean) as string[];
  };

  // Derived data
  const hotProducts = products.filter((p) => getBadges(p).includes("HOT"));
  const newProducts = products.filter((p) => getBadges(p).includes("NEW"));
  const saleProducts = products.filter((p) => getBadges(p).includes("SALE"));
  const totalOrders = orders.length;

  const popularFavorites = [...(favoritesQuery.data || [])]
    .sort(
      (a, b) => (b.products.sales_count || 0) - (a.products.sales_count || 0),
    )
    .slice(0, 8);

  return (
    <div className="container mx-auto space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentUser?.role === "ADMIN" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        )}
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-gray-500">HOT Products</p>
          <p className="text-2xl font-bold">{hotProducts.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-gray-500">New Products</p>
          <p className="text-2xl font-bold">{newProducts.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-gray-500">Favorites</p>
          <p className="text-2xl font-bold">
            {favoritesQuery.data?.length || 0}
          </p>
        </div>
      </div>

      {/* HOT Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">HOT Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {hotProducts.slice(0, 6).map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* SALE Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">SALE Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {saleProducts.slice(0, 6).map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* NEW Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">NEW Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newProducts.slice(0, 6).map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Most Popular Favorites */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Most Popular Favorites</h2>
        {favoritesQuery.isLoading ? (
          <p>Loading favorites...</p>
        ) : favoritesQuery.isError ? (
          <p className="text-red-500">Failed to load favorites.</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto py-2">
            {popularFavorites.map((fav) => (
              <div className="min-w-[200px]" key={fav.product_id}>
                <ProductCard product={fav.products} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      {currentUser?.role === "ADMIN" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">First Product</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((o) => (
                    <tr key={o.id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{o.id}</td>
                      <td className="px-4 py-2">{o.status}</td>
                      <td className="px-4 py-2">
                        ${o.total_amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {o.order_items[0]?.products.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
