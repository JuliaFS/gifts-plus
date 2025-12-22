export interface User {
  id: string;
  email: string;
  address: string | null;
  phone_number: string | null;
  created_at: string;
  role:string;
}

export interface RegisterData {
  email: string;
  password: string;
  address?: string;
  phone_number?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
  position: number;
  is_main: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  product_images?: ProductImage[]; // ✅ correct
}

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_urls?: string[];
};
