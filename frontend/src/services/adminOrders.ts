const API_URL = "http://localhost:8080/api/admin";

export async function fetchAdminOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load orders");
  }

  return res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: "SHIPPED" | "CANCELLED"
) {
  const res = await fetch(
    `${API_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
}
