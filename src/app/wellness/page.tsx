import type { Metadata } from 'next';
import WellnessHero from '@components/Wellness/Hero';
import WellnessPromise from '@components/Wellness/Promise';
import OurRange from '@components/Products/OurRange';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/wellness');

export default function WellnessPage() {
  return (
    <>
      <WellnessHero />
      <OurRange activeCategory="wellness" heading="Wellness Products" strictCategory={true} showTabs={false} showGuarantees={false} />
      <WellnessPromise />
    </>
  );
}
