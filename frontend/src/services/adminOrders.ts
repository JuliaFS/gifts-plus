import { OrderStatus } from "./types";

const API_URL = "http://localhost:8080/api/admin";

export async function fetchAdminOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);

    const error: any = new Error(data?.message || "Failed to load orders");

    error.status = res.status; // 👈 IMPORTANT
    throw error;
  }

  return res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
        const data = await res.json().catch(() => null);

    const error: any = new Error(data?.message || "Failed to update status");

    error.status = res.status; // 👈 IMPORTANT
    throw error;
  }

  return res.json();
}
