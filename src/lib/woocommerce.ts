// src/lib/woocommerce.ts
// Live WooCommerce Store API integration for Kshithija Enterprises
import localCategories from '../data/product-categories.json';
import localProducts from '../data/wc-products.json';

const WP_BASE_URL = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in').replace(/\/+$/, '');
const STORE_CATEGORIES_URL = `${WP_BASE_URL}/wp-json/wc/store/v1/products/categories`;
const STORE_PRODUCTS_URL = `${WP_BASE_URL}/wp-json/wc/store/v1/products?per_page=100`;

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  permalink?: string;
  image?: {
    id: number;
    src: string;
    alt: string;
  } | null;
}

export interface ProductPrice {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
}

export interface ProductImage {
  id: number;
  src: string;
  thumbnail?: string;
  alt: string;
  name?: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  on_sale: boolean;
  prices: ProductPrice;
  price_html: string;
  images: ProductImage[];
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    link: string;
  }>;
  is_in_stock: boolean;
}

let cachedCategories: ProductCategory[] | null = null;
let lastCategoryFetch = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

/**
 * Fetch all WooCommerce Product Categories directly from WordPress.
 * Falls back automatically to local snapshot in src/data/product-categories.json.
 */
export async function getProductCategories(): Promise<ProductCategory[]> {
  if (cachedCategories && Date.now() - lastCategoryFetch < CACHE_TTL) {
    return cachedCategories;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(STORE_CATEGORIES_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Astro-Kshithija/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: ProductCategory[] = await res.json();
    cachedCategories = data;
    lastCategoryFetch = Date.now();
    return data;
  } catch (err) {
    console.warn('Using local fallback for WooCommerce product categories:', (err as Error).message);
    return localCategories as ProductCategory[];
  }
}

let cachedProducts: WooProduct[] | null = null;
let lastProductFetch = 0;

/**
 * Fetch all WooCommerce Products directly from WordPress.
 * Falls back automatically to local snapshot in src/data/wc-products.json.
 */
export async function getWooProducts(): Promise<WooProduct[]> {
  if (cachedProducts && Date.now() - lastProductFetch < CACHE_TTL) {
    return cachedProducts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(STORE_PRODUCTS_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Astro-Kshithija/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: WooProduct[] = await res.json();
    cachedProducts = data;
    lastProductFetch = Date.now();
    return data;
  } catch (err) {
    console.warn('Using local fallback for WooCommerce products:', (err as Error).message);
    return localProducts as WooProduct[];
  }
}

/**
 * Filter products by category slug (e.g. 'beauty', 'wellness', 'hair-cream')
 */
export async function getProductsByCategory(categorySlug: string): Promise<WooProduct[]> {
  const all = await getWooProducts();
  if (!categorySlug || categorySlug === 'all') return all;
  return all.filter((p) => p.categories?.some((c) => c.slug === categorySlug));
}

/**
 * Format raw WooCommerce price in minor units (cents/paise) to display string (e.g. ₹369)
 */
export function formatProductPrice(prices?: ProductPrice): string {
  if (!prices) return '₹349';
  const symbol = prices.currency_symbol || '₹';
  const minor = prices.currency_minor_unit ?? 2;
  const rawNum = parseFloat(prices.price || '0');
  const amount = minor > 0 ? (rawNum / Math.pow(10, minor)).toFixed(0) : rawNum.toString();
  return `${symbol}${amount}`;
}

