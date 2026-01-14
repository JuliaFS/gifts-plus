import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { OrderStatus } from "./types";

// GET all orders
export async function fetchAdminOrders() {
  const res = await fetch(API.admin.orders.list(), {
    credentials: "include",
  });

  // if (!res.ok) {
  //   const data = await res.json().catch(() => null);

  //   const error: any = new Error(data?.message || "Failed to load orders");
  //   error.status = res.status;
  //   throw error;
  // }

  // return res.json();
   return handleFetchError(res, "Failed to load orders.");
}

// PATCH /orders/:orderId/status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const res = await fetch(API.admin.orders.status(orderId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const error: any = new Error(data?.message || "Failed to update status");
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// import { OrderStatus } from "./types";

// const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin`;

// export async function fetchAdminOrders() {
//   const res = await fetch(`${API_URL}/orders`, {
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const data = await res.json().catch(() => null);

//     const error: any = new Error(data?.message || "Failed to load orders");

//     error.status = res.status; // 👈 IMPORTANT
//     throw error;
//   }

//   return res.json();
// }

// export async function updateOrderStatus(
//   orderId: string,
//   status: OrderStatus
// ) {
//   const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ status }),
//   });

//   if (!res.ok) {
//         const data = await res.json().catch(() => null);

//     const error: any = new Error(data?.message || "Failed to update status");

//     error.status = res.status; // 👈 IMPORTANT
//     throw error;
//   }

//   return res.json();
// }
