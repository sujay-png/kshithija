import type { Metadata } from 'next';
import ResetPasswordPage from '@components/common/ResetPasswordPage';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/forgotpassword', { noindex: true });

export default function ForgotPasswordRoute() {
  return <ResetPasswordPage />;
}
