import Link from 'next/link';
import { getFeaturedProduct, getGridProducts } from '@lib/products';
import InteractiveHoverButton from '@components/ui/InteractiveHoverButton';

export default async function Products() {
  const featuredProduct = await getFeaturedProduct();
  const gridProducts = await getGridProducts();

  return (
    <section className="relative w-full bg-[#fbf9f4] py-8 sm:py-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf4ed] text-[#1c643b] text-xs font-semibold tracking-widest uppercase mb-2">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>Our Affordable Skin Care Products</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#0d2a1b] font-serif font-medium leading-[1.15] tracking-tight">
              Formulations for <span className="italic font-normal text-[#1e6b3e]">every concern.</span>
            </h2>
          </div>

          <InteractiveHoverButton href="/products" text="Explore More" className="self-start md:self-end" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* FEATURED HERO PRODUCT */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#e8e2d4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-[#0c4028] text-white text-[11px] font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs">
                  ★ Best Seller
                </span>
                <span className="text-xs font-medium text-[#1c643b] bg-[#eaf4ed] px-2.5 py-0.5 rounded-full">
                  {featuredProduct.category}
                </span>
              </div>

              <Link
                href={`/product/${featuredProduct.id}`}
                className="block relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-[#f4f1ea] mb-3.5 cursor-pointer"
              >
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </Link>

              <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-1.5">
                <span>★★★★★</span>
                <span className="text-gray-500 font-medium">
                  ({featuredProduct.rating} · {featuredProduct.reviewsCount} reviews)
                </span>
              </div>

              <Link href={`/product/${featuredProduct.id}`} className="block">
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#0d2a1b] leading-snug group-hover:text-[#1c643b] transition-colors">
                  {featuredProduct.name}
                </h3>
              </Link>
              <p className="text-xs font-semibold tracking-wider text-[#1e6b3e] uppercase mt-0.5 mb-2">
                {featuredProduct.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#4a5e52] leading-relaxed mb-2.5">{featuredProduct.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {featuredProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium bg-[#f5f8f5] text-[#24613b] border border-[#d6e5d8] px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#f0eae0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-500 uppercase font-medium block">Price</span>
                <span className="text-xl font-bold text-[#0d2a1b]">{featuredProduct.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${featuredProduct.id}`}
                  className="inline-flex items-center gap-1.5 bg-[#f4ede0] hover:bg-[#eae0cf] text-[#082213] border border-[#ded5c5] text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full transition-all hover:shadow-xs"
                >
                  <span>View Details</span>
                  <span>→</span>
                </Link>
                {featuredProduct.inStock !== false && featuredProduct.badge !== 'Sold Out' && (
                  <button
                    type="button"
                    data-add-to-cart
                    data-product-id={featuredProduct.id}
                    data-product-name={featuredProduct.name}
                    data-product-price={featuredProduct.price}
                    data-product-image={featuredProduct.image}
                    className="inline-flex items-center gap-1.5 bg-[#0c4028] hover:bg-[#072a1a] active:scale-95 text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="btn-label">Add to cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4 COMPLEMENTARY PRODUCTS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {gridProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e8e2d4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link
                    href={`/product/${item.id}`}
                    className="block relative w-full h-38 sm:h-40 rounded-2xl overflow-hidden bg-[#f4f1ea] mb-2.5 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[#0c4028] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border border-white/40 shadow-xs">
                      {item.category}
                    </span>
                    {(item.inStock === false || item.badge === 'Sold Out') && (
                      <span className="absolute top-2 right-2 bg-rose-700 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Sold Out
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-1">
                    <span>★★★★★</span>
                    <span className="text-gray-400 font-medium">({item.reviewsCount})</span>
                  </div>

                  <Link href={`/product/${item.id}`} className="block">
                    <h4 className="text-sm sm:text-base font-serif font-semibold text-[#0d2a1b] leading-snug group-hover:text-[#1c643b] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </Link>
                  <p className="text-[10px] font-medium text-[#1e6b3e] tracking-wide mt-0.5 mb-1.5">{item.subtitle}</p>
                  <p className="text-xs text-[#4a5e52] leading-relaxed line-clamp-2 mb-2.5">{item.description}</p>
                </div>

                <div className="pt-2.5 border-t border-[#f0eae0] flex items-center justify-between gap-2 mt-1">
                  <span className="text-sm sm:text-base font-bold text-[#0d2a1b] shrink-0">{item.price}</span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/product/${item.id}`}
                      className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full bg-[#f4ede0] hover:bg-[#eae0cf] text-[#082213] border border-[#ded5c5] text-[11px] font-semibold tracking-wider uppercase transition-all hover:shadow-xs"
                    >
                      <span>Details</span>
                    </Link>
                    {item.inStock !== false && item.badge !== 'Sold Out' && (
                      <button
                        type="button"
                        data-add-to-cart
                        data-product-id={item.id}
                        data-product-name={item.name}
                        data-product-price={item.price}
                        data-product-image={item.image}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-[#0c4028] hover:bg-[#072a1a] active:scale-95 text-white text-[11px] font-semibold tracking-wider uppercase shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="btn-label">Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
