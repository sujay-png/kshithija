// src/data/products.ts

export type ProductCategory = 'all' | 'skincare' | 'haircare' | 'wellness' | 'nutrition';
export type CatalogCategory = 'all' | 'beauty' | 'wellness';

export interface CarouselSlide {
  id: string;
  title: string;
  image: string;
  fallbackImage: string;
  alt: string;
}

export interface ProductsHeroData {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  ratingScore: string;
  ratingLabelLine1: string;
  ratingLabelLine2: string;
  slides: CarouselSlide[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryId: ProductCategory;
  catalogCategory: 'beauty' | 'wellness';
  description: string;
  descriptionHtml?: string;
  highlights?: string[];
  whyItWorks?: string;
  size: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  fallbackImage?: string;
  badge?: string;
  onSale?: boolean;
  actionText?: string;
  tags: string[];
  keyIngredients: string[];
  specifications?: Record<string, string>;
  additionalFeatures?: string[];
  detailedIngredients?: { name: string; image: string }[];
  routineNotice?: string;
  badgeIcons?: { title: string; image: string; subtitle?: string }[];
  inStock: boolean;
  featured?: boolean;
  permalink?: string;
  aliasIds?: string[];
}

export interface ProductsPageData {
  hero: ProductsHeroData;
  guarantees: {
    icon: string;
    title: string;
    description: string;
  }[];
  categories: {
    id: ProductCategory;
    label: string;
    count: number;
  }[];
  products: Product[];
}

export const productsHeroData: ProductsHeroData = {
  eyebrow: "Nature's Finest, Bottled for You · Lab Tested · Chemical-Free",
  titleLine1: 'Natural Beauty Products',
  titleLine2: '100% Organic',
  description:
    'Handcrafted wellness and beauty products made without parabens, petroleum jelly, or synthetic preservatives safe for all skin types.',
  buttonText: 'Explore Products',
  buttonHref: '#catalog',
  ratingScore: '4.8',
  ratingLabelLine1: 'Trusted by',
  ratingLabelLine2: 'thousands',
  slides: [
    {
      id: 'slide-1',
      title: 'Lavender Botanical Harvest',
      image: 'https://kshithija.in/wp-content/uploads/2026/07/products-768x513.webp',
      fallbackImage: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80',
      alt: 'Fresh lavender bouquet in woven wicker basket',
    },
    {
      id: 'slide-2',
      title: 'Organic Aloe Vera & Plant Extracts',
      image: 'https://kshithija.in/wp-content/uploads/2026/06/Organic-Skincare-Product-600x327.webp',
      fallbackImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Fresh sliced aloe vera leaves with botanical serum dropper bottle',
    },
    {
      id: 'slide-3',
      title: 'Pure Forest Honey & Natural Wax',
      image: 'https://kshithija.in/wp-content/uploads/2026/07/Honey-wax-768x475.webp',
      fallbackImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80',
      alt: 'Natural golden honeycomb and pure raw forest honey',
    },
  ],
};

// Live WordPress WooCommerce products generated from wc-products.json
import localWcProducts from './wc-products.json';

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

function formatPrice(minorStr?: string, symbol: string = '₹', minorUnit: number = 2): string {
  if (!minorStr) return `${symbol}0.00`;
  const num = parseFloat(minorStr);
  if (isNaN(num)) return `${symbol}0.00`;
  const val = minorUnit > 0 ? num / Math.pow(10, minorUnit) : num;
  return `${symbol}${val.toFixed(2)}`;
}

// Convert WordPress WooCommerce Store API data into Product objects
export const catalogProducts: Product[] = (localWcProducts as any[]).map((woo) => {
  const slug = woo.slug || `product-${woo.id}`;
  const rawName = decodeHtmlEntities(woo.name || '');
  const onSale = Boolean(woo.on_sale);

  const price = formatPrice(
    woo.prices?.price || woo.prices?.sale_price || woo.prices?.regular_price,
    woo.prices?.currency_symbol || '₹',
    woo.prices?.currency_minor_unit ?? 2
  );

  const originalPrice = onSale
    ? formatPrice(
        woo.prices?.regular_price,
        woo.prices?.currency_symbol || '₹',
        woo.prices?.currency_minor_unit ?? 2
      )
    : undefined;

  const categorySlugs: string[] = Array.isArray(woo.categories)
    ? woo.categories.map((c: any) => c.slug?.toLowerCase() || '')
    : [];

  const isWellness = categorySlugs.some(
    (s) => s === 'wellness' || s.includes('chaithanya') || s === 'honey'
  );
  const catalogCategory: 'beauty' | 'wellness' = isWellness ? 'wellness' : 'beauty';

  let categoryId: ProductCategory = 'skincare';
  let categoryLabel = 'Skincare & Face';
  if (categorySlugs.some((s) => s.includes('hair'))) {
    categoryId = 'haircare';
    categoryLabel = 'Hair & Scalp Care';
  } else if (categorySlugs.some((s) => s === 'honey')) {
    categoryId = 'nutrition';
    categoryLabel = 'Pure Nutrition';
  } else if (isWellness) {
    categoryId = 'wellness';
    categoryLabel = 'Wellness & Vitality';
  }

  const cleanDesc = stripHtml(woo.short_description || woo.description || '');
  const primaryImage =
    woo.images && woo.images.length > 0 && woo.images[0]?.src
      ? woo.images[0].src
      : '/products/placeholder.webp';

  return {
    id: slug,
    name: rawName,
    subtitle: isWellness ? 'Ayurvedic Wellness & Vitality' : 'Natural Botanical Care',
    category: categoryLabel,
    categoryId,
    catalogCategory,
    description: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
    size: slug.includes('30-g') ? '30 g' : slug.includes('80g') ? '80 g' : 'Standard Pack',
    price,
    originalPrice,
    rating: 4.8 + (woo.id % 3) * 0.1,
    reviewsCount: 80 + (woo.id % 70),
    image: primaryImage,
    fallbackImage: primaryImage,
    badge: onSale ? 'Sale!' : undefined,
    onSale,
    actionText: onSale ? 'Read more' : 'Add to cart',
    tags: [catalogCategory === 'wellness' ? 'Ayurvedic' : 'Botanical', '100% Natural', 'Lab Tested'],
    keyIngredients: ['Pure Herbal Extracts', 'Natural Botanical Oils'],
    inStock: woo.is_in_stock !== false,
    featured: slug === 'kshithija-pure-honey' || slug === 'grow-hair-30-g',
  };
});

export const productsData: ProductsPageData = {
  hero: productsHeroData,
  guarantees: [
    {
      icon: '🌿',
      title: 'Purely Natural',
      description: 'Every formulation is free from harsh chemicals, parabens, and synthetic preservatives – just nature, bottled.',
    },
    {
      icon: '🔬',
      title: 'Lab Tested',
      description: 'Our natural beauty products are tested in certified labs to ensure safety, efficacy, and consistency in every batch.',
    },
    {
      icon: '🚫',
      title: 'For Every Skin',
      description: 'These natural beauty products are crafted to be gentle for all skin types from sensitive to combination without compromise.',
    },
  ],
  categories: [
    { id: 'all', label: 'All Products', count: catalogProducts.length },
    { id: 'skincare', label: 'Beauty Products', count: catalogProducts.filter((p) => p.catalogCategory === 'beauty').length },
    { id: 'wellness', label: 'Wellness Products', count: catalogProducts.filter((p) => p.catalogCategory === 'wellness').length },
  ],
  products: catalogProducts,
};

// Backwards-compatible exports for existing homepage imports
export const products: Product[] = catalogProducts;
export const featuredProduct: Product = catalogProducts.find((p) => p.featured) || catalogProducts[0];
export const gridProducts: Product[] = catalogProducts.filter((p) => !p.featured);