// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number; // 🔑 available pieces
  image_url?: string;
  created_at: string;
}
