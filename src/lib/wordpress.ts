// src/lib/wordpress.ts
// Direct WordPress REST API integration with local fallback for Kshithija Enterprises
import localBlogs from '../data/blogs.json';

const WP_BASE_URL = (import.meta.env.PUBLIC_WP_BASE_URL || 'https://kshithija.in/').replace(/\/+$/, '');
const REST_API_URL = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=100`;

export const POSTS_PER_PAGE = 9;
const FALLBACK_IMAGE = 'https://kshithija.in/wp-content/uploads/2026/01/natural-skin-care-products.webp';

// --- TYPESCRIPT INTERFACES ---
export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: { name: string }[];
    'wp:featuredmedia'?: { source_url: string; alt_text: string }[];
    'wp:term'?: WPTerm[][];
  };
}

// In-memory cache with TTL
let cachedPosts: WPPost[] | null = null;
let lastPostsFetch = 0;
const POSTS_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

/**
 * Fetch all published blog posts from kshithija.in WordPress REST API,
 * with automatic fallback to bundled local blogs data.
 */
export async function getAllPosts(): Promise<WPPost[]> {
  if (cachedPosts && Date.now() - lastPostsFetch < POSTS_CACHE_TTL) {
    return cachedPosts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6-second timeout

    const res = await fetch(REST_API_URL, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: WPPost[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedPosts = data;
        lastPostsFetch = Date.now();
        return data;
      }
    }
  } catch (err) {
    // Expected in offline/sandboxed environments
  }

  // Graceful fallback to verified kshithija.in blogs data
  cachedPosts = (localBlogs as unknown as WPPost[]) || [];
  lastPostsFetch = Date.now();
  return cachedPosts;
}

/**
 * Fetch a single blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const all = await getAllPosts();
  const found = all.find((p) => p.slug === slug);
  if (found) return found;

  // Attempt direct API fetch if not found in list
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Get all unique blog categories
 */
export async function getCategories(): Promise<WPTerm[]> {
  const posts = await getAllPosts();
  const catMap = new Map<string, WPTerm>();

  posts.forEach((post) => {
    const cats = getPostCategories(post);
    cats.forEach((c) => {
      if (!catMap.has(c.slug)) {
        catMap.set(c.slug, c);
      }
    });
  });

  return Array.from(catMap.values());
}

// --- HELPER UTILITIES ---

export function getFeaturedImage(post: WPPost): { src: string; alt: string; width?: number; height?: number } {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return {
    src: media?.source_url || FALLBACK_IMAGE,
    alt: media?.alt_text || stripHtml(post.title?.rendered || 'Kshithija Enterprises'),
    width: 800,
    height: 500,
  };
}

export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || 'Kshithija Editorial Team';
}

export function getPostCategories(post: WPPost): WPTerm[] {
  const termGroups = post._embedded?.['wp:term'] || [];
  return termGroups.flat().filter((t) => t.taxonomy === 'category' && t.slug !== 'uncategorized');
}

export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function estimateReadTime(html: string): string {
  if (!html) return '2 min read';
  const words = stripHtml(html).split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Clean and format raw WordPress / Elementor HTML content:
 * - Constrains all unstyled SVGs and toggle icons so they do not expand to fill the screen
 * - Strips any dangerous scripts or broken inline styles
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return '';

  return html
    // Remove embedded <script> tags
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Fix unconstrained SVGs from Elementor toggle/accordion icons
    .replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
      return `<svg ${attrs} width="16" height="16" style="width:16px!important;height:16px!important;max-width:16px!important;max-height:16px!important;display:inline-block!important;vertical-align:middle!important;flex-shrink:0!important;">`;
    });
}
