import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { Favorite } from "./types";

// GET all favorites
export async function fetchFavorites() {
  const res = await fetch(API.favorites.fetch(), {
    credentials: "include",
  });

  return handleFetchError<Favorite[]>(res, "Failed to fetch favorites.");
}

// POST add favorite
export async function addFavorite(productId: string) {
  const res = await fetch(API.favorites.add(productId), {
    method: "POST",
    credentials: "include",
  });

  return handleFetchError(res, "Failed to add favorite.");
}

// DELETE remove favorite
export async function removeFavorite(productId: string) {
  const res = await fetch(API.favorites.remove(productId), {
    method: "DELETE",
    credentials: "include",
  });

  return handleFetchError(res, "Failed to remove favorite.");
}
