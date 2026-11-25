import { testimonialsData } from '@data/testimonials';

export default function Testimonials() {
  const { eyebrow, title, titleItalic, testimonials } = testimonialsData;

  return (
    <section className="relative w-full bg-[#fbf9f4] py-8 sm:py-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaf4ed] text-[#1c643b] text-xs font-semibold tracking-widest uppercase mb-3">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] text-[#0d2a1b] font-serif font-medium leading-[1.2] tracking-tight">
            {title} <span className="italic font-normal text-[#1e6b3e] block sm:inline">{titleItalic}.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <span>{'★'.repeat(item.rating)}</span>
                  </div>
                  <svg className="w-6 h-6 text-[#1c643b]/20 group-hover:text-[#1c643b]/40 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <h3 className="font-serif font-semibold text-base sm:text-lg text-[#0d2a1b] group-hover:text-[#1c643b] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4a5e52] leading-relaxed italic mb-4">&ldquo;{item.quote}&rdquo;</p>
              </div>

              <div className="pt-3.5 border-t border-[#f0eae0] flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                >
                  {item.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-xs sm:text-sm text-[#0d2a1b] truncate">{item.name}</h4>
                    {item.verified && (
                      <span className="inline-flex items-center text-[#1c643b] text-[10px]" title="Verified Customer">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#2c6e45] truncate">
                    {item.role} · {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
