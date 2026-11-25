'use client';

import { useState } from 'react';

export interface BeautyPhilosophyProps {
  bgImage?: string;
  cardImage?: string;
  turmericImage?: string;
}

const exclusions = [
  'No petroleum jelly',
  'No parabens',
  'No artificial fragrance',
  'No synthetic preservatives',
];

export default function BeautyPhilosophy({
  bgImage = 'https://kshithija.in/wp-content/uploads/2026/07/turmeric-extract-768x403.webp',
  cardImage = 'https://kshithija.in/wp-content/uploads/2026/07/turmeric-extract-768x403.webp',
  turmericImage = '/philosophy-turmeric.jpg',
}: BeautyPhilosophyProps) {
  const [expanded, setExpanded] = useState(false);
  const [bgSrc, setBgSrc] = useState(bgImage);
  const [cardSrc, setCardSrc] = useState(cardImage);

  return (
    <section className="relative w-full overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#181816] scroll-mt-20" id="philosophy">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgSrc}
          alt="Turmeric Extract Botanical Therapy Background"
          className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105"
          onError={() => {
            if (bgSrc !== '/philosophy-turmeric.jpg') setBgSrc('/philosophy-turmeric.jpg');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/85 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-[#1b1b19] overflow-hidden group">
              <img
                src={cardSrc}
                alt="Ayurvedic Shirodhara Natural Therapy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={() => {
                  if (cardSrc !== '/philosophy-turmeric.jpg') setCardSrc('/philosophy-turmeric.jpg');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-[#082213]/85 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm border border-white/10">
                Ancient Wisdom · Modern Science
              </div>
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-left bg-white">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#1c643b] block mb-1.5">
                  Our Philosophy
                </span>

                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#082213] tracking-tight leading-[1.2] mb-3.5">
                  Formulated with care, <br className="hidden sm:inline" />
                  <span className="italic font-normal text-[#1e6b3e]">backed by science</span>
                </h2>

                <div className="space-y-2.5 text-xs sm:text-[18px] text-[#4d5e52] leading-relaxed font-normal">
                  <p>
                    <strong className="font-semibold text-[#082213]">Kshithija Enterprises</strong>, based in Mangalore, is a trusted manufacturer of natural personal care products crafted to support everyday health, skin, and hair wellness. Every formulation begins with a botanical intention and is refined through rigorous lab testing, ensuring you get skincare and wellness solutions that are both safe and effective.
                  </p>
                  <p>
                    Our range of natural personal care products is completely free from petroleum jelly, mineral oils, parabens, artificial fragrances, silicones, and synthetic preservatives. Instead, we rely on plant-derived ingredients rooted in India’s rich tradition of herbal wellness, combined with modern clinical validation to deliver results you can trust.
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#f0eae0] grid grid-cols-2 gap-2 text-xs font-semibold text-[#082213]">
                  {exclusions.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1c643b]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {expanded && (
                  <div className="mt-4 pt-4 border-t border-[#f0eae0] space-y-3 text-xs sm:text-[13px] text-[#4d5e52] leading-relaxed transition-all">
                    <p>
                      From deeply hydrating moisturizing creams and gentle hair growth formulations to healing skin creams and pure natural honey for immunity, our products are designed to address real concerns like dryness, acne, dandruff, aging, and inflammation without harsh chemicals or synthetic shortcuts.
                    </p>

                    <div className="my-3 rounded-xl overflow-hidden border border-[#e8dfcf] shadow-xs">
                      <img
                        src={turmericImage}
                        alt="Pure Stone-Ground Turmeric & Ayurvedic Botanicals"
                        className="w-full h-36 sm:h-44 object-cover object-center"
                      />
                    </div>

                    <p>
                      As a dermatologist-approved and 100% natural personal care brand, Kshithija Enterprises is committed to purity, transparency, and genuine skin and wellness benefits for every customer.
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#2e4034] bg-[#fbf9f4] p-3 rounded-lg border border-[#e8dfcf]">
                      Explore our full range at <span className="font-bold text-[#082213]">kshithija.in</span>, or connect with us on Instagram, Facebook, and LinkedIn. For inquiries, reach us at{' '}
                      <a href="tel:9482126493" className="underline text-[#1c643b] font-semibold">
                        9482126493
                      </a>{' '}
                      or{' '}
                      <a href="mailto:kshithijamlr@gmail.com" className="underline text-[#1c643b]">
                        kshithijamlr@gmail.com
                      </a>
                      . Visit our Mangaluru store today.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-[#222222] hover:bg-[#082213] active:scale-95 text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer rounded-xs"
                >
                  {expanded ? 'SHOW LESS' : 'READ MORE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
