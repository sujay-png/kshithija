import { targetedCareData } from '@data/targetedCare';

export default function TargatedCare() {
  const { eyebrow, title, titleHighlight, description, concerns } = targetedCareData;

  return (
    <section className="relative w-full bg-[#082213] py-10 sm:py-14 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#164e2e]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#133521] border border-[#215736] text-[#4ade80] text-xs font-semibold tracking-widest uppercase mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-medium text-white leading-[1.15] tracking-tight mb-3.5">
              {title} <span className="italic font-normal text-[#4ade80]">{titleHighlight}</span>
            </h2>

            <p className="text-sm sm:text-base text-[#d0ded6] leading-relaxed mb-6 font-normal">{description}</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {concerns.map((item) => (
                <div
                  key={item.name}
                  className="bg-white/95 hover:bg-white text-[#0a2015] rounded-2xl p-4 sm:p-5 border border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#edf5f0] group-hover:bg-[#082213] text-[#1c643b] group-hover:text-[#4ade80] flex items-center justify-center transition-all duration-300 shadow-2xs mb-2.5">
                    {item.iconType === 'acne' && (
                      <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M7.5 7.5l9 9M16.5 7.5l-9 9" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                      </svg>
                    )}
                    {item.iconType === 'dandruff' && (
                      <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 18c2-2 4-2 6 0s4 2 6 0 4-2 4-2M6 8a6 6 0 0 1 12 0c0 4-6 9-6 9s-6-5-6-9z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h.01M15 13h.01M12 10h.01" />
                      </svg>
                    )}
                    {item.iconType === 'dryness' && (
                      <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 0 0 4 4" />
                      </svg>
                    )}
                    {item.iconType === 'aging' && (
                      <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 0 1-8 0M12 3a9 9 0 1 0 9 9M9 9h.01M15 9h.01" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 4v3m0 0v3m0-3h3m-3 0h-3" />
                      </svg>
                    )}
                    {item.iconType === 'inflammation' && (
                      <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                  </div>

                  <h3 className="font-serif font-semibold text-base sm:text-lg text-[#0a2015] group-hover:text-[#1c643b] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#4a6b57] leading-tight mt-1 line-clamp-1">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
