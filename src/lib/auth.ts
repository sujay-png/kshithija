// src/lib/auth.ts
// Production Headless Client Authentication & Account Service for Kshithija Enterprises

const WP_BASE_URL = (
  import.meta.env.PUBLIC_WP_BASE_URL || 'https://kshithija.in'
).replace(/\/+$/, '');

const HEADLESS_SECRET =
  import.meta.env.PUBLIC_HEADLESS_VERIFY_SECRET ||
  import.meta.env.HEADLESS_VERIFY_SECRET ||
  '19827fe00484d444da19911adf8110ec30dc2d4e51cfe55f47a22c02d8d18d71';

export const TOKEN_STORAGE_KEY = 'kshithija_auth_token';
export const USER_STORAGE_KEY = 'kshithija_auth_user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  isAffiliate?: boolean;
  affiliateId?: string | null;
  coupon?: AffiliateCoupon;
}

export interface AffiliateCoupon {
  id: number;
  code: string;
  amount: string;
  discountType: string;
  usageCount: number;
  status: string;
  dateCreated: string;
}

export interface AffiliateOrderRecord {
  id: number;
  orderNumber: string;
  date: string;
  dateFormatted: string;
  status: string;
  statusLabel: string;
  customer: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  totalFormatted: string;
  commission: number;
  commissionFormatted: string;
  couponUsed: string;
}

export interface AffiliateOrderSummary {
  totalOrders: number;
  totalSales: number;
  totalSalesFormatted: string;
  salesRewardsEarned: number;
  salesRewardsEarnedFormatted: string;
  pendingSalesRewards: number;
  pendingSalesRewardsFormatted: string;
  commissionRate?: number;
}

export interface AffiliateOrdersResponse {
  success: boolean;
  summary: AffiliateOrderSummary;
  orders: AffiliateOrderRecord[];
}

export interface CustomerAddress {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface CustomerProfile extends AuthUser {
  billing: CustomerAddress;
  shipping: CustomerAddress;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  subtotal: string;
  image?: string;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  status: string;
  statusLabel: string;
  dateCreated: string;
  total: string;
  rawTotal: string;
  subtotal?: string;
  discount?: string;
  customerNote?: string;
  currency: string;
  paymentMethod: string;
  shippingAddress: string;
  billingAddress?: string;
  billing?: CustomerAddress;
  shipping?: CustomerAddress;
  items: OrderItem[];
}

/**
 * Get stored token from client storage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Get stored user profile summary from client storage
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Check if customer is currently logged in
 */
export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

/**
 * Logout and clear session
 */
export function logout(redirect = '/login'): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent('auth:state-change', { detail: { loggedIn: false, user: null } })
  );
  if (redirect) {
    window.location.href = redirect;
  }
}

/**
 * Authenticate customer using existing WordPress / WooCommerce credentials
 */
export async function loginWithWordPress(
  usernameOrEmail: string,
  password: string,
  remember = true
): Promise<{ success: boolean; token: string; user: AuthUser }> {
  const url = `${WP_BASE_URL}/wp-json/headless/v1/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify({
      username: usernameOrEmail.trim(),
      password,
      rememberme: remember,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const errorMsg = data.message || 'Invalid username or password. Please try again.';
    throw new Error(errorMsg);
  }

  // Persist session
  localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

  window.dispatchEvent(
    new CustomEvent('auth:state-change', {
      detail: { loggedIn: true, user: data.user },
    })
  );

  return data;
}

/**
 * Register a new affiliate account with WordPress
 */
export async function registerAffiliate(payload: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}): Promise<{ success: boolean; message: string; token: string; user: AuthUser }> {
  const url = `${WP_BASE_URL}/wp-json/headless/v1/auth/register-affiliate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const errorMsg = data.message || 'Registration failed. Please check your information.';
    throw new Error(errorMsg);
  }

  // Persist session immediately
  if (data.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
  }
  if (data.user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  }

  window.dispatchEvent(
    new CustomEvent('auth:state-change', {
      detail: { loggedIn: true, user: data.user },
    })
  );

  return data;
}

/**
 * Fetch authenticated customer profile & addresses (IDOR-Safe)
 */
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/account/me?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Headless-Secret': HEADLESS_SECRET,
      },
    });

    if (res.status === 401) {
      logout(false as any);
      return null;
    }

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch customer profile:', (err as Error).message);
    return null;
  }
}

/**
 * Fetch orders strictly for the authenticated customer (IDOR-Safe)
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const token = getStoredToken();
  if (!token) return [];

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/account/orders?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Headless-Secret': HEADLESS_SECRET,
      },
    });

    if (res.status === 401) {
      console.warn('Orders fetch 401: Token expired or rejected by WordPress.');
      logout(false as any);
      return [];
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`Orders fetch failed (HTTP ${res.status}):`, errText);
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }

    const data = await res.json();
    console.log(`[WooCommerce Orders] Fetched:`, data);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.orders)) return data.orders;
    return [];
  } catch (err) {
    console.error('Failed to fetch customer orders:', (err as Error).message);
    throw err;
  }
}

/**
 * Update Customer Personal Info & Password
 */
export async function updateCustomerProfile(payload: {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ success: boolean; message: string; token?: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('You must be logged in.');

  const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/account/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update profile.');
  }

  // Update token if password changed
  if (data.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
  }

  return data;
}

/**
 * Update Billing or Shipping Address
 */
export async function updateCustomerAddress(
  type: 'billing' | 'shipping',
  address: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('You must be logged in.');

  const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/account/update-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify({ type, address }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to update address.');
  }

  return data;
}

/**
 * Request password reset email (Triggers WooCommerce Customer Reset Password email)
 */
export async function requestPasswordReset(userLogin: string): Promise<{ success: boolean; message: string; email?: string; fallback?: boolean }> {
  try {
    const frontendUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/auth/lost-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Headless-Secret': HEADLESS_SECRET,
      },
      body: JSON.stringify({ user_login: userLogin, frontend_url: frontendUrl }),
    });

    const data = await res.json().catch(() => ({}));

    // If the endpoint isn't deployed on the live server yet (404 / rest_no_route), signal fallback
    if (res.status === 404 || data.code === 'rest_no_route') {
      return { success: true, message: 'Password reset request dispatched.', fallback: true };
    }

    if (!res.ok || !data.success) {
      // If user not found, throw error so UI displays it
      if (data.code === 'invalid_user') {
        throw new Error(data.message || 'No account found with that username or email.');
      }
      return { success: true, message: 'Password reset request dispatched.', fallback: true };
    }

    return data;
  } catch (err: any) {
    if (err.message && err.message.includes('No account found')) {
      throw err;
    }
    // Fallback to native WooCommerce lost-password
    return { success: true, message: 'Password reset request dispatched.', fallback: true };
  }
}

/**
 * Reset password using reset key from email link
 */
export async function resetPasswordWithKey(payload: {
  key: string;
  login: string;
  password: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to reset password.');
  }

  return data;
}

/**
 * Fetch affiliate's WooCommerce coupon from WordPress
 */
export async function getAffiliateCoupon(): Promise<AffiliateCoupon | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/affiliate/coupon?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Headless-Secret': HEADLESS_SECRET,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.coupon || null;
  } catch (err) {
    console.warn('Failed to fetch affiliate coupon:', (err as Error).message);
    return null;
  }
}

/**
 * Save / Update affiliate's WooCommerce coupon in WordPress (post_type = 'shop_coupon')
 */
export async function saveAffiliateCoupon(couponCode: string): Promise<{ success: boolean; coupon: AffiliateCoupon; message: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('You must be logged in to save your coupon.');

  const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/affiliate/coupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Headless-Secret': HEADLESS_SECRET,
    },
    body: JSON.stringify({ code: couponCode }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to save coupon to WordPress.');
  }

  return data;
}

/**
 * Fetch live affiliate orders and calculated performance metrics from WordPress
 */
export async function getAffiliateOrders(): Promise<AffiliateOrdersResponse | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/headless/v1/affiliate/orders?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Headless-Secret': HEADLESS_SECRET,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.success) return null;
    return data;
  } catch (err) {
    console.warn('Failed to fetch affiliate orders from WordPress:', (err as Error).message);
    return null;
  }
}
