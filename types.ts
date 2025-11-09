// Tipos de dados compartilhados entre frontend e backend

export interface Cupcake {
  _id: string; // MongoDB uses _id
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface OrderItem {
  cupcakeId: string; // Referência ao _id do Cupcake
  cupcakeName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string; // Data como string ISO
}

export interface User {
  _id: string;
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  lastSignedIn: string;
  role: 'user' | 'admin';
}

export type { APIError } from "./_core/errors";
