import { redirect } from 'next/navigation';

export default function AccountDetailsRedirect() {
  redirect('/my-account/edit-account');
}
