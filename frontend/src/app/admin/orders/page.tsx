"use client";

import { useAdminOrders } from "@/app/admin/hooks/useAdminOrders";
import OrderCard from "@/components/order/OrderCard";



export default function AdminOrdersPage() {
  const { data, isLoading, isError, error } = useAdminOrders();

  if (isLoading) return <p>Loading orders...</p>;
  if (isError)
    return <p className="text-red-600">{(error as Error).message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      <div className="space-y-4">
        {data?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
