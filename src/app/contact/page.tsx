import type { Metadata } from 'next';
import ContactUsClient from '@components/contact/ContactUsClient';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/contact-us');

export default function ContactPage() {
  return <ContactUsClient />;
}
