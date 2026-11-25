import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@lib/products';
import { getProductSeo } from '@data/seo';
import { buildMetadata } from '@lib/seo';
import ProductDetailClient from '@components/Products/ProductDetailClient';

export async function generateStaticParams() {
  const products = await getProducts();
  const params: Array<{ id: string }> = [];
  for (const p of products) {
    params.push({ id: p.id });
    if (p.aliasIds) {
      for (const alias of p.aliasIds) {
        params.push({ id: alias });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return buildMetadata('/products');
  return buildMetadata(`/product/${product.id}`, getProductSeo(product));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([getProductById(id), getProducts()]);
  if (!product) notFound();

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.catalogCategory === product.catalogCategory || p.featured))
    .slice(0, 4);

  const isGrowHair =
    product.id.includes('grow-hair') ||
    product.id.includes('anti-dandruff') ||
    product.name.toLowerCase().includes('grow hair');

  const currentGrowHairSize: '30g' | '70g' =
    product.id.includes('30-g') || product.name.includes('30 g') || product.size === '30 g' ? '30g' : '70g';

  const prod30 = allProducts.find(
    (p) => p.id === 'grow-hair-30-g' || p.aliasIds?.includes('grow-hair-30-g') || p.name.includes('30 g')
  );
  const prod70 = allProducts.find(
    (p) =>
      p.id === 'best-anti-dandruff-hair-cream' ||
      p.aliasIds?.includes('best-anti-dandruff-hair-cream') ||
      p.id.includes('anti-dandruff') ||
      p.name.includes('70 g')
  );

  const variant30 = {
    size: '30 g',
    rawSize: '30g' as const,
    price: prod30 ? prod30.price : '₹369.00',
    name: prod30 ? prod30.name : 'Grow Hair-100% Natural Anti-Dandruff Hair Cream (30 g)',
    id: prod30 ? prod30.id : 'grow-hair-30-g',
    image: prod30?.image || product.image,
    url: '/product/grow-hair-30-g',
  };

  const variant70 = {
    size: '70 g',
    rawSize: '70g' as const,
    price: prod70 ? prod70.price : '₹699.00',
    name: prod70
      ? prod70.name.includes('Grow Hair')
        ? prod70.name
        : 'Grow Hair-100% Natural Anti-Dandruff Hair Cream (70 g)'
      : 'Grow Hair-100% Natural Anti-Dandruff Hair Cream (70 g)',
    id: prod70 ? prod70.id : 'best-anti-dandruff-hair-cream',
    image: prod70?.image || product.image,
    url: '/product/best-anti-dandruff-hair-cream',
  };

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      isGrowHair={isGrowHair}
      initialGrowHairSize={currentGrowHairSize}
      variant30={variant30}
      variant70={variant70}
    />
  );
}
