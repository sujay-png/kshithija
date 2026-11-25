import type { Metadata } from 'next';
import CheckoutClient from '@components/checkout/CheckoutClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/checkout', {
  title: 'Secure Checkout - Kshithija Enterprises',
  noindex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
