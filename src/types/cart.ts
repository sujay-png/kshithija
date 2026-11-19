// src/types/cart.ts
// Standard Shopping Cart Types

export interface CartItem {
  id: string | number;
  slug?: string;
  name: string;
  price: string;
  priceNum?: number;
  quantity: number;
  image?: string;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountFormatted?: string;
  description?: string;
}
