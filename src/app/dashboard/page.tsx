import type { Metadata } from 'next';
import DashboardClient from '@components/account/DashboardClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/dashboard', { noindex: true });

export default function DashboardPage() {
  return <DashboardClient />;
}
