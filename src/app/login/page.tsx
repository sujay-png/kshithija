import type { Metadata } from 'next';
import LoginClient from '@components/account/LoginClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/login', { noindex: true });

export default function LoginPage() {
  return <LoginClient />;
}
