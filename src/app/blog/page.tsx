import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllPosts,
  getFeaturedImage,
  getAuthorName,
  formatDate,
  estimateReadTime,
  stripHtml,
} from '@lib/wordpress';
import { buildMetadata } from '@lib/seo';

export const metadata: Metadata = buildMetadata('/blog');

export default async function BlogIndexPage() {
  const allPosts = await getAllPosts();

  const posts = allPosts.map((p) => {
    const title = (p.title?.rendered || '').toLowerCase();
    const excerpt = (p.excerpt?.rendered || '').toLowerCase();
    let topic = 'skincare';
    let topicLabel = 'Skincare & Barrier';

    if (title.includes('hair') || title.includes('scalp') || excerpt.includes('hair') || excerpt.includes('scalp')) {
      topic = 'haircare';
      topicLabel = 'Hair & Scalp';
    } else if (
      title.includes('energy') ||
      title.includes('supplement') ||
      title.includes('health') ||
      title.includes('wellness') ||
      title.includes('plant-based')
    ) {
      topic = 'wellness';
      topicLabel = 'Wellness & Energy';
    } else if (title.includes('tan') || title.includes('sun') || title.includes('uv') || excerpt.includes('tanning')) {
      topic = 'suncare';
      topicLabel = 'Sun & Coastal Care';
    }

    return { ...p, topic, topicLabel };
  });

  const heroPost = posts[0];
  const trendingPosts = posts.slice(1, 3);

  return (
    <>
      <section className="relative w-full bg-white pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 opacity-5 pointer-events-none select-none text-[#082213]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="inline-flex items-center justify-center gap-2 text-xs text-[#5a6e61]">
              <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
              <li className="text-[#a4b5aa]">/</li>
              <li className="font-semibold text-[#082213] tracking-wide" aria-current="page">Journal</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="relative w-full bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf]">
        <div className="max-w-7xl mx-auto">
          <div id="featured-bento-section" className="mb-14 sm:mb-18">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1c643b] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c643b]">
                  Editor&apos;s Essential Selection
                </span>
              </div>
              <span className="text-xs text-[#6e8074]">Updated Daily from Mangaluru</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {heroPost && (() => {
                const hImg = getFeaturedImage(heroPost);
                const hDate = formatDate(heroPost.date);
                const hRead = estimateReadTime(heroPost.content?.rendered || heroPost.excerpt?.rendered || '');
                const hAuthor = getAuthorName(heroPost);
                const hTitle = stripHtml(heroPost.title.rendered);
                const hExcerpt = stripHtml(heroPost.excerpt.rendered);

                return (
                  <article className="lg:col-span-7 bg-white rounded-[28px] overflow-hidden border border-[#e8dfcf] shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group">
                    <Link
                      href={`/blog/${heroPost.slug}`}
                      className="block relative w-full aspect-[16/10] overflow-hidden bg-[#faf7f2] cursor-pointer"
                    >
                      <img
                        src={hImg.src}
                        alt={hImg.alt}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-[#082213] text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full shadow-md">
                          ★ Featured Story
                        </span>
                        <span className="bg-white/95 backdrop-blur-xs text-[#1c643b] text-[11px] font-bold tracking-wide px-3 py-1 rounded-full shadow-xs border border-white/40">
                          {heroPost.topicLabel}
                        </span>
                      </div>
                      <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                        ⏱ {hRead}
                      </span>
                    </Link>

                    <div className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-[#5a6e61] mb-2.5">
                          <span>📅 {hDate}</span>
                          <span>·</span>
                          <span>By {hAuthor}</span>
                        </div>

                        <Link href={`/blog/${heroPost.slug}`} className="block">
                          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug tracking-tight mb-3">
                            {hTitle}
                          </h2>
                        </Link>

                        <p className="text-xs sm:text-sm text-[#4d5e52] leading-relaxed line-clamp-3 mb-6 font-normal">
                          {hExcerpt}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-[#f0eae0] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1c643b]/10 text-[#1c643b] flex items-center justify-center text-xs font-bold font-serif">
                            KE
                          </div>
                          <span className="text-xs text-[#384a3e] font-medium">Kshithija Research Team</span>
                        </div>

                        <Link
                          href={`/blog/${heroPost.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164e2d] hover:text-[#082213] transition-colors group-hover:translate-x-1 duration-200"
                        >
                          <span>Read Story</span>
                          <span className="text-sm">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })()}

              <div className="lg:col-span-5 flex flex-col gap-6">
                {trendingPosts.map((trend, idx) => {
                  const tImg = getFeaturedImage(trend);
                  const tDate = formatDate(trend.date);
                  const tRead = estimateReadTime(trend.content?.rendered || trend.excerpt?.rendered || '');
                  const tTitle = stripHtml(trend.title.rendered);
                  const tExcerpt = stripHtml(trend.excerpt.rendered);

                  return (
                    <article
                      key={trend.slug}
                      className="bg-white rounded-[24px] overflow-hidden border border-[#e8dfcf] p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between flex-1 group hover:-translate-y-1"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-3">
                          <Link
                            href={`/blog/${trend.slug}`}
                            className="block shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#faf7f2] relative cursor-pointer"
                          >
                            <img
                              src={tImg.src}
                              alt={tImg.alt}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1c643b] mb-1">
                              #{idx + 1} Trending Guide
                            </span>
                            <div className="text-[11px] text-[#6d7e73] mb-1">
                              {tDate} · {tRead}
                            </div>
                            <Link href={`/blog/${trend.slug}`} className="block">
                              <h3 className="text-sm sm:text-base font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug line-clamp-2">
                                {tTitle}
                              </h3>
                            </Link>
                          </div>
                        </div>

                        <p className="text-xs text-[#526357] leading-relaxed line-clamp-2 mb-2 font-normal">
                          {tExcerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#f0eae0] flex items-center justify-between">
                        <span className="text-[11px] text-[#708477]">Recommended Read</span>
                        <Link
                          href={`/blog/${trend.slug}`}
                          className="text-xs font-bold text-[#164e2d] hover:text-[#082213] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Read Guide</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c643b] block mb-1">
                  Curated Knowledge Base
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#082213]">
                  All Skincare &amp; Formulation Guides
                </h2>
              </div>
              <div className="text-xs font-semibold text-[#5a6e61] bg-white border border-[#ded5c5] px-3.5 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
                Showing all {posts.length} articles
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {posts.map((post) => {
                const img = getFeaturedImage(post);
                const date = formatDate(post.date);
                const read = estimateReadTime(post.content?.rendered || post.excerpt?.rendered || '');
                const title = stripHtml(post.title.rendered);
                const excerpt = stripHtml(post.excerpt.rendered);
                const shareUrl = encodeURIComponent(`https://kshithija.in/blog/${post.slug}`);
                const waShare = `https://wa.me/?text=${encodeURIComponent(`Check out this guide: ${title}`)}%20${shareUrl}`;

                return (
                  <article
                    key={post.slug}
                    className="bg-white rounded-[26px] overflow-hidden border border-[#e8dfcf] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
                  >
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block relative w-full aspect-[16/10] overflow-hidden bg-[#faf7f2] cursor-pointer"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#082213] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-black/5 shadow-2xs">
                          {post.topicLabel}
                        </span>
                        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                          ⏱ {read}
                        </span>
                      </Link>

                      <div className="p-5 sm:p-6">
                        <div className="text-[11px] text-[#6d7e73] mb-2 font-medium">
                          <span>{date}</span>
                        </div>

                        <Link href={`/blog/${post.slug}`} className="block">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug line-clamp-2 min-h-[48px] mb-2.5">
                            {title}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#526357] leading-relaxed line-clamp-3 font-normal">{excerpt}</p>
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-[#f0eae0] flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164e2d] hover:text-[#082213] transition-colors group-hover:translate-x-0.5"
                      >
                        <span>Read Article</span>
                        <span className="text-sm">→</span>
                      </Link>

                      <a
                        href={waShare}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share via WhatsApp"
                        className="w-7 h-7 rounded-full bg-[#f4ede0] hover:bg-[#e8dfcf] text-[#164e2d] flex items-center justify-center text-xs transition-colors"
                        aria-label={`Share ${title} on WhatsApp`}
                      >
                        💬
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
