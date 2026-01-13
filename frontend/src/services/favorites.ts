// services/favorites.ts
const API_URL = "https://gifts-plus-phzb.vercel.app/api/favorites";

export async function fetchFavorites() {
  const res = await fetch(API_URL, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return res.json();
}

export async function addFavorite(productId: string) {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to add favorite");
  }

  return res.json();
}

export async function removeFavorite(productId: string) {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to remove favorite");
  }

  return res.json();
}
