'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../common/CartContext';

export default function Header() {
  const { totalQty, open: openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ displayName: string; email?: string } | null>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        const userRaw = localStorage.getItem('kshithija_auth_user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          const displayName = user.firstName || user.displayName || user.username || 'Account';
          setUserInfo({ displayName, email: user.email });
        } else {
          setUserInfo(null);
        }
      } catch {
        setUserInfo(null);
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#071911] shadow-md transition-all">
      <div className="flex items-stretch w-full min-h-[64px] sm:min-h-[70px] bg-white">
        {/* Left: Dark Slanted Brand Section */}
        <div className="relative bg-[#071911] text-white flex items-center pl-4 sm:pl-6 pr-6 sm:pr-12 shrink-0 lg:[clip-path:polygon(0_0,calc(100%-35px)_0,100%_100%,0_100%)]">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#0d2a1d] text-white relative shadow-inner overflow-hidden shrink-0">
              <img
                src="/images/logo.webp"
                alt="Kshithija Enterprises Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-tight text-[#2ea843] leading-none group-hover:text-[#38c452] transition-colors">
                Kshithija
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-white/90 leading-tight mt-0.5">
                Enterprises
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Navbar Body */}
        <div className="flex items-center justify-end lg:justify-between flex-1 px-3 sm:px-6 lg:px-8 gap-3 sm:gap-4">
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-5 xl:space-x-7 list-none m-0 p-0 text-[14px] font-medium text-gray-700 whitespace-nowrap">
              <li><Link href="/" className="hover:text-[#0a7a3b] transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-[#0a7a3b] transition-colors">Products</Link></li>
              <li><Link href="/beauty" className="hover:text-[#0a7a3b] transition-colors">Beauty Products</Link></li>
              <li><Link href="/wellness" className="hover:text-[#0a7a3b] transition-colors">Wellness Products</Link></li>
              <li><Link href="/blog" className="hover:text-[#0a7a3b] transition-colors">Blogs</Link></li>
              <li><Link href="/career" className="hover:text-[#0a7a3b] transition-colors">Career</Link></li>
              <li><Link href="/contact-us" className="hover:text-[#0a7a3b] transition-colors">Contact-Us</Link></li>
            </ul>
          </nav>

          {/* Action Items & Mobile Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              id="header-cart-btn"
              onClick={openCart}
              aria-label="Open Shopping Basket"
              className="relative p-2 rounded-xl text-gray-700 hover:text-[#0a7a3b] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
            >
              <svg className="w-5 h-5 sm:w-5 sm:h-5 text-[#0d2a1d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalQty > 0 && (
                <span
                  id="header-cart-counter"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1c643b] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                >
                  {totalQty > 99 ? '99+' : totalQty}
                </span>
              )}
            </button>

            <Link
              href={userInfo ? '/my-account' : '/login'}
              id="header-auth-link"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#0a7a3b] text-xs sm:text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-1 rounded-full bg-gray-100 group-hover:bg-[#0a7a3b] group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="hidden sm:inline" id="header-auth-label">
                {userInfo ? userInfo.displayName : 'Login'}
              </span>
            </Link>

            <button
              type="button"
              id="mobile-menu-toggle-btn"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-[#0a7a3b] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
            >
              {!mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          id="mobile-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Slide-out Drawer */}
      <div
        id="mobile-nav-drawer"
        className={`fixed top-[64px] sm:top-[70px] right-0 bottom-0 w-[290px] sm:w-[340px] max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden flex flex-col justify-between overflow-y-auto border-l border-[#e8dfcf] transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-label="Mobile Navigation"
      >
        <div className="p-5 space-y-6">
          <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-[#e8dfcf] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1c643b] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                👤
              </div>
              <div>
                <span className="text-xs font-bold text-[#082213] block">
                  {userInfo ? userInfo.displayName : 'Welcome Guest'}
                </span>
                <span className="text-[11px] text-[#607065] block">
                  {userInfo ? userInfo.email || 'Verified Customer' : 'Natural Ayurvedic Care'}
                </span>
              </div>
            </div>
            <Link
              href={userInfo ? '/my-account' : '/login'}
              onClick={() => setMobileOpen(false)}
              className="text-xs font-semibold text-[#1c643b] hover:underline"
            >
              {userInfo ? 'Dashboard →' : 'Sign In →'}
            </Link>
          </div>

          <nav>
            <ul className="space-y-1 text-sm font-semibold text-[#082213]">
              {[
                { href: '/', icon: '🏠', label: 'Home' },
                { href: '/products', icon: '🧴', label: 'All Products' },
                { href: '/beauty', icon: '✨', label: 'Beauty Products' },
                { href: '/wellness', icon: '🌿', label: 'Wellness Products' },
                { href: '/blog', icon: '📖', label: 'Blogs & Guides' },
                { href: '/career', icon: '💼', label: 'Career' },
                { href: '/contact-us', icon: '📞', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#eaf4ed] hover:text-[#1c643b] transition-colors"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-4 border-t border-[#f0eae0] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80] px-3 block mb-1">
              Account &amp; Orders
            </span>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#082213] hover:bg-[#faf7f2] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>📦</span>
                <span>My Orders &amp; Delivery</span>
              </span>
              <span className="text-gray-400">&rarr;</span>
            </Link>
            <Link
              href="/affiliate-registration"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#082213] hover:bg-[#faf7f2] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>🤝</span>
                <span>Affiliate Program</span>
              </span>
              <span className="text-gray-400">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="p-5 border-t border-[#f0eae0] bg-[#faf8f5] space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#55695b]">
            <span>Need assistance?</span>
            <a href="tel:9482126493" className="font-bold text-[#1c643b] hover:underline">
              📞 +91 9482126493
            </a>
          </div>
          <a
            href="https://wa.me/919482126493?text=Hi%20Kshithija%2C%20I%20have%20an%20inquiry%20regarding%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>💬</span>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
