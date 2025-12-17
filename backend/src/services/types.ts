export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number; // 🔑 available pieces
  image_url?: string;
  created_at: string;
}

export interface UserDTO {
  id: string;
  email: string;
  role: string;
  address?: string | null;
  phone_number?: string | null;
  created_at: string;
}
