
export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_urls?: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number; // 🔑 available pieces
  image_url?: string;
  created_at: string;
}

export interface CartItem {
  user_id: string;
  product_id: string;
  quantity: number;
}


export interface UserDTO {
  id: string;
  email: string;
  role: string;
  address?: string | null;
  phone_number?: string | null;
  created_at: string;
}
