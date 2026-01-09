// export async function checkout() {
//   const res = await fetch(
//     "http://localhost:8080/api/checkout",
//     {
//       method: "POST",
//       credentials: "include",
//     }
//   );

//   if (!res.ok) {
//     const data = await res.json().catch(() => null);
//     throw new Error(data?.message || "Checkout failed");
//   }

//   return res.json() as Promise<{
//     message: string;
//     orderId: string;
//   }>;
// }

export async function checkout() {
  const res = await fetch("http://localhost:8080/api/checkout", {
    method: "POST",
    credentials: "include", // 🔥 REQUIRED
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Checkout failed");
  }

  return res.json();
}

