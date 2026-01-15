import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { Order, OrderStatus } from "./types";

// GET all orders
export async function fetchAdminOrders() {
  const res = await fetch(API.admin.orders.list(), {
    credentials: "include",
  });

  return handleFetchError<Order[]>(res, "Failed to load orders.");
}

// PATCH /orders/:orderId/status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const res = await fetch(API.admin.orders.status(orderId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return handleFetchError(res, "Failed to update status.");
}
