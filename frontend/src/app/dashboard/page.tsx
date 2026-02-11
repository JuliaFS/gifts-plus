"use client";

import { useAdminOrders } from "../admin/hooks/useAdminOrders";
import { useFavorites } from "@/services/hooks/useFavorites";
import { useGetProducts } from "../products/hooks/useGetProducts";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";
import { useAuthGuard } from "@/services/hooks/useAuthGuard";
import { getBadges } from "@/utils/productUtils";

export default function DashboardPage() {
  // Queries
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { currentUser, showMessage } = useAuthGuard();
  const { favoritesQuery } = useFavorites(!!currentUser);
  const { data: productsData, isLoading: productsLoading } = useGetProducts(1);
  const products = productsData?.data || [];

  // Derived data
  const hotProducts = products.filter((p) => getBadges(p).includes("HOT"));
  const newProducts = products.filter((p) => getBadges(p).includes("NEW"));
  const saleProducts = products.filter((p) => getBadges(p).includes("SALE"));
  const totalOrders = orders.length;

  // Popular favorites
  const popularFavorites = (favoritesQuery.data ?? [])
    .filter((f) => f.products)
    .sort(
      (a, b) => (b.products?.sales_count || 0) - (a.products?.sales_count || 0)
    )
    .slice(0, 8);

  // Render ProductCard with guard logic
  const renderProducts = (productList: Product[]) =>
    productList.map((p) => (
      <div key={p.id} className="relative">
        <ProductCard
          product={p}
        />
        {/* Temporary message overlay */}
        {showMessage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            Login to add favorite
          </div>
        )}
      </div>
    ));

  return (
    <div className="container mx-6 mt-10 md:mx-auto space-y-10">
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
          <p className="text-2xl font-bold">{favoritesQuery.data?.length || 0}</p>
        </div>
      </div>

      {/* HOT Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">HOT Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {renderProducts(hotProducts.slice(0, 6))}
          </div>
        )}
      </div>

      {/* SALE Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">SALE Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {renderProducts(saleProducts.slice(0, 6))}
          </div>
        )}
      </div>

      {/* NEW Products */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">NEW Products</h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {renderProducts(newProducts.slice(0, 6))}
          </div>
        )}
      </div>

      {/* Popular Favorites */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Popular Favorites</h2>
        {popularFavorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {renderProducts(popularFavorites.map((f) => f.products!))}
          </div>
        )}
      </div>

      {/* Recent Orders (Admin only) */}
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
                      <td className="px-4 py-2">${o.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{o.order_items[0]?.products.name}</td>
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
