import { ReactNode } from 'react';

export enum MODAL_TYPES {
  CONFIRM = 'CONFIRM',
  ADD_PRODUCT = 'ADD_PRODUCT',
  PRODUCT_SETTINGS = 'PRODUCT_SETTINGS',
  ADD_CLIENT = 'ADD_CLIENT',
  ADD_PAYMENT = 'ADD_PAYMENT'
}

// Order Status
export enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  shipped = 'shipped',
  completed = 'completed',
  cancelled = 'cancelled'
}

// Extracted Type
export type TOrderStatus = keyof typeof OrderStatus;

// Payment Status
export enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  partial = 'partial',
  failed = 'failed'
}

// Extracted Type
export type TPaymentStatus = keyof typeof PaymentStatus;

// Payment Method
export enum PaymentMethod {
  cash = 'cash',
  BNPL = 'BNPL',
  card = 'card',
  bank_transfer = 'bank_transfer'
}

// Extracted Type
export type TPaymentMethod = keyof typeof PaymentMethod;

export type TCurrency = 'UZS' | 'USD';

export enum PaymentType {
  full = 'full',
  partial = 'partial',
  debt = 'debt'
}

export type TPaymentType = keyof typeof PaymentType;

export interface ISingleCustomer {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  registeredAt: string;
  purchasesInCurrencies: Record<string, number>;
  debtsInCurrencies: Record<string, number>;
}

export interface ISingleOrder {
  id: number;
  products: ReactNode[];
  total_price: number;
  total_paid: number;
  remaining_debt: number;
  currency: string;
  payment_method: string;
  delivery_address: string;
  order_date: string;
}
