// src/data/robotic.ts
// Centralized Robots Directives and Crawling Rules for Kshithija Enterprises

export interface RobotsGroup {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  siteUrl: string;
  sitemapUrl: string;
  host: string;
  groups: RobotsGroup[];
}

export const robotsConfig: RobotsConfig = {
  siteUrl: 'https://kshithija.in',
  sitemapUrl: 'https://kshithija.in/sitemap-index.xml',
  host: 'https://kshithija.in',
  groups: [
    {
      userAgent: '*',
      allow: [
        '/',
        '/products',
        '/products/*',
        '/product',
        '/product/*',
        '/beauty',
        '/beauty/*',
        '/wellness',
        '/wellness/*',
        '/wellness-products',
        '/blogs',
        '/blogs/*',
        '/blog',
        '/blog/*',
        '/contact',
        '/contact-us',
        '/testimonials',
        '/career',
        '/affiliate-registration',
      ],
      disallow: [
        '/checkout',
        '/checkout/*',
        '/cart',
        '/cart/*',
        '/viewcart',
        '/viewcart/*',
        '/orders',
        '/orders/*',
        '/dashboard',
        '/dashboard/*',
        '/my-account',
        '/my-account/*',
        '/login',
        '/login/*',
        '/forgotpassword',
        '/forgotpassword/*',
        '/addresses',
        '/addresses/*',
        '/delivery-addresses',
        '/delivery-addresses/*',
        '/account-details',
        '/account-details/*',
        '/affiliate-dashboard',
        '/affiliate-dashboard/*',
        '/affiliate-login',
        '/affiliate-login/*',
        '/wp-admin/',
        '/wp-login.php',
        '/wp-json/',
        '/*?*', // Disallow tracking parameters and filter queries
      ],
    },
    {
      userAgent: 'Googlebot-Image',
      allow: [
        '/images/*',
        '/products/*',
        '/wp-content/uploads/*',
      ],
      disallow: [
        '/wp-admin/',
      ],
    },
  ],
};

/**
 * Generate standard robots.txt plain text file content
 */
export function generateRobotsTxt(config: RobotsConfig = robotsConfig): string {
  const lines: string[] = [];

  lines.push('# ========================================================');
  lines.push('# Robots.txt for Kshithija Enterprises (https://kshithija.in)');
  lines.push('# Generated dynamically via src/data/robotic.ts');
  lines.push('# ========================================================');
  lines.push('');

  for (const group of config.groups) {
    lines.push(`User-agent: ${group.userAgent}`);
    if (group.crawlDelay) {
      lines.push(`Crawl-delay: ${group.crawlDelay}`);
    }
    if (group.allow && group.allow.length > 0) {
      for (const path of group.allow) {
        lines.push(`Allow: ${path}`);
      }
    }
    if (group.disallow && group.disallow.length > 0) {
      for (const path of group.disallow) {
        lines.push(`Disallow: ${path}`);
      }
    }
    lines.push('');
  }

  lines.push(`Host: ${config.host}`);
  lines.push(`Sitemap: ${config.sitemapUrl}`);

  return lines.join('\n') + '\n';
}
