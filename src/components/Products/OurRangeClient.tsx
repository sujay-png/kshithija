'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@lib/products';

interface OurRangeClientProps {
  products: Product[];
  activeCategory: 'all' | 'beauty' | 'wellness';
  sectionTitle: string;
  heading: string;
  showTabs: boolean;
  strictCategory: boolean;
  showGuarantees: boolean;
}

const guarantees = [
  {
    title: 'Lab Tested',
    description: 'Our Natural personal care products are verified for purity and efficacy.',
  },
  {
    title: '100% Natural',
    description: 'No petroleum jelly, parabens, or synthetic preservatives',
  },
  {
    title: 'All Skin Types',
    description: 'Gentle formulas crafted for even sensitive skin',
  },
  {
    title: 'Chemical-Free',
    description: 'Kshithija Natural personal care products are harsh additives',
  },
];

const categories: Array<{ id: 'all' | 'beauty' | 'wellness'; label: string }> = [
  { id: 'all', label: 'ALL PRODUCTS' },
  { id: 'beauty', label: 'BEAUTY' },
  { id: 'wellness', label: 'WELLNESS' },
];

export default function OurRangeClient({
  products,
  activeCategory,
  sectionTitle,
  heading,
  showTabs,
  strictCategory,
  showGuarantees,
}: OurRangeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beauty' | 'wellness'>(activeCategory);

  const visibleProducts = strictCategory
    ? products
    : selectedCategory === 'all'
    ? products
    : products.filter((p) => p.catalogCategory === selectedCategory);

  return (
    <section
      id="catalog"
      className="relative w-full bg-[#fbf9f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-[#e8dfcf] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 sm:mb-6 text-left">
          <span className="text-xs sm:text-[13px] font-semibold text-[#1c643b] tracking-wider uppercase block mb-1">
            {sectionTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-medium text-[#082213] tracking-tight">
            {heading}
          </h2>
        </div>

        {showGuarantees && (
          <div className="bg-[#f4ede0] border border-[#e5dec9] rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
              {guarantees.map((item) => (
                <div key={item.title} className="flex flex-col items-start text-left">
                  <div className="mb-3 text-[#1c643b]">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      <path d="M12 9c-1.8 1.8-1.8 4.2 0 6 1.8-1.8 1.8-4.2 0-6z" fill="currentColor" fillOpacity="0.22" />
                      <path d="M12 9v6" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-[#082213] mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[16px] text-[#4d5e52] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTabs && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 flex-wrap" role="tablist">
            {categories.map((cat) => {
              const isActive = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer rounded-xs select-none ${
                    isActive
                      ? 'bg-[#082213] text-white shadow-xs'
                      : 'bg-[#eee8db] text-[#33463a] hover:bg-[#e2dac9] hover:text-[#082213]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        <div id="products-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              data-product-card
              data-catalog-category={product.catalogCategory}
              className="product-card group relative flex flex-col items-center text-center bg-white rounded-2xl p-4 sm:p-5 border border-[#e8dfcf] shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Link
                href={`/product/${product.id}`}
                className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#faf7f2] mb-3.5 flex items-center justify-center cursor-pointer block"
                aria-label={`View ${product.name} details`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (product.fallbackImage && !target.src.endsWith(product.fallbackImage)) {
                      target.src = product.fallbackImage;
                    }
                  }}
                />

                {!product.inStock || product.badge === 'Sold Out' ? (
                  <div
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-rose-700 text-white text-[10px] font-bold shadow-md tracking-tight select-none pointer-events-none uppercase"
                    aria-label="Sold Out"
                  >
                    Sold Out
                  </div>
                ) : product.onSale || product.badge === 'Sale!' ? (
                  <div
                    className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full bg-[#858012] text-white text-[11px] font-bold flex items-center justify-center shadow-md transform rotate-[-4deg] tracking-tight select-none pointer-events-none"
                    aria-label="On Sale"
                  >
                    Sale!
                  </div>
                ) : null}
              </Link>

              <Link href={`/product/${product.id}`} className="block w-full">
                <h3 className="text-xs sm:text-[13.5px] font-semibold text-[#0c2a1a] leading-snug line-clamp-2 min-h-[38px] flex items-center justify-center mb-2 px-1 hover:text-[#1c643b] transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-center gap-2 mb-3.5">
                {product.originalPrice && product.onSale ? (
                  <>
                    <span className="text-xs sm:text-[13px] text-gray-500 line-through font-normal">
                      {product.originalPrice}
                    </span>
                    <span className="text-xs sm:text-[14px] font-bold text-[#0c2a1a] underline underline-offset-2">
                      {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-xs sm:text-[14px] font-semibold text-[#0c2a1a]">{product.price}</span>
                )}
              </div>

              <div className="mt-auto w-full pt-2 flex items-center gap-1.5">
                {!product.inStock || product.badge === 'Sold Out' ? (
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#f4ede0] hover:bg-[#eae0cf] text-[#0c2a1a] border border-[#ded5c5] text-xs font-semibold tracking-tight transition-all text-center cursor-pointer hover:shadow-xs"
                  >
                    <span>View Details (Sold Out)</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 min-w-0 inline-flex items-center justify-center px-2 py-2 rounded-lg bg-[#f4ede0] hover:bg-[#eae0cf] text-[#0c2a1a] border border-[#ded5c5] text-[11px] sm:text-xs font-semibold tracking-tight transition-all text-center whitespace-nowrap cursor-pointer hover:shadow-xs"
                    >
                      <span>View Details</span>
                    </Link>

                    <button
                      type="button"
                      data-add-to-cart
                      data-product-id={product.id}
                      data-product-name={product.name}
                      data-product-price={product.price}
                      data-product-image={product.image}
                      className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#164e2d] hover:bg-[#0c3920] active:scale-95 text-white text-[11px] sm:text-xs font-semibold tracking-tight transition-all shadow-xs hover:shadow-md cursor-pointer text-center whitespace-nowrap"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="btn-label">Add to cart</span>
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
