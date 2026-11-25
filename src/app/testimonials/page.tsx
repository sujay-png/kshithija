import type { Metadata } from 'next';
import Testimonials from '@components/home/Testimonials';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/testimonials');

export default function TestimonialsPage() {
  return <Testimonials />;
}
