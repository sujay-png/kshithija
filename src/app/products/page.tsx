import type { Metadata } from 'next';
import ProductsHero from '@components/Products/Hero';
import OurRange from '@components/Products/OurRange';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/products');

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <OurRange activeCategory="all" showTabs={true} />
    </>
  );
}
