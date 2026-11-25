'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface BeautyHeroProps {
  eyebrow?: string;
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  description?: string;
  shopNowText?: string;
  shopNowHref?: string;
  contactText?: string;
  contactHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function BeautyHero({
  eyebrow = 'Kshithija Enterprises',
  titleLine1 = 'Lab Tested, 100%',
  titleHighlight = 'Natural',
  titleLine2 = 'Personal Care',
  description = 'Formulated without petroleum jelly, parabens, or synthetic preservatives every product is rigorously tested and crafted to be gentle on all skin types, including sensitive skin.',
  shopNowText = 'Shop Now',
  shopNowHref = '#catalog',
  contactText = 'Contact Us',
  contactHref = '/contact-us',
  imageSrc = '/beauty-hero-aloe-hd.png',
  imageAlt = 'Pure Aloe Vera natural personal care and skincare formulation with fresh aloe leaves',
}: BeautyHeroProps) {
  const [imgSrc, setImgSrc] = useState(imageSrc);

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f9f6ee] via-[#f4ede0] to-[#eee5d3] overflow-hidden border-b border-[#e5dec9]">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2ea843]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#a3cf54]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f2ea] text-[#1c643b] text-xs font-semibold tracking-wider uppercase mb-3.5 border border-[#cbe4d1]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ea843] animate-pulse" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-serif text-[#082213] tracking-tight leading-[1.14] mb-4">
              {titleLine1}
              <br />
              <span className="italic font-normal text-[#1e6b3e]">{titleHighlight}</span> {titleLine2}
            </h1>

            <p className="text-xs sm:text-[20px] text-[#4d5e52] leading-relaxed max-w-xl mb-7 sm:mb-8 font-normal">
              {description}
            </p>

            <div className="flex items-center gap-3.5 sm:gap-5 flex-wrap">
              <a
                href={shopNowHref}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#082213] hover:bg-[#124225] active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-xl group"
              >
                <span>{shopNowText}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <Link
                href={contactHref}
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-full border border-[#082213]/30 hover:border-[#082213] text-[#082213] hover:bg-[#082213]/5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200"
              >
                {contactText}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none group">
              <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/60 border border-[#e8dfcf]/80 backdrop-blur-xs">
                <img
                  src={imgSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-cover object-center max-h-[360px] sm:max-h-[420px] group-hover:scale-102 transition-transform duration-700"
                  onError={() => {
                    if (imgSrc !== '/beauty-hero-aloe.png') setImgSrc('/beauty-hero-aloe.png');
                  }}
                />
              </div>

              <div className="absolute -bottom-3 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md border border-[#e2d8c3] rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#eaf4ed] text-[#1c643b] flex items-center justify-center text-sm font-bold shadow-2xs">
                  🌿
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-bold text-[#082213] block leading-tight">100% Botanical Care</span>
                  <span className="text-[10px] text-[#55695b] leading-tight">Zero Parabens &amp; Silicones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
