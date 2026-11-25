import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  getFeaturedImage,
  getAuthorName,
  getPostCategories,
  formatDate,
  estimateReadTime,
  stripHtml,
  sanitizeBlogContent,
} from '@lib/wordpress';
import { getProducts, type Product } from '@lib/products';
import { getBlogSeo } from '@data/seo';
import { buildMetadata } from '@lib/seo';
import BlogPostClient from '@components/blog/BlogPostClient';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata('/blog');

  const img = getFeaturedImage(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt?.rendered || '');
  const author = getAuthorName(post);

  return buildMetadata(`/blog/${slug}`, getBlogSeo({
    slug: post.slug,
    title,
    excerpt,
    image: img.src,
    date: post.date,
    author,
  }));
}

function pickSidebarProducts(products: Product[], text: string): Product[] {
  const inStock = products.filter((p) => p.inStock !== false && p.badge !== 'Sold Out');
  const scored = inStock.map((prod) => {
    let score = 0;
    const pid = prod.id.toLowerCase();
    const pname = prod.name.toLowerCase();

    if (text.includes('hair') || text.includes('dandruff') || text.includes('scalp')) {
      if (pid.includes('grow-hair') || pid.includes('anti-dandruff') || pname.includes('hair')) score += 20;
    }
    if (
      text.includes('skin') ||
      text.includes('moistur') ||
      text.includes('cream') ||
      text.includes('dry skin') ||
      text.includes('aloe') ||
      text.includes('face') ||
      text.includes('tan')
    ) {
      if (pid.includes('vishaka') || pid.includes('aloe') || pid.includes('vasel') || pname.includes('cream')) score += 20;
    }
    if (
      text.includes('energy') ||
      text.includes('sugar') ||
      text.includes('supplement') ||
      text.includes('wellness') ||
      text.includes('health') ||
      text.includes('honey')
    ) {
      if (pid.includes('chaithanya') || pid.includes('honey')) score += 20;
    }
    if (prod.featured) score += 3;
    if (prod.onSale) score += 2;
    return { prod, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, 4).map((s) => s.prod);
  return picked.length >= 3 ? picked : inStock.slice(0, 4);
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts, allProducts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
    getProducts(),
  ]);

  if (!post) notFound();

  const date = formatDate(post.date);
  const read = estimateReadTime(post.content?.rendered || post.excerpt?.rendered || '');
  const cats = getPostCategories(post);
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt?.rendered || '');

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const fullText = `${title} ${excerpt} ${post.content?.rendered || ''}`.toLowerCase();
  const sidebarProducts = pickSidebarProducts(allProducts, fullText);

  return (
    <>
      <BlogPostClient />

      <header className="w-full bg-white pt-8 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-[#5a6e61]">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
              <li className="text-[#98a89e]">/</li>
              <li><Link href="/blog" className="hover:text-[#0c3920] transition-colors">Blog</Link></li>
              <li className="text-[#98a89e]">/</li>
              <li className="font-semibold text-[#082213] truncate max-w-xs sm:max-w-md" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 text-xs text-[#5a6e61] mb-4 flex-wrap">
            {cats.map((c) => (
              <span
                key={c.slug}
                className="inline-block px-3 py-1 rounded-full bg-[#eaf4ed] text-[#1c643b] text-xs font-semibold tracking-wider uppercase"
              >
                {c.name}
              </span>
            ))}
            <span>Published on {date}</span>
            <span>·</span>
            <span>{read}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif font-bold text-[#082213] leading-tight tracking-tight mb-6">
            {title}
          </h1>
        </div>
      </header>

      <article className="w-full bg-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#e8dfcf] shadow-xs">
              <div
                className="blog-content prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#082213] prose-p:text-[#384a3e] prose-p:leading-relaxed prose-a:text-[#164e2d] prose-a:underline hover:prose-a:text-[#082213] prose-img:rounded-2xl prose-img:shadow-sm text-sm sm:text-base leading-relaxed space-y-5"
                dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(post.content.rendered) }}
              />
            </main>

            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
              <div className="space-y-3.5">
                {sidebarProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-[#ded5c5] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="flex gap-3.5 items-start mb-3">
                      <Link
                        href={`/product/${prod.id}`}
                        className="block w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#faf7f2] border border-[#e8dfcf] shrink-0 relative group-hover:border-[#1c643b] transition-colors"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        {prod.badge && (
                          <span className="absolute top-1 left-1 bg-[#858012] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs uppercase">
                            {prod.badge}
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#1c643b] uppercase tracking-wider block mb-0.5">
                          {prod.category || 'Ayurvedic Care'}
                        </span>
                        <Link href={`/product/${prod.id}`} className="block">
                          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug line-clamp-2">
                            {prod.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-sm font-bold text-[#082213] font-sans">{prod.price}</span>
                          {prod.originalPrice && prod.onSale && (
                            <span className="text-xs text-gray-400 line-through">{prod.originalPrice}</span>
                          )}
                          {prod.size && (
                            <span className="text-[10px] bg-[#f4ede0] text-[#55695b] px-1.5 py-0.5 rounded font-medium">
                              {prod.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#f0eae0] flex items-center gap-2">
                      <button
                        type="button"
                        data-buy-now
                        data-product-id={prod.id}
                        data-product-name={prod.name}
                        data-product-price={prod.price}
                        data-product-image={prod.image}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#0c3920] hover:bg-[#15502e] active:scale-98 text-white text-xs font-bold tracking-wide uppercase shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>⚡</span>
                        <span className="btn-label">Buy Now</span>
                      </button>

                      <button
                        type="button"
                        data-add-to-cart
                        data-product-id={prod.id}
                        data-product-name={prod.name}
                        data-product-price={prod.price}
                        data-product-image={prod.image}
                        className="p-2 rounded-xl bg-[#f4ede0] hover:bg-[#eae0cf] text-[#082213] border border-[#ded5c5] transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>

                      <Link
                        href={`/product/${prod.id}`}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-[#faf7f2] text-[#082213] border border-[#ded5c5] text-xs font-semibold transition-colors text-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#ded5c5] text-xs text-[#3e5044] space-y-2 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0c3920] block mb-1">
                  Why Choose Kshithija
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#1c643b] font-bold">✓</span>
                  <span>100% Pure Botanical Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1c643b] font-bold">✓</span>
                  <span>Direct Dispatch from Mangaluru</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1c643b] font-bold">✓</span>
                  <span>Online Payment &amp; COD Available</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="w-full bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#e8dfcf]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c643b] block mb-1">
                  Further Reading
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#082213]">
                  Related Skincare &amp; Herbal Guides
                </h2>
              </div>
              <Link href="/blog" className="text-xs sm:text-sm font-semibold text-[#0c3920] hover:underline">
                View All Blogs →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((rel) => {
                const relImg = getFeaturedImage(rel);
                const relDate = formatDate(rel.date);
                const relRead = estimateReadTime(rel.content?.rendered || rel.excerpt?.rendered || '');
                const relTitle = stripHtml(rel.title.rendered);
                const relExcerpt = stripHtml(rel.excerpt.rendered);

                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#e8dfcf] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#faf7f2]">
                        <img
                          src={relImg.src}
                          alt={relImg.alt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="text-[11px] text-[#6d7e73] mb-2">
                          <span>{relDate} · {relRead}</span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug line-clamp-2 mb-2">
                          {relTitle}
                        </h3>
                        <p className="text-xs text-[#526357] leading-relaxed line-clamp-2">{relExcerpt}</p>
                      </div>
                    </div>
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs font-bold text-[#164e2d] group-hover:underline">
                      Read Article →
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
