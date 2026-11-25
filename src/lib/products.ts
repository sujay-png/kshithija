// src/lib/products.ts
// Live WordPress / WooCommerce Store API integration for Kshithija Enterprises
import localWcProducts from '../data/wc-products.json';
import {
  type Product,
  type ProductCategory,
  type CatalogCategory,
  productsHeroData,
} from '../data/products';

export type { Product, ProductCategory, CatalogCategory };
export { productsHeroData };

const WP_BASE_URL = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in').replace(/\/+$/, '');
const WC_CONSUMER_KEY = (typeof process !== 'undefined' ? process.env?.WC_CONSUMER_KEY || '' : '').trim();
const WC_CONSUMER_SECRET = (typeof process !== 'undefined' ? process.env?.WC_CONSUMER_SECRET || '' : '').trim();

// WooCommerce Official REST API v3 Endpoint (Requires Consumer Key & Secret)
const V3_PRODUCTS_URL = `${WP_BASE_URL}/wp-json/wc/v3/products?per_page=100`;

// WooCommerce Public Store API Endpoint (Fallback when keys are not configured)
const STORE_PRODUCTS_URL = `${WP_BASE_URL}/wp-json/wc/store/v1/products?per_page=100`;

// Cache TTL: 3 minutes in-memory
let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3 * 60 * 1000;

// Legacy slug/id aliases for backward-compatible routing
const LEGACY_ALIASES: Record<string, string[]> = {
  'grow-hair-30-g': ['grow-hair-anti-dandruff'],
  'chaithanya-2000-plus-without-sugar': ['chaithanya-2000-plus-ws'],
  'chaithanya-2000-plus': ['natural-wellness-supplement'],
  'kshithija-pure-honey': ['pure-honey'],
  'vasel': ['healing-cream-vasel', 'clarifying-face-cream'],
  'vishaka-aloe-vera-multipurpose-skin-cream-80g': ['allday-moisturizing-cream'],
  'best-anti-dandruff-hair-cream': ['herbal-scalp-vitalizer-oil', 'grow-hair-70-g'],
};

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

/**
 * Dynamically extract rich product details directly from the WooCommerce product page HTML
 */
export function parseWooCommerceHtml(html: string, rawDesc?: string) {
  if (!html) return {};

  // 1. Badge icons from WooCommerce product page
  const badgeMatches = [...html.matchAll(/<div class="elementor-image-box-wrapper">[\s\S]*?<img[^>]+src="([^">]+)"[\s\S]*?<h3[^>]*class="elementor-image-box-title">([\s\S]*?)<\/h3>/gi)];
  const badgeIcons = badgeMatches
    .map(m => ({
      title: decodeHtmlEntities(m[2].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim()),
      image: m[1]
    }))
    .filter(b => b.title && !b.title.includes('Kshithija') && !b.title.includes('Login'))
    .slice(0, 4);

  // 2. Specifications from WooCommerce product page
  const specifications: Record<string, string> = {};
  const brandM = html.match(/<strong>Brand\s*<\/strong>[\s\S]*?<br\s*\/?>\s*([^<]+)/i);
  if (brandM) specifications['Brand'] = decodeHtmlEntities(brandM[1].trim());

  const modelM = html.match(/<strong>Model Name\s*<\/strong>[\s\S]*?<br\s*\/?>\s*([^<]+)/i);
  if (modelM) specifications['Model Name'] = decodeHtmlEntities(modelM[1].trim());

  const idealM = html.match(/<strong>Ideal For\s*<\/strong>[\s\S]*?<br\s*\/?>\s*([^<]+)/i);
  if (idealM) specifications['Ideal For'] = decodeHtmlEntities(idealM[1].trim());

  const typeM = html.match(/<strong>Type\s*<\/strong>\s*(?:<br\s*\/?>)?\s*([^<]+)/i);
  if (typeM) specifications['Type'] = decodeHtmlEntities(typeM[1].trim());

  const ingTypeM = html.match(/<strong>Ingredient Type<\/strong><\/div><div[^>]*>([^<]+)<\/div>/i);
  if (ingTypeM) specifications['Ingredient Type'] = decodeHtmlEntities(ingTypeM[1].trim());

  const shelfM = html.match(/<strong>Maximum Shelf Life<\/strong><\/div><div[^>]*>([^<]+)<\/div>/i);
  if (shelfM) specifications['Maximum Shelf Life'] = decodeHtmlEntities(shelfM[1].trim());

  const prescM = html.match(/<strong>Prescription Required<\/strong><\/div><div[^>]*>([^<]+)<\/div>/i);
  if (prescM) specifications['Prescription Required'] = decodeHtmlEntities(prescM[1].trim());

  const profM = html.match(/<strong>Professional Care<\/strong><\/div><div[^>]*>([^<]+)<\/div>/i);
  if (profM) specifications['Professional Care'] = decodeHtmlEntities(profM[1].trim());

  const qtyM = html.match(/<strong>Quantity\s*<\/strong>\s*([^<]+)/i);
  if (qtyM) specifications['Quantity'] = decodeHtmlEntities(qtyM[1].trim());

  // 3. Additional Features from WooCommerce product page
  let additionalFeatures: string[] = [];
  const addFeatIdx = html.indexOf('Additional Features');
  if (addFeatIdx !== -1) {
    const featSnippet = html.substring(addFeatIdx, addFeatIdx + 1200);
    const pMatch = featSnippet.match(/<p>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      const raw = pMatch[1].replace(/<[^>]+>/g, '').replace(/Additional Features/gi, '').trim();
      additionalFeatures = raw.split(/•|⁠•/g).map(s => decodeHtmlEntities(s.trim())).filter(s => s.length > 2);
    }
  }

  // 4. Detailed Ingredients with live images from WooCommerce product page
  const detailedIngredients: { name: string; image: string }[] = [];
  const ingIdx = html.indexOf('Ingredients');
  if (ingIdx !== -1) {
    const ingSection = html.substring(ingIdx, ingIdx + 12000);
    const endSection = ingSection.indexOf('</details>');
    const targetSection = endSection !== -1 ? ingSection.substring(0, endSection) : ingSection;
    
    const cardMatches = [...targetSection.matchAll(/<img[^>]+src="([^">]+)"[\s\S]*?<p[^>]*>(?:<span[^>]*>)?<strong>([\s\S]*?)<\/strong>/gi)];
    for (const m of cardMatches) {
      const img = m[1];
      const name = decodeHtmlEntities(m[2].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim());
      if (name && !name.toLowerCase().includes('ingredient') && !detailedIngredients.some(x => x.name === name)) {
        detailedIngredients.push({ name, image: img });
      }
    }
  }

  // 5. Why Product Works from WooCommerce product page
  let whyItWorks = '';
  const whyMatch = html.match(/<h[3-6][^>]*>(?:<[^>]+>)*Why\s+([\s\S]*?)<\/h[3-6]>/i);
  if (whyMatch) {
    const start = html.indexOf(whyMatch[0]);
    const snippet = html.substring(start, start + 3500);
    const endDetails = snippet.indexOf('</details>');
    const endForm = snippet.indexOf('</form>');
    const end = endDetails !== -1 ? endDetails : (endForm !== -1 ? endForm : 2500);
    const pMatches = [...snippet.substring(0, end).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()))
      .filter(p => p.length > 25);
    whyItWorks = pMatches.join('\n\n');
  }

  // 6. Highlights (from Elementor About section or WooCommerce description list)
  const highlights: string[] = [];
  const aboutIdx = html.search(/<h[2-4][^>]*>About\s+[\s\S]*?<\/h[2-4]>/i);
  if (aboutIdx !== -1) {
    const aboutSnippet = html.substring(aboutIdx, aboutIdx + 6000);
    const endAbout = aboutSnippet.indexOf('<h', 10);
    const targetAbout = endAbout !== -1 ? aboutSnippet.substring(0, endAbout) : aboutSnippet;
    
    const liMatches = [...targetAbout.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    if (liMatches.length > 0) {
      for (const m of liMatches) {
        const txt = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        if (txt.length > 3) highlights.push(txt);
      }
    } else {
      const pMatches = [...targetAbout.matchAll(/<p[^>]*><strong>([\s\S]*?)<\/strong>(?:<br\s*\/?>)?([\s\S]*?)<\/p>/gi)];
      for (const m of pMatches) {
        const title = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').replace(/<br\s*\/?>/gi, ' ').trim());
        const desc = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
        if (title && !title.toLowerCase().includes('about')) {
          highlights.push(desc ? `${title}: ${desc}` : title);
        }
      }
    }
  }

  // If Elementor about section didn't have highlights, check WooCommerce description for <ul><li>
  if (highlights.length === 0 && rawDesc) {
    const descLis = [...rawDesc.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    for (const m of descLis) {
      const txt = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      if (txt.length > 3) highlights.push(txt);
    }
  }

  // 7. Routine notice from WooCommerce product page
  let routineNotice = '';
  const routineIdx = html.indexOf('Make It Part of Your Routine');
  if (routineIdx !== -1) {
    const routineSnippet = html.substring(routineIdx, routineIdx + 800);
    const pMatch = routineSnippet.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) routineNotice = decodeHtmlEntities(pMatch[1].replace(/<[^>]+>/g, '').trim());
  }

  return {
    badgeIcons: badgeIcons.length > 0 ? badgeIcons : undefined,
    specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    additionalFeatures: additionalFeatures.length > 0 ? additionalFeatures : undefined,
    detailedIngredients: detailedIngredients.length > 0 ? detailedIngredients : undefined,
    whyItWorks: whyItWorks || undefined,
    highlights: highlights.length > 0 ? highlights : undefined,
    routineNotice: routineNotice || undefined,
  };
}

/**
 * Transform raw WooCommerce Store API product into Kshithija Product interface
 * Enriched with live WooCommerce product page details
 */
export function transformWooProduct(woo: any, liveHtml?: string): Product {
  const slug = woo.slug || `product-${woo.id}`;
  const rawName = decodeHtmlEntities(woo.name || '');
  const onSale = Boolean(woo.on_sale);

  // Price formatting from WooCommerce minor units (e.g. 36900 -> ₹369.00)
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

  // Categories mapping from WooCommerce
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

  // Subtitle based on WooCommerce product data
  let subtitle = '100% Botanical Formulation';
  if (slug.includes('grow-hair')) subtitle = '100% Natural Dandruff & Flake Defense';
  else if (slug.includes('chaithanya') && slug.includes('without-sugar')) subtitle = 'Sugar-Free Daily Energy & Immunity';
  else if (slug.includes('chaithanya')) subtitle = 'Holistic Body Rejuvenation';
  else if (slug.includes('honey')) subtitle = 'Wild Forest Unheated Raw Harvest';
  else if (slug.includes('vasel')) subtitle = 'Intensive Skin Barrier Repair';
  else if (slug.includes('aloe') || slug.includes('vishaka')) subtitle = 'For Dry & Healthy Skin';
  else if (slug.includes('anti-dandruff')) subtitle = 'Therapeutic Root Nourishment';

  // Extract clean description text & full HTML from WooCommerce
  const rawDescHtml = woo.description || woo.short_description || '';
  const cleanDesc = stripHtml(rawDescHtml);

  // Extract all gallery images from WooCommerce
  const allImages: string[] = Array.isArray(woo.images) && woo.images.length > 0
    ? [...new Set(woo.images.map((img: any) => img.src).filter(Boolean))] as string[]
    : [];
  const primaryImage = allImages[0] || '/products/placeholder.webp';

  // Parse live WooCommerce HTML details
  const parsed = liveHtml ? parseWooCommerceHtml(liveHtml, rawDescHtml) : {};

  // Pack size from WooCommerce specifications or detection
  let size = 'Standard Pack';
  if (slug === 'vasel') size = '33 gm';
  else if (slug.includes('30-g') || rawName.includes('30 g') || rawName.includes('30g')) size = '30 g';
  else if (slug.includes('best-anti-dandruff') || rawName.includes('70 g') || rawName.includes('70g')) size = '70 g';
  else if (slug.includes('80g') || rawName.includes('80g')) size = '80 g';
  else if (slug.includes('honey') || slug.includes('chaithanya') || rawDescHtml.includes('500.g')) size = '500 g';
  else if (parsed.specifications?.['Quantity']) size = parsed.specifications['Quantity'];

  // Key natural ingredients extracted dynamically
  let keyIngredients: string[] = [];
  if (parsed.detailedIngredients && parsed.detailedIngredients.length > 0) {
    keyIngredients = parsed.detailedIngredients.map((i) => i.name);
  } else if (rawDescHtml) {
    const ingMatches = [...rawDescHtml.matchAll(/<li>(?:<strong>)?([^<:]+)(?:<\/strong>)?(?::)?\s*([^<]*)<\/li>/gi)];
    if (ingMatches.length > 0) {
      keyIngredients = ingMatches.map(m => decodeHtmlEntities(m[1].trim())).slice(0, 6);
    }
  }
  if (keyIngredients.length === 0) {
    keyIngredients = ['Pure Herbal Extracts', 'Natural Botanical Oils'];
  }

  // Highlights extracted dynamically from WooCommerce
  const highlights = parsed.highlights || (cleanDesc ? [cleanDesc] : [
    '100% Natural Formulation handcrafted with pure coastal botanical heritage',
    'Free from parabens, mineral oils, petroleum jelly, and synthetic preservatives',
  ]);

  // Why it works extracted dynamically from WooCommerce
  const whyItWorks = parsed.whyItWorks || cleanDesc;

  const aliases = LEGACY_ALIASES[slug] || [];
  const inStock = woo.is_in_stock !== false;

  return {
    id: slug,
    name: rawName,
    subtitle,
    category: categoryLabel,
    categoryId,
    catalogCategory,
    description: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
    descriptionHtml: rawDescHtml,
    highlights,
    whyItWorks,
    size,
    price,
    originalPrice,
    rating: 4.8 + (woo.id % 3) * 0.1,
    reviewsCount: 80 + (woo.id % 70),
    image: primaryImage,
    images: allImages,
    fallbackImage: primaryImage,
    badge: !inStock ? 'Sold Out' : (onSale ? 'Sale!' : undefined),
    onSale,
    actionText: !inStock ? 'Read more' : 'Add to cart',
    tags: [catalogCategory === 'wellness' ? 'Ayurvedic' : 'Botanical', '100% Natural', 'Lab Tested'],
    keyIngredients,
    specifications: parsed.specifications,
    detailedIngredients: parsed.detailedIngredients,
    additionalFeatures: parsed.additionalFeatures,
    routineNotice: parsed.routineNotice,
    badgeIcons: parsed.badgeIcons,
    inStock,
    featured: slug === 'vishaka-aloe-vera-multipurpose-skin-cream-80g' || slug === 'kshithija-pure-honey',
    permalink: woo.permalink || `https://kshithija.in/product/${slug}/`,
    aliasIds: aliases,
  };
}

/**
 * Transform raw WooCommerce Official REST API v3 product into Kshithija Product interface
 */
export function transformWooV3Product(woo: any, liveHtml?: string): Product {
  const slug = woo.slug || `product-${woo.id}`;
  const rawName = decodeHtmlEntities(woo.name || '');
  const onSale = Boolean(woo.on_sale);

  // In REST API v3, prices are formatted strings (e.g. "369.00" or "349")
  const rawPrice = woo.price || woo.sale_price || woo.regular_price || '0';
  const price = `₹${parseFloat(rawPrice).toFixed(2)}`;
  const originalPrice = onSale && woo.regular_price
    ? `₹${parseFloat(woo.regular_price).toFixed(2)}`
    : undefined;

  // Categories mapping from WooCommerce
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

  // Subtitle
  let subtitle = '100% Botanical Formulation';
  if (slug.includes('grow-hair')) subtitle = '100% Natural Dandruff & Flake Defense';
  else if (slug.includes('chaithanya') && slug.includes('without-sugar')) subtitle = 'Sugar-Free Daily Energy & Immunity';
  else if (slug.includes('chaithanya')) subtitle = 'Holistic Body Rejuvenation';
  else if (slug.includes('honey')) subtitle = 'Wild Forest Unheated Raw Harvest';
  else if (slug.includes('vasel')) subtitle = 'Intensive Skin Barrier Repair';
  else if (slug.includes('aloe') || slug.includes('vishaka')) subtitle = 'For Dry & Healthy Skin';
  else if (slug.includes('anti-dandruff')) subtitle = 'Therapeutic Root Nourishment';

  // Description
  const rawDescHtml = woo.description || woo.short_description || '';
  const cleanDesc = stripHtml(rawDescHtml);

  // Image galleries
  const allImages: string[] = Array.isArray(woo.images) && woo.images.length > 0
    ? [...new Set(woo.images.map((img: any) => img.src).filter(Boolean))] as string[]
    : [];
  const primaryImage = allImages[0] || '/products/placeholder.webp';

  // Live page details (ingredients with photos, specs, why it works)
  const parsed = liveHtml ? parseWooCommerceHtml(liveHtml, rawDescHtml) : {};

  // Extract specifications from WooCommerce product attributes if available
  const specifications: Record<string, string> = { ...(parsed.specifications || {}) };
  if (Array.isArray(woo.attributes)) {
    for (const attr of woo.attributes) {
      if (attr.name && attr.options && attr.options.length > 0) {
        specifications[attr.name] = attr.options.join(', ');
      }
    }
  }

  // Pack size
  let size = 'Standard Pack';
  if (slug === 'vasel') size = '33 gm';
  else if (slug.includes('30-g') || rawName.includes('30 g') || rawName.includes('30g')) size = '30 g';
  else if (slug.includes('best-anti-dandruff') || rawName.includes('70 g') || rawName.includes('70g')) size = '70 g';
  else if (slug.includes('80g') || rawName.includes('80g')) size = '80 g';
  else if (slug.includes('honey') || slug.includes('chaithanya') || rawDescHtml.includes('500.g')) size = '500 g';
  else if (specifications['Quantity'] || specifications['Size'] || specifications['Weight'] || parsed.specifications?.['Quantity']) {
    size = specifications['Quantity'] || specifications['Size'] || specifications['Weight'] || parsed.specifications?.['Quantity'] || 'Standard Pack';
  }

  // Key natural ingredients
  let keyIngredients: string[] = [];
  if (parsed.detailedIngredients && parsed.detailedIngredients.length > 0) {
    keyIngredients = parsed.detailedIngredients.map((i) => i.name);
  } else if (rawDescHtml) {
    const ingMatches = [...rawDescHtml.matchAll(/<li>(?:<strong>)?([^<:]+)(?:<\/strong>)?(?::)?\s*([^<]*)<\/li>/gi)];
    if (ingMatches.length > 0) {
      keyIngredients = ingMatches.map(m => decodeHtmlEntities(m[1].trim())).slice(0, 6);
    }
  }
  if (keyIngredients.length === 0) {
    keyIngredients = ['Pure Herbal Extracts', 'Natural Botanical Oils'];
  }

  const highlights = parsed.highlights || (cleanDesc ? [cleanDesc] : [
    '100% Natural Formulation handcrafted with pure coastal botanical heritage',
    'Free from parabens, mineral oils, petroleum jelly, and synthetic preservatives',
  ]);

  const whyItWorks = parsed.whyItWorks || cleanDesc;
  const aliases = LEGACY_ALIASES[slug] || [];
  const inStock = woo.stock_status === 'instock' || (woo.is_in_stock !== false && woo.stock_status !== 'outofstock');

  return {
    id: slug,
    name: rawName,
    subtitle,
    category: categoryLabel,
    categoryId,
    catalogCategory,
    description: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
    descriptionHtml: rawDescHtml,
    highlights,
    whyItWorks,
    size,
    price,
    originalPrice,
    rating: parseFloat(woo.average_rating) || (4.8 + (woo.id % 3) * 0.1),
    reviewsCount: parseInt(woo.rating_count) || (80 + (woo.id % 70)),
    image: primaryImage,
    images: allImages,
    fallbackImage: primaryImage,
    badge: !inStock ? 'Sold Out' : (onSale ? 'Sale!' : undefined),
    onSale,
    actionText: !inStock ? 'Read more' : 'Add to cart',
    tags: [catalogCategory === 'wellness' ? 'Ayurvedic' : 'Botanical', '100% Natural', 'Lab Tested'],
    keyIngredients,
    specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    detailedIngredients: parsed.detailedIngredients,
    additionalFeatures: parsed.additionalFeatures,
    routineNotice: parsed.routineNotice,
    badgeIcons: parsed.badgeIcons,
    inStock,
    featured: slug === 'vishaka-aloe-vera-multipurpose-skin-cream-80g' || woo.featured || slug === 'kshithija-pure-honey',
    permalink: woo.permalink || `https://kshithija.in/product/${slug}/`,
    aliasIds: aliases,
  };
}

/**
 * Fetch all products dynamically from WordPress WooCommerce REST API (v3 or Store API)
 * Falls back safely to local snapshot in src/data/wc-products.json if offline
 */
export async function getProducts(): Promise<Product[]> {
  if (cachedProducts && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedProducts;
  }

  // 1. Official WooCommerce REST API v3 (Used when WC_CONSUMER_KEY & WC_CONSUMER_SECRET are configured)
  if (WC_CONSUMER_KEY && WC_CONSUMER_SECRET) {
    try {
      const basicAuth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
      const res = await fetch(V3_PRODUCTS_URL, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const enriched = await Promise.all(
            data.map(async (woo: any) => {
              let liveHtml: string | undefined = undefined;
              if (woo.permalink) {
                try {
                  const pageRes = await fetch(woo.permalink, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                  });
                  if (pageRes.ok) liveHtml = await pageRes.text();
                } catch (e) {}
              }
              return transformWooV3Product(woo, liveHtml);
            })
          );

          cachedProducts = enriched;
          lastFetchTime = Date.now();
          return cachedProducts;
        }
      } else {
        console.warn(`[WooCommerce REST API v3] HTTP ${res.status} ${res.statusText}. Check consumer key & secret.`);
      }
    } catch (err) {
      console.warn('[WooCommerce REST API v3] Fetch failed:', (err as Error).message);
    }
  }

  // 2. Fallback to WooCommerce Store API
  try {
    const res = await fetch(STORE_PRODUCTS_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Fetch live WooCommerce product details for each product in parallel
        const enriched = await Promise.all(
          data.map(async (woo: any) => {
            let liveHtml: string | undefined = undefined;
            if (woo.permalink) {
              try {
                const pageRes = await fetch(woo.permalink, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                });
                if (pageRes.ok) {
                  liveHtml = await pageRes.text();
                }
              } catch (e) {
                // Silently continue with store API data if individual permalink fetch fails
              }
            }
            return transformWooProduct(woo, liveHtml);
          })
        );

        cachedProducts = enriched;
        lastFetchTime = Date.now();
        return cachedProducts;
      }
    }
  } catch (err) {
    console.warn('Live WordPress WooCommerce fetch failed, using local fallback:', (err as Error).message);
  }

  // Graceful fallback from local snapshot
  cachedProducts = (localWcProducts as any[]).map((woo) => transformWooProduct(woo));
  lastFetchTime = Date.now();
  return cachedProducts;
}

/**
 * Find single product by slug or alias ID, fetching fresh from WooCommerce
 */
export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const all = await getProducts();
  const direct = all.find((p) => p.id === idOrSlug);
  if (direct) return direct;

  const aliased = all.find((p) => p.aliasIds?.includes(idOrSlug));
  if (aliased) return aliased;

  // Direct fetch from WooCommerce for this slug if not in cached pool
  try {
    const pageRes = await fetch(`${WP_BASE_URL}/product/${idOrSlug}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (pageRes.ok) {
      const liveHtml = await pageRes.text();
      const base = (localWcProducts as any[]).find((p) => p.slug === idOrSlug);
      if (base) {
        return transformWooProduct(base, liveHtml);
      }
    }
  } catch {}

  return null;
}

/**
 * Filter products by catalog category ('beauty' | 'wellness' | 'all')
 */
export async function getProductsByCategory(category?: string): Promise<Product[]> {
  const all = await getProducts();
  if (!category || category === 'all') return all;
  return all.filter((p) => p.catalogCategory === category);
}

/**
 * Homepage Featured product (Best Seller)
 */
export async function getFeaturedProduct(): Promise<Product> {
  const all = await getProducts();
  return (
    all.find(
      (p) =>
        p.id === 'vishaka-aloe-vera-multipurpose-skin-cream-80g' ||
        p.aliasIds?.includes('vishaka-aloe-vera-multipurpose-skin-cream-80g') ||
        p.id.includes('vishaka') ||
        p.id.includes('allday') ||
        p.name.toLowerCase().includes('all day smart')
    ) ||
    all.find((p) => p.featured) ||
    all[0]
  );
}

/**
 * Homepage Complementary grid products
 */
export async function getGridProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = await getFeaturedProduct();
  return all.filter((p) => p.id !== featured.id).slice(0, 4);
}

// Synchronous catalogProducts generated from local WordPress snapshot for legacy imports
export const catalogProducts: Product[] = (localWcProducts as any[]).map((woo) => transformWooProduct(woo));
export const products = catalogProducts;
export const featuredProduct =
  catalogProducts.find(
    (p) =>
      p.id === 'vishaka-aloe-vera-multipurpose-skin-cream-80g' ||
      p.aliasIds?.includes('vishaka-aloe-vera-multipurpose-skin-cream-80g') ||
      p.id.includes('vishaka') ||
      p.id.includes('allday') ||
      p.name.toLowerCase().includes('all day smart')
  ) ||
  catalogProducts.find((p) => p.featured) ||
  catalogProducts[0];
export const gridProducts = catalogProducts.filter((p) => p.id !== featuredProduct.id).slice(0, 4);
