import Link from 'next/link';
import { ctaData } from '@data/cta';

export default function Cta() {
  return (
    <section
      id="cta-contact"
      className="relative w-full bg-[#071d12] bg-cover bg-center bg-no-repeat py-10 sm:py-14 px-4 sm:px-8 lg:px-16 overflow-hidden my-4"
      style={{ backgroundImage: "url('https://kshithija.in/wp-content/uploads/2026/08/admin-ajax-11.webp')" }}
    >
      <div className="absolute inset-0 bg-[#071d12]/85 sm:bg-[#071d12]/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="text-left w-full lg:max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163a27] text-[#4ade80] text-xs font-semibold tracking-widest uppercase mb-3 border border-[#215736]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            {ctaData.eyebrow}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-white tracking-tight leading-snug mb-2">
            {ctaData.title}
          </h2>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {ctaData.contacts.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-[#071d12]/90 border border-[#215736] text-[#4ade80] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    {item.type === 'email' && (
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {item.type === 'phone' && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.37-.68.25-1.02A11.36 11.36 0 0 1 8.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z" />
                      </svg>
                    )}
                    {item.type === 'address' && (
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <circle cx="12" cy="11" r="3" strokeWidth="2" />
                      </svg>
                    )}
                    {item.type === 'hours' && (
                      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                      </svg>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed pt-0.5">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.isExternal ? '_blank' : undefined}
                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                        className="hover:text-[#4ade80] hover:underline transition-colors block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-5 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={ctaData.actionButtons.call.href}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#071d12] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transition-all duration-200 group"
            >
              <svg className="w-4 h-4 fill-current text-[#1c643b] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.37-.68.25-1.02A11.36 11.36 0 0 1 8.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z" />
              </svg>
              <span>{ctaData.actionButtons.call.text}</span>
            </a>

            <Link
              href={ctaData.actionButtons.contactUs.href}
              className="inline-flex items-center gap-2 bg-[#1c643b] hover:bg-[#237c49] text-white border border-[#34a867]/40 font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transition-all duration-200 group"
            >
              <span>{ctaData.actionButtons.contactUs.text}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 sm:p-5 w-full sm:w-auto">
            <span className="block text-xs font-bold tracking-widest text-[#4ade80] uppercase mb-3">
              {ctaData.socialEyebrow}
            </span>

            <div className="flex items-center gap-2.5">
              {ctaData.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    social.id === 'facebook'
                      ? 'bg-[#3b5998] hover:bg-[#324d85]'
                      : social.id === 'youtube'
                      ? 'bg-[#cd201f] hover:bg-[#b51b1a]'
                      : social.id === 'instagram'
                      ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90'
                      : 'bg-[#0077b5] hover:bg-[#00669c]'
                  }`}
                >
                  {social.id === 'facebook' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {social.id === 'youtube' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )}
                  {social.id === 'instagram' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {social.id === 'linkedin' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
