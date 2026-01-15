import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CreateProductInput, PaginatedProducts, Product } from "./types";

// Fetch paginated products
export async function fetchProducts(page: number): Promise<PaginatedProducts> {
  const res = await fetch(API.products.list(page), {
    method: "GET",
    credentials: "include",
  });

  return handleFetchError<PaginatedProducts>(res, "Failed to fetch products.");
}

// Create a new product
export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const res = await fetch(API.products.create(), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleFetchError<Product>(res, "Failed to create product");
}

// Get a single product
export async function getProduct(productId: string): Promise<Product> {
  const res = await fetch(API.products.byId(productId), {
    credentials: "include",
    cache: "no-store",
  });

  return handleFetchError(res, "Failed to fetch product.");
}

// Update product
export async function updateProduct(
  productId: string,
  updates: Partial<CreateProductInput>
): Promise<Product> {
  const res = await fetch(API.products.update(productId), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  return handleFetchError<Product>(res, "Failed to update product");
}

// Delete product
export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(API.products.delete(productId), {
    method: "DELETE",
    credentials: "include",
  });

  return handleFetchError(res, "Failed to delete product");
}

// Delete product images
export async function deleteProductImages(
  productId: string,
  imageUrls: string[]
): Promise<void> {
  const res = await fetch(API.products.deleteImages(productId), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrls }),
  });

  return handleFetchError(res, "Failed to delete images");
}

// Add badge to product
export async function addBadgeToProduct(
  productId: string,
  badge?: string,
  promotion?: string
): Promise<Product> {
  const res = await fetch(API.products.addBadge(productId), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ badge, promotion }),
  });

  return handleFetchError<Product>(res, "Failed to update badge/promotion");
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(API.products.search(query), {
    credentials: "include",
  });

  return handleFetchError<Product[]>(res, "Failed to search products");
}
