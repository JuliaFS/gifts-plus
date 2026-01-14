import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CreateProductInput, PaginatedProducts, Product } from "./types";

// Fetch paginated products
export async function fetchProducts(page: number): Promise<PaginatedProducts> {
  const res = await fetch(API.products.list(page), {
    method: "GET",
    credentials: "include",
  });

  // if (!res.ok) throw new Error("Failed to fetch products");

  // return res.json() as Promise<PaginatedProducts>;
  return handleFetchError<PaginatedProducts>(res, "Failed to fetch products.");
}

// Create a new product
export async function createProduct(input: CreateProductInput): Promise<Product> {
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

  // if (!res.ok) throw new Error("Failed to fetch product");
  // return res.json();
  return handleFetchError(res, "Failed to fetch product.");
}

// Update product
export async function updateProduct(productId: string, updates: Partial<CreateProductInput>): Promise<Product> {
  const res = await fetch(API.products.update(productId), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message || "Failed to update product");
  // }

  // return res.json() as Promise<Product>;
  return handleFetchError<Product>(res, "Failed to update product");
}

// Delete product
export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(API.products.delete(productId), {
    method: "DELETE",
    credentials: "include",
  });

  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message || "Failed to delete product");
  // }
  return handleFetchError(res, "Failed to delete product");
}

// Delete product images
export async function deleteProductImages(productId: string, imageUrls: string[]): Promise<void> {
  const res = await fetch(API.products.deleteImages(productId), {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrls }),
  });

  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message || "Failed to delete images");
  // }
  return handleFetchError(res, "Failed to delete images");
}

// Add badge to product
export async function addBadgeToProduct(productId: string, badge?: string, promotion?: string): Promise<Product> {
  const res = await fetch(API.products.addBadge(productId), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ badge, promotion }),
  });

  // if (!res.ok) {
  //   const error = await res.json();
  //   throw new Error(error.message || "Failed to update badge/promotion");
  // }

  // return res.json() as Promise<Product>;
  return handleFetchError<Product>(res, "Failed to update badge/promotion");
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(API.products.search(query), {
    credentials: "include",
  });

  // if (!res.ok) {
  //   const data = await res.json().catch(() => null);
  //   const error: any = new Error(data?.message || "Failed to search products");
  //   error.status = res.status;
  //   throw error;
  // }

  // return res.json();
  return handleFetchError<Product[]>(res, "Failed to search products");
}


// import { CreateProductInput, Product } from "./types";

// const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;
// export interface PaginatedProducts {
//   data: Product[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export async function fetchProducts(page: number): Promise<PaginatedProducts> {
//   const res = await fetch(`${API_URL}?page=${page}&limit=12`, {
//     method: "GET",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   return res.json() as Promise<PaginatedProducts>;
// }

// export async function createProduct(
//   input: CreateProductInput
// ): Promise<Product> {
//   const res = await fetch(`${API_URL}`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(input),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to create product");
//   }

//   return res.json() as Promise<Product>;
// }

// export async function getProduct(productId: string): Promise<Product> {
//   const res = await fetch(`${API_URL}/${productId}`, {
//     credentials: "include",
//     cache: "no-store", // important for fresh data
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export async function updateProduct(
//   productId: string,
//   updates: Partial<CreateProductInput>
// ): Promise<Product> {
//   const res = await fetch(`${API_URL}/${productId}`, {
//     method: "PUT",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updates),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update product");
//   }

//   return res.json() as Promise<Product>;
// }

// export async function deleteProduct(productId: string): Promise<void> {
//   const res = await fetch(`${API_URL}/${productId}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete product");
//   }
// }

// export async function deleteProductImages(
//   productId: string,
//   imageUrls: string[]
// ): Promise<void> {
//   const res = await fetch(`${API_URL}/${productId}/images`, {
//     method: "DELETE",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ imageUrls }),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to delete images");
//   }
// }

// export async function addBadgeToProduct(
//   productId: string,
//   badge?: string,
//   promotion?: string
// ): Promise<Product> {
//   const res = await fetch(`${API_URL}/${productId}/badge`, {
//     method: "PATCH",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ badge, promotion }),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Failed to update badge/promotion");
//   }

//   return res.json() as Promise<Product>;
// }

// export async function searchProducts(query: string): Promise<Product[]> {
//   const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const data = await res.json().catch(() => null);
//     const error: any = new Error(data?.message || "Failed to search products");
//     error.status = res.status;
//     throw error;
//   }

//   return res.json();
// }
