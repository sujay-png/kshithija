import type { Metadata } from 'next';
import { getPageSeo, siteConfig, type SeoMeta } from '@data/seo';

export function buildMetadata(pathname: string, customSeo?: Partial<SeoMeta> & { noindex?: boolean }): Metadata {
  const resolvedRobots = customSeo?.noindex ? 'noindex, nofollow' : customSeo?.robots;
  const pageSeo = getPageSeo(pathname, {
    ...customSeo,
    robots: resolvedRobots,
  });

  const isNoIndex = pageSeo.robots?.includes('noindex');
  const isNoFollow = pageSeo.robots?.includes('nofollow');

  return {
    title: pageSeo.title,
    description: pageSeo.description,
    keywords: pageSeo.keywords,
    alternates: {
      canonical: pageSeo.canonical,
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
    },
    openGraph: {
      type: pageSeo.type === 'article' ? 'article' : 'website',
      url: pageSeo.canonical,
      title: pageSeo.title,
      description: pageSeo.description,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      images: [
        {
          url: pageSeo.image,
          alt: pageSeo.imageAlt || pageSeo.title,
        },
      ],
      ...(pageSeo.type === 'article' && pageSeo.publishedTime
        ? { publishedTime: pageSeo.publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: pageSeo.title,
      description: pageSeo.description,
      images: [pageSeo.image],
    },
  };
}
