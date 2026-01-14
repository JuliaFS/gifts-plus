import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";

export async function checkout() {
  const res = await fetch(API.checkout.create(), {
    method: "POST",
    credentials: "include", // 🔥 REQUIRED for session cookies
  });

  // if (!res.ok) {
  //   const data = await res.json().catch(() => null);
  //   throw new Error(data?.message || "Checkout failed");
  // }

  // return res.json();
  return handleFetchError(res, "Checkout failed.");
}



// export async function checkout() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout`, {
//     method: "POST",
//     credentials: "include", // 🔥 REQUIRED
//   });

//   if (!res.ok) {
//     const data = await res.json().catch(() => null);
//     throw new Error(data?.message || "Checkout failed");
//   }

//   return res.json();
// }

