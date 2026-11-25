import type { Metadata } from 'next';
import Hero from '@components/home/Hero';
import Philosophy from '@components/home/Philosophy';
import Products from '@components/home/Products';
import TargatedCare from '@components/home/TargatedCare';
import Cta from '@components/home/Cta';
import Testimonials from '@components/home/Testimonials';
import JournalSection from '@components/home/JournalSection';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/');

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Products />
      <TargatedCare />
      <Cta />
      <Testimonials />
      <JournalSection />
    </>
  );
}
