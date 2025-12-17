import { CreateProductInput, Product } from "./types";

// src/services/products.ts
const API_URL = "http://localhost:8080/api/products";
export async function fetchProducts() {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include", // safe even if public
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json() as Promise<Product[]>;
}


export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json() as Promise<Product>;
}