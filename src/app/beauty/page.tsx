import type { Metadata } from 'next';
import BeautyHero from '@components/Beauty/Hero';
import BeautyPhilosophy from '@components/Beauty/Philosophy';
import OurRange from '@components/Products/OurRange';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/beauty');

export default function BeautyPage() {
  return (
    <>
      <BeautyHero />
      <BeautyPhilosophy />
      <OurRange activeCategory="beauty" heading="Beauty Products" strictCategory={true} showTabs={false} />
    </>
  );
}
