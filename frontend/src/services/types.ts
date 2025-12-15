export interface User {
  id: string;
  email: string;
  address: string | null;
  phone_number: string | null;
  created_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  address?: string;
  phone_number?: string;
}
