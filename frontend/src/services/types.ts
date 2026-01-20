export interface User {
  id: string;
  email: string;
  address: string | null;
  phone_number: string | null;
  created_at: string;
  role: string;
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

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sales_price?: number | null;
  sales_count?: number | null;
  created_at: string;
  stock: number;
  product_images?: {
    image_url: string;
    is_main: boolean;
  }[];
  product_categories: ProductCategoryLink[];
};

type ProductCategoryLink = {
  category_id: string;
  product_id: string;
  categories: Category; // <- nested category object returned from backend
};


export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_urls?: string[];
  badge?: string;
  promotion?: string;
  category_ids?: string[]; // <--- important
};

export type UpdateProductInput = {
  productId: string;
  updates: Partial<CreateProductInput>; // only the fields to update
};

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  badge?: string | null;
  promotion?: string | null;
  image_urls?: string[];
};

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type OrderItem = {
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
  };
};

export type Order = {
  id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItem[];
};

export type OrderStatus = "PENDING" | "SHIPPED" | "CANCELLED";

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["CANCELLED", "PENDING"], // allow cancelling shipped orders
  CANCELLED: ["SHIPPED", "PENDING"],
};

export interface Favorite {
  product_id: string;
  products: Product;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string | null;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CheckoutResponse {
  message: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;


