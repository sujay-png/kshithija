// src/types/product.ts
// Product & Catalog Types

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface CatalogCategory {
  id: string;
  name: string;
  count: string;
  active?: boolean;
}

export interface Product {
  id: string;
  databaseId?: number;
  name: string;
  slug?: string;
  price: string;
  regularPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  category?: string;
  categories?: ProductCategory[];
  tag?: string;
  image: string;
  galleryImages?: string[];
  description?: string;
  shortDescription?: string;
  details?: string;
  benefits?: string[];
  ingredients?: string;
  howToUse?: string;
  inStock?: boolean;
}
