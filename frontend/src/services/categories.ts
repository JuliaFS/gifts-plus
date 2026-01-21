import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { Category, CreateCategoryResponse, Product } from "./types";

// GET all categories (public)
export async function fetchCategories() {
  const res = await fetch(API.categories.fetch(), {
    credentials: "include",
  });

  return handleFetchError<Category[]>(res, "Failed to fetch categories.");
}

// POST create category (admin only)

export async function createCategory(name: string, slug: string) {
  const res = await fetch(API.categories.create(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, slug }),
  });

  return handleFetchError<CreateCategoryResponse>(
    res,
    "Failed to create category."
  );
}

export async function fetchProductsByCategory(slug: string) {
  const res = await fetch(API.categories.products(slug), {
    credentials: "include",
  });

  return handleFetchError<{
    name: string;
    products: Product[];
  }>(res, "Failed to fetch products by category");
}
