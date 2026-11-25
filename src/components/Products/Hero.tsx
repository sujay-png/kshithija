'use client';

import { useEffect, useState } from 'react';
import { productsHeroData } from '@data/products';

const purityStandards = [
  'No Parabens',
  'No Synthetic Preservatives',
  'Lab Tested',
  'No Petroleum Jelly',
  'All Skin Types',
];

export default function ProductsHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = productsHeroData.slides;

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const goTo = (idx: number) => {
    if (idx < 0) setCurrentIndex(slides.length - 1);
    else if (idx >= slides.length) setCurrentIndex(0);
    else setCurrentIndex(idx);
  };

  return (
    <>
      <section
        id="products-hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative w-full h-[520px] sm:h-[560px] lg:h-[600px] overflow-hidden bg-[#eee8dc]"
      >
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (slide.fallbackImage && !target.src.endsWith(slide.fallbackImage)) {
                    target.src = slide.fallbackImage;
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#eee8dc] via-[#eee8dc]/90 via-55% to-[#eee8dc]/20 sm:to-transparent pointer-events-none z-15" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#eee8dc]/70 to-transparent pointer-events-none z-15" />

        <div className="relative z-20 max-w-7xl mx-auto h-full flex items-center px-4 sm:px-8 lg:px-16">
          <div className="w-full max-w-xl text-left">
            <span className="text-xs sm:text-[13px] text-[#485c50] tracking-wide font-normal mb-3 block">
              {productsHeroData.eyebrow}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-serif text-[#082213] tracking-tight leading-[1.14] mb-3.5">
              {productsHeroData.titleLine1}
              <br />
              <span className="font-normal italic text-[#0f341f]">{productsHeroData.titleLine2}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#4d5e52] leading-relaxed max-w-md mb-6 sm:text-[18px]">
              {productsHeroData.description}
            </p>

            <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
              <a
                href={productsHeroData.buttonHref}
                className="inline-flex items-center gap-2 bg-[#0c3920] hover:bg-[#144d2d] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 group"
              >
                <span>{productsHeroData.buttonText}</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-500 text-sm">★</span>
                <span className="font-bold text-[#082213] text-sm">{productsHeroData.ratingScore}</span>
                <span className="text-[#526457] text-[11px] leading-tight">
                  {productsHeroData.ratingLabelLine1}
                  <br />
                  {productsHeroData.ratingLabelLine2}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 sm:right-12 z-25 flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex ? 'w-7 bg-[#0c3920]' : 'w-2 bg-[#768478]/50 hover:bg-[#0c3920]/80'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#082213] backdrop-blur-xs border border-[#ded5c5] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#082213] backdrop-blur-xs border border-[#ded5c5] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      <section className="w-full bg-[#fbf9f4] border-b border-[#e2d8c3] py-5 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-6 items-center justify-items-start sm:justify-items-center">
            {purityStandards.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-[#0c2a1a] group cursor-default">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#eaf4ed] text-[#1c643b] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#1c643b] group-hover:text-white transition-colors duration-200">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    <path d="M12 9c-1.8 1.8-1.8 4.2 0 6 1.8-1.8 1.8-4.2 0-6z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 9v6" />
                  </svg>
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-[#0c2a1a] tracking-tight whitespace-nowrap">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-[#ded5c2] my-4 sm:my-5" />

          <p className="text-xs sm:text-[18px] text-[#425246] leading-relaxed text-left sm:text-justify max-w-6xl mx-auto font-normal">
            Kshithija Enterprises, based in Mangaluru, manufactures 100% natural beauty products crafted from plant-derived ingredients and backed by science. Free from parabens, silicones, mineral oils, and artificial fragrances, our formulations are lab-tested and dermatologist approved. From moisturizing creams to hair growth solutions, each product is designed to nourish skin and hair the natural way. Rooted in India’s botanical heritage and refined through modern research, our beauty range delivers visible, gentle results. Explore our{' '}
            <a href="#catalog" className="text-[#0c3920] font-semibold underline underline-offset-2 hover:text-[#1c643b] transition-colors">
              natural beauty products
            </a>{' '}
            crafted with care in Mangalore.
          </p>
        </div>
      </section>
    </>
  );
}
