// src/lib/checkout.ts
// Live WooCommerce Checkout & Razorpay Bridge Service for Kshithija Enterprises Headless Frontend

const WP_BASE_URL = (
  process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in'
).replace(/\/+$/, '');

const HEADLESS_SECRET =
  process.env.NEXT_PUBLIC_HEADLESS_VERIFY_SECRET ||
  process.env.HEADLESS_VERIFY_SECRET ||
  '19827fe00484d444da19911adf8110ec30dc2d4e51cfe55f47a22c02d8d18d71';

const CHECKOUT_API = `${WP_BASE_URL}/wp-json/headless/v1/checkout`;

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Headless-Secret': HEADLESS_SECRET,
    ...extraHeaders,
  };
}

export interface CartItemInput {
  id: number | string;
  name?: string;
  slug?: string;
  price?: string | number;
  quantity: number;
}

export interface VerifiedCartResponse {
  success: boolean;
  items: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    regular_price: number;
    price_formatted: string;
    quantity: number;
    line_total: number;
    line_total_formatted: string;
    in_stock: boolean;
  }>;
  subtotal: number;
  subtotal_formatted: string;
  total_quantity: number;
  currency: string;
  message?: string;
}

export interface CouponResponse {
  success: boolean;
  code?: string;
  discount_type?: string;
  coupon_amount?: number;
  discount_amount?: number;
  discount_formatted?: string;
  new_total?: number;
  new_total_formatted?: string;
  description?: string;
  message: string;
}

export interface CreateOrderPayload {
  idempotency_key?: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: Array<{ id: number | string; slug?: string; quantity: number }>;
  coupon_code?: string;
  payment_method: 'razorpay' | 'cod' | 'whatsapp';
  customer_notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: number;
  order_key?: string;
  status?: string;
  total?: number;
  total_formatted?: string;
  currency?: string;
  is_idempotent?: boolean;
  message?: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  razorpay_order_id?: string;
  razorpay_key_id?: string;
  amount?: number;
  currency?: string;
  order_id?: number;
  is_idempotent?: boolean;
  message?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  order_id?: number;
  razorpay_payment_id?: string;
  status?: string;
  already_processed?: boolean;
  message: string;
}

/**
 * 1. Verify Cart & Live Prices with WooCommerce (Single Source of Truth)
 */
export async function verifyCartWithWooCommerce(
  items: CartItemInput[]
): Promise<VerifiedCartResponse> {
  try {
    const res = await fetch(`${CHECKOUT_API}/verify-cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      items: [],
      subtotal: 0,
      subtotal_formatted: '₹0',
      total_quantity: 0,
      currency: 'INR',
      message: (err as Error).message || 'Failed to verify cart prices with WordPress',
    };
  }
}

/**
 * 2. Validate Coupon dynamically with WooCommerce WC_Coupon engine
 */
export async function applyWooCommerceCoupon(
  code: string,
  items: CartItemInput[],
  subtotal: number
): Promise<CouponResponse> {
  try {
    const res = await fetch(`${CHECKOUT_API}/apply-coupon`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, items, subtotal }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Failed to connect to coupon validator',
    };
  }
}

/**
 * 3. Create real WooCommerce Order (Idempotent)
 */
export async function createWooCommerceOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  try {
    const idemKey =
      payload.idempotency_key ||
      'ksh_idem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const res = await fetch(`${CHECKOUT_API}/create-order`, {
      method: 'POST',
      headers: getAuthHeaders({ 'X-Idempotency-Key': idemKey }),
      body: JSON.stringify({ ...payload, idempotency_key: idemKey }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Failed to create order in WooCommerce',
    };
  }
}

/**
 * 4. Generate Razorpay Order using WooCommerce Razorpay Settings (Idempotent)
 */
export async function createRazorpayOrder(
  orderId: number
): Promise<RazorpayOrderResponse> {
  try {
    const res = await fetch(`${CHECKOUT_API}/create-razorpay-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Failed to create Razorpay transaction',
    };
  }
}

/**
 * 5. Verify Razorpay Payment Signature and Complete WooCommerce Order (Idempotent)
 */
export async function verifyRazorpayPayment(params: {
  order_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<PaymentVerificationResponse> {
  try {
    const res = await fetch(`${CHECKOUT_API}/verify-payment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Payment signature verification failed',
    };
  }
}

/**
 * 6. Cancel WooCommerce Order and Process Razorpay Refund
 */
export async function cancelWooCommerceOrder(params: {
  order_id: number;
  reason?: string;
  token?: string;
}): Promise<{
  success: boolean;
  order_id?: number;
  status?: string;
  status_label?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_amount_formatted?: string;
  message: string;
}> {
  try {
    const res = await fetch(`${CHECKOUT_API}/cancel-order`, {
      method: 'POST',
      headers: getAuthHeaders(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
      body: JSON.stringify({
        order_id: params.order_id,
        reason: params.reason || 'Customer requested cancellation via My Orders',
      }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Failed to cancel order and request refund',
    };
  }
}
