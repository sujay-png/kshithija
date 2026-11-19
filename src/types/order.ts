// src/types/order.ts
// Standard Order Types for WooCommerce Headless Integration
import type { CustomerAddress } from './auth';

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  subtotal: string;
  image?: string;
}

export type OrderStatus =
  | 'pending'
  | 'on-hold'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus | string;
  statusLabel?: string;
  dateCreated: string;
  total: string;
  rawTotal?: string;
  subtotal?: string;
  discount?: string;
  customerNote?: string;
  currency: string;
  paymentMethod: string;
  billingAddress: string;
  shippingAddress: string;
  billing?: CustomerAddress | null;
  shipping?: CustomerAddress | null;
  items: OrderItem[];
}
