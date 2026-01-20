
export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_urls?: string[];
  badge?: string;
  promotion?: string;
  category_ids?: string[]; 
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number; // 🔑 available pieces
  image_url?: string;
  created_at: string;
  badge?: string;
  promotion?: string;
}

export interface CartItem {
  user_id: string;
  product_id: string;
  quantity: number;
}

export interface CartValidationItem {
  productId: string;
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
