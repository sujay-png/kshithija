import type { Metadata } from 'next';
import AddressesClient from '@components/account/AddressesClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/addresses', { noindex: true });

export default function AddressesPage() {
  return <AddressesClient />;
}
