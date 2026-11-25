import type { Metadata } from 'next';
import EditAccountClient from '@components/account/EditAccountClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/my-account/edit-account', { noindex: true });

export default function EditAccountPage() {
  return <EditAccountClient />;
}
