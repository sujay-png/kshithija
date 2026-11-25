import Link from 'next/link';
import { getAllPosts, getFeaturedImage, formatDate, stripHtml } from '@lib/wordpress';

export default async function JournalSection() {
  const allPosts = await getAllPosts();
  const gridPosts = allPosts.slice(0, 4);

  const widePost1 =
    allPosts.find((p) => p.slug === 'prevent-face-tanning-mangalore' || p.slug === 'all-day-smart-cream-benefits') ||
    allPosts[4] ||
    allPosts[0];

  const widePost2 =
    allPosts.find((p) => p.slug === 'benefits-of-plant-based-personal-care-products' || p.slug.includes('botanical')) ||
    allPosts[5] ||
    allPosts[1];

  const widePosts = [widePost1, widePost2].filter(Boolean);

  return (
    <section className="relative w-full bg-[#fbf9f4] py-14 sm:py-20 px-4 sm:px-8 lg:px-16 border-t border-[#e8dfcf] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <span className="text-xs font-serif tracking-[0.25em] text-[#1c643b] uppercase font-semibold block mb-2">
            From The Journal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-medium text-[#082213] tracking-tight leading-[1.2]">
            Natural skin care products, understood
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-[#5a6e61] tracking-[0.18em] uppercase mt-1">
            From the inside out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 2x2 Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {gridPosts.map((post) => {
                const img = getFeaturedImage(post);
                const title = stripHtml(post.title?.rendered || 'Kshithija Natural Care');
                const dateStr = formatDate(post.date);

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-[#ded5c5] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eee8db]">
                      <img
                        src={img.src}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-xs bg-[#c26d36] text-white text-[10px] font-bold tracking-widest uppercase shadow-xs">
                        Blog
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors line-clamp-2 leading-snug mb-3">
                        {title}
                      </h3>
                      <div className="text-[11px] text-[#708076] font-medium flex items-center gap-1.5 pt-2 border-t border-[#f4ede0]">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>No Comments</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none border border-[#082213] text-[#082213] hover:bg-[#082213] hover:text-white transition-all text-xs font-serif font-semibold tracking-wider uppercase group shadow-2xs"
              >
                <span>All Articles</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 2 Stacked Wide Cards */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            {widePosts.map((post) => {
              const img = getFeaturedImage(post);
              const title = stripHtml(post.title?.rendered || 'Kshithija Natural Care');
              const dateStr = formatDate(post.date);

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-[#ded5c5] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/8] sm:aspect-[2/1] w-full overflow-hidden bg-[#eee8db]">
                    <img
                      src={img.src}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-xs bg-[#c26d36] text-white text-[10px] font-bold tracking-widest uppercase shadow-xs">
                      Blog
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#082213] group-hover:text-[#1c643b] transition-colors leading-snug mb-2">
                      {title}
                    </h3>
                    <div className="text-[11px] text-[#708076] font-medium flex items-center gap-1.5 pt-2 border-t border-[#f4ede0]">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>No Comments</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
