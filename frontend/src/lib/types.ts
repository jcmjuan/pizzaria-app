export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  token: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  banner: string;
  disabled: boolean;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface Items {
  id: string;
  amount: number;
  status: "PENDING" | "IN_PRODUCTION" | "READY" | "SERVED" | "CLOSED";
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
  };
}

export interface Order {
  id: string;
  table: number;
  name?: string;
  status: "PENDING" | "IN_PRODUCTION" | "READY" | "SERVED" | "CLOSED";
  draft: boolean;
  createdAt: string;
  updatedAt?: string;
  user_id?: string;
  items?: Items[];
}
