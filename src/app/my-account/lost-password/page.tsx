import type { Metadata } from 'next';
import ResetPasswordPage from '@components/common/ResetPasswordPage';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/my-account/lost-password', { noindex: true });

export default function LostPasswordRoute() {
  return <ResetPasswordPage />;
}
