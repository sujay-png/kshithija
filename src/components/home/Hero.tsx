import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] bg-[#041a0d] overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#031409] via-[#04190c]/90 via-40% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full py-10 lg:py-16">
        <div className="max-w-xl text-left">
          <div className="mb-3 inline-block">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-md" viewBox="0 0 64 64" fill="none">
              <path d="M14 40C14 20 28 8 46 10C46 28 32 42 14 40Z" fill="#84cc16" />
              <path d="M20 48C20 28 36 16 54 20C52 40 36 50 20 48Z" fill="#15803d" />
              <path d="M20 48C30 38 42 30 54 20" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white font-normal leading-[1.2] drop-shadow-lg tracking-wide"
            style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
          >
            Mangaluru, Plant-Derived, Lab-Tested Skincare
          </h1>

          <div className="h-[1.5px] w-full max-w-md bg-gradient-to-r from-[#22c55e] via-white/40 to-transparent my-3.5 sm:my-4" />

          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-200 font-medium leading-relaxed">
            &ldquo; Formulated in Mangaluru. Free from parabens, silicones, and synthetic shortcuts. &rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 bg-[#0a7a3b] hover:bg-[#086330] text-white text-xs font-semibold tracking-wider uppercase px-5 sm:px-6 py-3 rounded-xl shadow-lg transition-all duration-200 group active:scale-95"
            >
              <span>Explore Products</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 bg-transparent hover:bg-white/10 text-white border border-white/80 hover:border-white text-xs font-semibold tracking-wider uppercase px-5 sm:px-6 py-3 rounded-xl backdrop-blur-xs transition-all duration-200 group active:scale-95"
            >
              <span>Order Now</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
