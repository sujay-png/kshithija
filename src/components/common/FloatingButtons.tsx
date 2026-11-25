'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';

export default function FloatingButtons() {
  const { totalQty, open: openCart } = useCart();
  const [affOpen, setAffOpen] = useState(false);
  const [authState, setAuthState] = useState<{ loggedIn: boolean; isAffiliate: boolean }>({
    loggedIn: false,
    isAffiliate: false,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const token = localStorage.getItem('kshithija_auth_token');
        const raw = localStorage.getItem('kshithija_auth_user');
        const user = raw ? JSON.parse(raw) : null;
        const isAffiliate = Boolean(
          user &&
            (user.isAffiliate === true ||
              user.isAffiliate === '1' ||
              user.isAffiliate === 1 ||
              (Array.isArray(user.roles) && user.roles.includes('affiliate')))
        );
        setAuthState({ loggedIn: Boolean(token), isAffiliate });
      } catch {
        setAuthState({ loggedIn: false, isAffiliate: false });
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);

    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAffOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAffOpen(false);
    };

    document.addEventListener('click', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('storage', syncAuth);
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const joinHref = authState.loggedIn && authState.isAffiliate ? '/affiliate-dashboard' : '/affiliate-registration';
  const joinLabel = authState.loggedIn
    ? authState.isAffiliate
      ? 'Go to Affiliate Dashboard'
      : 'Join now the affiliate program'
    : 'JOIN NOW';

  return (
    <>
      {/* 1. BOTTOM-LEFT: AFFILIATE PROGRAM FLOATING BUTTON */}
      <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-50 font-sans isolate" id="wrnxt-aff-float" ref={wrapperRef}>
        <button
          type="button"
          id="aff-trigger-btn"
          aria-expanded={affOpen}
          aria-controls="wrnxt-aff-float-panel"
          onClick={(e) => {
            e.stopPropagation();
            setAffOpen((prev) => !prev);
          }}
          className="group relative flex items-center gap-2.5 min-h-[50px] sm:min-h-[54px] py-2 pr-4 sm:pr-5 pl-2 rounded-full text-white cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 border border-white/20 select-none"
          style={{ background: 'linear-gradient(135deg, #183e2a 0%, #28633a 58%, #34784a 100%)' }}
        >
          <span
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-xs border border-white/40 shrink-0 text-[#183e2a]"
            style={{ background: 'linear-gradient(145deg, #f5df9c, #d7b35f)' }}
            aria-hidden="true"
          >
            🤝
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">Affiliate Program</span>
        </button>

        {affOpen && (
          <div
            id="wrnxt-aff-float-panel"
            className="absolute left-0 bottom-[64px] sm:bottom-[70px] w-[310px] sm:w-[340px] max-w-[calc(100vw-32px)] p-6 rounded-3xl bg-[#fffdf8] border border-[#28633a]/20 shadow-2xl text-[#242a24] transition-all"
            role="dialog"
            aria-labelledby="aff-modal-title"
          >
            <button
              type="button"
              id="aff-close-btn"
              onClick={() => setAffOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#edf3ed] hover:bg-[#dfeadf] text-[#355640] flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-[#e4d4a5] shadow-xs text-[#183e2a] mb-3"
              style={{ background: 'linear-gradient(145deg, #fff4cf, #e7d08d)' }}
              aria-hidden="true"
            >
              🤝
            </div>

            <h3 id="aff-modal-title" className="text-xl font-serif font-bold text-[#183e2a] leading-tight mb-1.5">
              Become an Affiliate
            </h3>
            <p className="text-xs sm:text-[13px] text-[#626a61] leading-relaxed mb-4">
              Share products you love and earn commission from successful referrals.
            </p>

            <div className="rounded-2xl p-3.5 sm:p-4 mb-4 border-2 border-[#c99f5b]/80 bg-[#fffdf5] shadow-xs text-left">
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#78350f] mb-1.5">
                <span className="text-base leading-none">🎉</span>
                <span>Special referral reward</span>
              </div>
              <p className="text-xs sm:text-[12.5px] text-[#4b5563] leading-relaxed">
                Refer 3 new customers and earn an extra <strong className="text-[#164e2d] font-bold">₹100</strong>. Earn another{' '}
                <strong className="text-[#164e2d] font-bold">₹100</strong> for every additional 3 new customers!
              </p>
            </div>

            {!authState.loggedIn && (
              <ul id="aff-benefits-list" className="space-y-2 mb-5 text-xs sm:text-[13px] text-[#3d4b40] font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#28633a] font-bold">✓</span>
                  <span><strong>5% commission</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#28633a] font-bold">✓</span>
                  <span>Personal customer discount coupon</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#28633a] font-bold">✓</span>
                  <span>Affiliate dashboard</span>
                </li>
              </ul>
            )}

            <div className="space-y-3" id="aff-cta-container">
              <Link
                id="aff-cta-join-btn"
                href={joinHref}
                onClick={() => setAffOpen(false)}
                className="block text-center py-3.5 px-5 rounded-xl text-white text-base sm:text-sm uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer leading-tight"
                style={{ background: 'linear-gradient(135deg, #183e2a, #34784a)' }}
              >
                {joinLabel}
              </Link>
              {(!authState.loggedIn || authState.isAffiliate) && (
                <Link
                  id="aff-cta-login-link"
                  href={authState.isAffiliate ? '/affiliate-dashboard' : '/affiliate-login'}
                  onClick={() => setAffOpen(false)}
                  className="block text-center text-sm sm:text-base font-semibold text-[#28633a] hover:underline transition-all cursor-pointer pt-1"
                >
                  {authState.isAffiliate ? 'View your partner commissions & links' : 'Already registered? Login'}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. BOTTOM-RIGHT: FLOATING CART BASKET */}
      <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
        <div className="relative group">
          <button
            type="button"
            id="open-cart-btn"
            onClick={openCart}
            aria-label="View Shopping Basket"
            className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-[#faf7f2] text-[#082213] border border-[#ded5c5] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 relative cursor-pointer"
          >
            <span
              id="floating-cart-counter"
              className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#082213] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-2xs"
            >
              {totalQty}
            </span>

            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#183e2a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
