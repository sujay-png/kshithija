import type { Metadata } from 'next';
import AffiliateRegistrationClient from '@components/affiliate/AffiliateRegistrationClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/affiliate-registration');

export default function AffiliateRegistrationPage() {
  return <AffiliateRegistrationClient />;
}
