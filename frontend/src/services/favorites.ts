import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";

// GET all favorites
export async function fetchFavorites() {
  const res = await fetch(API.favorites.fetch(), {
    credentials: "include",
  });

  // if (!res.ok) {
  //   throw new Error("Failed to fetch favorites");
  // }

  // return res.json();
  return handleFetchError(res, "Failed to fetch favorites.");
}

// POST add favorite
export async function addFavorite(productId: string) {
  const res = await fetch(API.favorites.add(productId), {
    method: "POST",
    credentials: "include",
  });

  // if (!res.ok) {
  //   throw new Error("Failed to add favorite");
  // }

  // return res.json();
  return handleFetchError(res, "Failed to add favorite.");
}

// DELETE remove favorite
export async function removeFavorite(productId: string) {
  const res = await fetch(API.favorites.remove(productId), {
    method: "DELETE",
    credentials: "include",
  });

  // if (!res.ok) {
  //   throw new Error("Failed to remove favorite");
  // }

  // return res.json();
  return handleFetchError(res, "Failed to remove favorite.");
}


// const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites`;

// export async function fetchFavorites() {
//   const res = await fetch(API_URL, {
//     credentials: "include",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch favorites");
//   }

//   return res.json();
// }

// export async function addFavorite(productId: string) {
//   const res = await fetch(`${API_URL}/${productId}`, {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to add favorite");
//   }

//   return res.json();
// }

// export async function removeFavorite(productId: string) {
//   const res = await fetch(`${API_URL}/${productId}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to remove favorite");
//   }

//   return res.json();
// }
