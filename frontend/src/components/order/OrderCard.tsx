"use client";

import { Order } from "@/services/types";

interface OrderCardProps {
  order: Order;
  onStatusClick: (order: Order) => void;
}

export default function OrderCard({ order, onStatusClick }: OrderCardProps) {
  return (
    <div className="border p-4 rounded shadow flex justify-between items-center">
      <div>
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className="cursor-pointer text-blue-600 underline"
            onClick={() => onStatusClick(order)}
          >
            {order.status}
          </span>
        </p>
      </div>
      {/* Other order info */}
    </div>
  );
}
