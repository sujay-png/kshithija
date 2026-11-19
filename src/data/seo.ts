// src/data/seo.ts
// Centralized SEO Configuration & Dynamic Metadata Generator for Kshithija Enterprises

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt?: string;
  keywords: string[];
  robots: string;
  type: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  price?: string | number;
  currency?: string;
  availability?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleSuffix: string;
  defaultDescription: string;
  defaultImage: string;
  defaultKeywords: string[];
  locale: string;
  twitterHandle: string;
  organization: {
    name: string;
    legalName: string;
    url: string;
    logo: string;
    phone: string;
    email: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    socialLinks: string[];
    priceRange: string;
  };
}

export const siteConfig: SiteConfig = {
  siteName: 'Kshithija Enterprises',
  siteUrl: 'https://kshithija.in',
  defaultTitle: 'Ayurvedic wellness and vitality supplements Mangaluru | Kshithija Enterprises',
  titleSuffix: 'Kshithija Enterprises',
  defaultDescription:
    '100% natural ayurvedic wellness and vitality supplements by trusted partner Kshithija enterprises offering 100% natural products for health and wellness needs.',
  defaultImage: 'https://kshithija.in/wp-content/uploads/2025/11/kshithija-posters-31-e1787741341677.webp',
  defaultKeywords: [
    'Ayurvedic supplements Mangaluru',
    'Kshithija Enterprises',
    '100% natural wellness products',
    'plant-based skincare India',
    'aloe vera skin cream Mangalore',
    'ayurvedic vitalizer oil',
    'chaithanya 2000 plus energy supplement',
    'sugar free ayurvedic vitality',
    'chemical free moisturizers',
    'clean beauty Karnataka',
  ],
  locale: 'en_US',
  twitterHandle: '@kshithija_in',
  organization: {
    name: 'Kshithija Enterprises',
    legalName: 'Kshithija Enterprises Mangaluru',
    url: 'https://kshithija.in',
    logo: 'https://kshithija.in/wp-content/uploads/2025/11/kshithija-1.png',
    phone: '+91 7975310662',
    email: 'kshithijamlr@gmail.com',
    address: {
      streetAddress: '1st Cross Rd, opposite Ananya Apartment, West Road',
      addressLocality: 'Mangaluru',
      addressRegion: 'Karnataka',
      postalCode: '575003',
      addressCountry: 'India',
    },
    socialLinks: [
      'https://www.facebook.com/profile.php?id=61586210368954',
      'https://www.instagram.com/kshithija_enterprises',
    ],
    priceRange: '₹99 - ₹4050',
  },
};

/**
 * Static page SEO definitions dictionary
 */
export const pageSeoMap: Record<string, Partial<SeoMeta>> = {
  '/': {
    title: 'Ayurvedic wellness and vitality supplements Mangaluru | Kshithija Enterprises',
    description:
      '100% natural ayurvedic wellness and vitality supplements by trusted partner Kshithija enterprises offering 100% natural products for health and wellness needs.',
    keywords: [
      'Ayurvedic wellness Mangaluru',
      'vitality supplements',
      'Kshithija Enterprises',
      'aloe vera skin cream',
      'plant-based cosmetics',
      'herbal healing vasel',
    ],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/products': {
    title: 'All Ayurvedic Formulations & Natural Personal Care | Kshithija Enterprises',
    description:
      'Explore our full collection of 100% plant-based skincare, herbal hair remedies, and vitality wellness supplements. Direct from Mangaluru with pan-India delivery.',
    keywords: [
      'buy ayurvedic products online',
      'natural face cream',
      'hair vitalizer oil',
      'chaithanya 2000 plus',
      'kshithija store',
    ],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/beauty': {
    title: 'Clean Beauty & Botanical Skincare Products | Kshithija Enterprises',
    description:
      'Formulated with fresh botanical extracts and zero petroleum jelly, mineral oils, or synthetic fragrances. Experience true plant-based nourishment.',
    keywords: ['clean beauty products', 'aloe vera skin cream', 'paraben free moisturizer', 'botanical skincare India'],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/wellness': {
    title: 'Ayurvedic Wellness & Vitality Supplements | Kshithija Enterprises',
    description:
      'Rejuvenate vitality naturally with Chaithanya 2000 Plus, pure Western Ghats honey, and traditional herbal rasayanas crafted in Mangaluru.',
    keywords: ['vitality supplement', 'ayurvedic rasayana', 'sugar free vitality', 'pure natural honey', 'energy supplement'],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/wellness-products': {
    title: 'Ayurvedic Wellness & Vitality Supplements | Kshithija Enterprises',
    description:
      'Holistic health and energy supplements crafted with authentic Ayurvedic herbs to restore stamina, vigor, and daily wellness.',
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/blogs': {
    title: 'Botanical Journal & Natural Skincare Wisdom | Kshithija Enterprises',
    description:
      'Expert advice, scientific botanical research, and holistic ayurvedic routines for radiant skin, strong hair, and lasting vitality.',
    keywords: ['ayurvedic skincare blog', 'natural hair care tips', 'aloe vera benefits', 'botanical wisdom'],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/blog': {
    title: 'Botanical Journal & Natural Skincare Wisdom | Kshithija Enterprises',
    description:
      'Expert advice, scientific botanical research, and holistic ayurvedic routines for radiant skin, strong hair, and lasting vitality.',
    keywords: ['ayurvedic skincare blog', 'natural hair care tips', 'aloe vera benefits', 'botanical wisdom'],
    type: 'website',
    canonical: 'https://kshithija.in/blog',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/contact': {
    title: 'Contact Us | Kshithija Enterprises Mangaluru',
    description:
      'Get in touch with our Mangaluru store team for formulation inquiries, order tracking, bulk distribution, and partner consultations.',
    keywords: ['contact kshithija', 'mangaluru store location', 'ayurvedic store contact', 'order support'],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/contact-us': {
    title: 'Contact Us | Kshithija Enterprises Mangaluru',
    description:
      'Get in touch with our Mangaluru store team for formulation inquiries, order tracking, bulk distribution, and partner consultations.',
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/testimonials': {
    title: 'Real Customer Stories & Verified Reviews | Kshithija Enterprises',
    description:
      'Read verified customer feedback and real experiences from families across India using Kshithija natural skincare and wellness formulations.',
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/career': {
    title: 'Careers & Opportunities | Kshithija Enterprises',
    description:
      'Join our passionate team in Mangaluru dedicated to creating clean, lab-validated botanical wellness and skincare products.',
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/affiliate-registration': {
    title: 'Become an Official Brand Partner | Kshithija Affiliate Program',
    description:
      'Join the Kshithija affiliate partner program. Share authentic plant-based wellness and skincare formulations while earning generous referral commissions.',
    keywords: ['affiliate registration', 'ayurvedic affiliate program', 'earn referral commissions', 'kshithija partner'],
    type: 'website',
    robots: 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  },
  '/affiliate-dashboard': {
    title: 'Affiliate Partner Portal & Dashboard | Kshithija Enterprises',
    description: 'Log in to track referral clicks, commissions, promotional affiliate links, and partner performance.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/affiliate-login': {
    title: 'Affiliate Partner Login | Kshithija Enterprises',
    description: 'Secure partner portal login for registered Kshithija affiliate ambassadors.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/dashboard': {
    title: 'Customer Account Dashboard | Kshithija Enterprises',
    description: 'Manage your active orders, delivery addresses, and personal profile in one secure customer portal.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/orders': {
    title: 'My Orders & Shipment Tracking | Kshithija Enterprises',
    description: 'View order status, Blue Dart courier AWB tracking, and download official GST tax invoices.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/cart': {
    title: 'Your Shopping Cart | Kshithija Enterprises',
    description: 'Review your selected botanical formulations and calculate instant discounts before checkout.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/viewcart': {
    title: 'Your Shopping Cart | Kshithija Enterprises',
    description: 'Review your selected botanical formulations and calculate instant discounts before checkout.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/checkout': {
    title: 'Secure Checkout | Kshithija Enterprises',
    description: 'Complete your order with secure UPI, Cards, NetBanking via Razorpay or Cash on Delivery.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/login': {
    title: 'Customer Sign In | Kshithija Enterprises',
    description: 'Sign in to access your orders, saved addresses, and exclusive member discounts.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/forgotpassword': {
    title: 'Reset Your Password | Kshithija Enterprises',
    description: 'Securely recover access to your Kshithija customer account with your registered email or username.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/addresses': {
    title: 'Delivery Addresses | Kshithija Enterprises',
    description: 'Manage your primary billing and doorstep shipping addresses for quick checkout.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/delivery-addresses': {
    title: 'Delivery Addresses | Kshithija Enterprises',
    description: 'Manage your primary billing and doorstep shipping addresses for quick checkout.',
    type: 'website',
    robots: 'noindex, follow',
  },
  '/account-details': {
    title: 'Account Details | Kshithija Enterprises',
    description: 'Update your customer profile, contact information, and security preferences.',
    type: 'website',
    robots: 'noindex, follow',
  },
};

/**
 * Format title with standard suffix unless already present
 */
export function formatTitle(title?: string): string {
  if (!title || !title.trim()) {
    return siteConfig.defaultTitle;
  }
  const clean = title.trim();
  if (clean.toLowerCase().includes('kshithija')) {
    return clean;
  }
  return `${clean} | ${siteConfig.titleSuffix}`;
}

/**
 * Clean path helper to match static map
 */
function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  // Strip origin or trailing slash if not root
  let clean = pathname.replace(/\/+$/, '');
  if (!clean.startsWith('/')) clean = '/' + clean;
  return clean || '/';
}

/**
 * Core dynamic SEO resolver used across Layout.astro
 */
export function getPageSeo(pathname: string, custom?: Partial<SeoMeta>): SeoMeta {
  const path = normalizePath(pathname);
  const matchedConfig = pageSeoMap[path] || {};

  const rawTitle = custom?.title || matchedConfig.title || siteConfig.defaultTitle;
  const title = formatTitle(rawTitle);

  const description =
    custom?.description?.trim() ||
    matchedConfig.description ||
    siteConfig.defaultDescription;

  const canonical =
    custom?.canonical ||
    `${siteConfig.siteUrl}${path === '/' ? '' : path}`;

  const image =
    custom?.image ||
    matchedConfig.image ||
    siteConfig.defaultImage;

  const imageAlt =
    custom?.imageAlt ||
    matchedConfig.imageAlt ||
    title;

  const keywords = Array.from(
    new Set([
      ...(custom?.keywords || []),
      ...(matchedConfig.keywords || []),
      ...siteConfig.defaultKeywords,
    ])
  );

  const robots =
    custom?.robots ||
    matchedConfig.robots ||
    'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';

  const type = custom?.type || matchedConfig.type || 'website';

  // Build JSON-LD structured schemas
  const jsonLd = custom?.jsonLd || [
    // Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': ['HealthAndBeautyBusiness', 'Organization'],
      '@id': `${siteConfig.siteUrl}/#organization`,
      name: siteConfig.organization.name,
      legalName: siteConfig.organization.legalName,
      url: siteConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        '@id': `${siteConfig.siteUrl}/#logo`,
        url: siteConfig.organization.logo,
        caption: siteConfig.organization.name,
      },
      image: siteConfig.defaultImage,
      telephone: siteConfig.organization.phone,
      email: siteConfig.organization.email,
      priceRange: siteConfig.organization.priceRange,
      sameAs: siteConfig.organization.socialLinks,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.organization.address.streetAddress,
        addressLocality: siteConfig.organization.address.addressLocality,
        addressRegion: siteConfig.organization.address.addressRegion,
        postalCode: siteConfig.organization.address.postalCode,
        addressCountry: siteConfig.organization.address.addressCountry,
      },
    },
    // WebSite Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteConfig.siteUrl}/#website`,
      url: siteConfig.siteUrl,
      name: siteConfig.siteName,
      publisher: {
        '@id': `${siteConfig.siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.siteUrl}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return {
    title,
    description,
    canonical,
    image,
    imageAlt,
    keywords,
    robots,
    type,
    publishedTime: custom?.publishedTime,
    modifiedTime: custom?.modifiedTime,
    author: custom?.author,
    price: custom?.price,
    currency: custom?.currency,
    availability: custom?.availability,
    jsonLd,
  };
}

/**
 * Dynamic Product SEO generator
 */
export function getProductSeo(product: {
  id?: string | number;
  name: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  price?: string | number;
  regularPrice?: string | number;
  category?: string;
  inStock?: boolean;
}): Partial<SeoMeta> {
  const cleanDesc = (product.shortDescription || product.description || '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 160);

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price;

  return {
    title: `${product.name} | Kshithija Enterprises`,
    description: cleanDesc || `Buy authentic ${product.name} formulated with pure botanical extracts from Kshithija Enterprises Mangaluru.`,
    canonical: `${siteConfig.siteUrl}/product/${product.id}`,
    image: product.image || siteConfig.defaultImage,
    imageAlt: product.name,
    type: 'product',
    price: priceNum,
    currency: 'INR',
    availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    keywords: [
      product.name,
      product.category || 'Ayurvedic Skincare',
      'Kshithija Enterprises',
      'Mangaluru botanical care',
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image || siteConfig.defaultImage,
      description: cleanDesc,
      brand: {
        '@type': 'Brand',
        name: siteConfig.siteName,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: priceNum || '0',
        availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        url: `${siteConfig.siteUrl}/product/${product.id}`,
        seller: {
          '@type': 'Organization',
          name: siteConfig.siteName,
        },
      },
    },
  };
}

/**
 * Dynamic Blog Article SEO generator
 */
export function getBlogSeo(article: {
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date?: string;
  author?: string;
}): Partial<SeoMeta> {
  const cleanExcerpt = (article.excerpt || article.content || '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 160);

  return {
    title: `${article.title} | Kshithija Botanical Journal`,
    description: cleanExcerpt || `Read ${article.title} on Kshithija Enterprises Botanical Journal.`,
    canonical: article.slug ? `${siteConfig.siteUrl}/blog/${article.slug}` : `${siteConfig.siteUrl}/blog`,
    image: article.image || siteConfig.defaultImage,
    imageAlt: article.title,
    type: 'article',
    author: article.author || 'Kshithija Research Team',
    publishedTime: article.date,
    keywords: [article.title, 'Botanical Skincare', 'Ayurvedic Advice', 'Kshithija Journal'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      image: article.image || siteConfig.defaultImage,
      description: cleanExcerpt,
      author: {
        '@type': 'Person',
        name: article.author || 'Kshithija Research Team',
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.siteName,
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.organization.logo,
        },
      },
      datePublished: article.date,
    },
  };
}
