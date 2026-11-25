import Link from 'next/link';

export interface CareersHeroProps {
  title?: string;
  tagline?: string;
  subtitle?: string;
  bgImage?: string;
}

export default function CareersHero({
  title = 'Career',
  tagline = 'The Easiest Way to Get Your New Job',
  subtitle = 'Start Your Journey With Us · Kshithija Enterprises, Mangaluru',
  bgImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
}: CareersHeroProps) {
  return (
    <section className="relative w-full h-60 sm:h-72 md:h-84 lg:h-96 overflow-hidden flex items-center justify-center bg-[#071911]">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Kshithija Enterprises Careers"
          className="w-full h-full object-cover object-center grayscale contrast-110 brightness-75 scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071911]/85 via-[#0a2317]/75 to-[#071911]/90 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] text-[#c0d6c7] bg-black/30 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/10">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[#729c80]">/</li>
            <li className="font-semibold text-white tracking-wide" aria-current="page">
              Career
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight drop-shadow-md mb-2">
          {title}
        </h1>

        <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-[#a3cf54] uppercase mb-1">
          {tagline}
        </span>

        <p className="text-xs sm:text-sm text-[#d4e4da] max-w-md mx-auto font-normal leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}
