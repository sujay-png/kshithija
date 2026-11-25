import type { Metadata } from 'next';
import AffiliateLoginClient from '@components/affiliate/AffiliateLoginClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/affiliate-login');

export default function AffiliateLoginPage() {
  return <AffiliateLoginClient />;
}
