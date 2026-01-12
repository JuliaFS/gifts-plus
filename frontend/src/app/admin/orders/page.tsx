"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders } from "@/services/adminOrders";
import { useUpdateOrderStatus } from "@/app/cart/hooks/useUpdateOrderStatus";
import OrderCard from "@/components/order/OrderCard";
import StatusModal from "@/components/order/StatusModal";
import { Order, OrderStatus } from "@/services/types";

export default function AdminOrdersPage() {
  // Fetch admin orders
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });

  // Mutation for updating status
  const updateStatusMutation = useUpdateOrderStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);

  const handleStatusClick = (order: Order) => {
    setSelectedOrder(order); // store full order
    setModalOpen(true);
  };

  const handleChangeStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: newStatus,
      });

      setModalOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error updating status");
    }
  };

  if (isLoading) return <p className="text-center mt-5">Loading orders...</p>;
  if (isError)
    return (
      <p className="text-red-600 text-center mt-5">
        {(error as Error).message}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      <div className="space-y-4">
        {data?.map((order: Order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusClick={handleStatusClick}
          />
        ))}
      </div>

      {selectedOrder && (
        <StatusModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          currentStatus={selectedOrder.status}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
}
