import type { Metadata } from 'next';
import AffiliateDashboardClient from '@components/affiliate/AffiliateDashboardClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/affiliate-dashboard');

export default function AffiliateDashboardPage() {
  return <AffiliateDashboardClient />;
}
