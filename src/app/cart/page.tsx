import type { Metadata } from 'next';
import CartPageClient from '@components/cart/CartPageClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/cart', {
  title: 'Shopping Cart - Kshithija Enterprises',
  noindex: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
