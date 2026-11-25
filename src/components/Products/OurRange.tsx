import { getProducts } from '@lib/products';
import OurRangeClient from './OurRangeClient';

export interface OurRangeProps {
  activeCategory?: 'all' | 'beauty' | 'wellness';
  sectionTitle?: string;
  heading?: string;
  showTabs?: boolean;
  strictCategory?: boolean;
  showGuarantees?: boolean;
}

export default async function OurRange({
  activeCategory = 'all',
  sectionTitle = 'Our Range',
  heading = activeCategory === 'beauty' ? 'Beauty Products' : activeCategory === 'wellness' ? 'Wellness Products' : 'All Products',
  showTabs = activeCategory === 'all',
  strictCategory = activeCategory !== 'all',
  showGuarantees = activeCategory !== 'wellness',
}: OurRangeProps) {
  const allProducts = await getProducts();
  const displayProducts =
    strictCategory && activeCategory !== 'all'
      ? allProducts.filter((p) => p.catalogCategory === activeCategory)
      : allProducts;

  return (
    <OurRangeClient
      products={displayProducts}
      activeCategory={activeCategory}
      sectionTitle={sectionTitle}
      heading={heading}
      showTabs={showTabs}
      strictCategory={strictCategory}
      showGuarantees={showGuarantees}
    />
  );
}
