import { redirect } from 'next/navigation';

export default async function EditAddressRedirect({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  redirect(`/addresses?edit=${type}`);
}
