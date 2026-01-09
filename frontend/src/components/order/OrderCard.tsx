"use client";

import { useUpdateOrderStatus } from "@/app/cart/hooks/useUpdateOrderStatus";
import { Order } from "@/services/types";



export default function OrderCard({ order }: { order: Order }) {
  const { mutate, isPending } = useUpdateOrderStatus();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Order #{order.id}</h3>
        <span
          className={`px-3 py-1 rounded text-sm ${
            order.status === "PENDING"
              ? "bg-yellow-200"
              : order.status === "SHIPPED"
              ? "bg-green-200"
              : "bg-red-200"
          }`}
        >
          {order.status}
        </span>
      </div>

      <ul className="mt-3 text-sm">
        {order.order_items.map((item, idx) => (
          <li key={idx}>
            {item.products.name} × {item.quantity} —{" "}
            {(item.quantity * item.price_at_purchase).toFixed(2)} €
          </li>
        ))}
      </ul>

      <p className="mt-2 font-semibold">
        Total: {order.total_amount.toFixed(2)} €
      </p>

      {order.status === "PENDING" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() =>
              mutate({ orderId: order.id, status: "SHIPPED" })
            }
            disabled={isPending}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Ship
          </button>

          <button
            onClick={() =>
              mutate({ orderId: order.id, status: "CANCELLED" })
            }
            disabled={isPending}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
