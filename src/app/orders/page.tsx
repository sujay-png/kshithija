import type { Metadata } from 'next';
import OrdersClient from '@components/account/OrdersClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/orders', { noindex: true });

export default function OrdersPage() {
  return <OrdersClient />;
}
