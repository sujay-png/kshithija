'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  isAuthenticated,
  getStoredUser,
  getAffiliateCoupon,
  getAffiliateOrders,
  saveAffiliateCoupon,
  type AffiliateOrderRecord,
  type AffiliateOrderSummary,
  type AuthUser,
} from '@lib/auth';

function deriveNameNumberCode(u: AuthUser | null, uname: string): string {
  let code = '';
  if (
    u?.coupon?.code &&
    !u.coupon.code.startsWith('KSHI-') &&
    !u.coupon.code.startsWith('PARTNER') &&
    !u.coupon.code.startsWith('AFFILIATE')
  ) {
    code = u.coupon.code.toUpperCase();
  } else {
    const cleanFullName = `${u?.firstName || ''}${u?.lastName || ''}`.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const cleanUsername = (uname || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    code = cleanFullName || cleanUsername || 'AFFILIATE';
  }
  return /\d+$/.test(code) ? code : `${code}101`;
}

export default function AffiliateDashboardClient() {
  const [status, setStatus] = useState<'loading' | 'guest' | 'ready'>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [refUrl, setRefUrl] = useState('https://kshithija.in/?ref=partner');
  const [couponCode, setCouponCode] = useState('PARTNER101');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [summary, setSummary] = useState<AffiliateOrderSummary | null>(null);
  const [orders, setOrders] = useState<AffiliateOrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    const u = getStoredUser();
    if (!loggedIn || !u) {
      setStatus('guest');
      return;
    }

    setUser(u);
    const uname = u.username || u.email?.split('@')[0] || 'partner';
    const domain = window.location.origin || 'https://kshithija.in';
    setRefUrl(`${domain}/?ref=${encodeURIComponent(uname)}`);
    const initialCode = deriveNameNumberCode(u, uname);
    setCouponCode(initialCode);
    setStatus('ready');

    (async () => {
      try {
        const coupon = await getAffiliateCoupon();
        if (coupon?.code) {
          let code = coupon.code.toUpperCase();
          const isPlaceholder = code.startsWith('PARTNER') || code.startsWith('KSHI-') || code.startsWith('AFFILIATE');
          if (!/\d+$/.test(code)) {
            code = `${code}101`;
            try {
              await saveAffiliateCoupon(code);
            } catch {}
          } else if (isPlaceholder && initialCode !== code) {
            code = initialCode;
            try {
              await saveAffiliateCoupon(code);
            } catch {}
          }
          setCouponCode(code);
        }
      } catch {}
    })();

    (async () => {
      try {
        const data = await getAffiliateOrders();
        if (data?.success) {
          setSummary(data.summary);
          setOrders(data.orders || []);
        }
      } catch {
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, []);

  const copyText = (text: string, type: 'link' | 'coupon') => {
    navigator.clipboard.writeText(text).catch(() => {});
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const username = user?.username || user?.email?.split('@')[0] || 'partner';
  const displayName = user?.displayName || user?.firstName || username;
  const initials = ((user?.firstName?.[0] || username[0] || 'A') + (user?.lastName?.[0] || '')).toUpperCase();

  return (
    <main className="min-h-screen bg-[#fcfaf6] text-[#082213] relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2ea843]/6 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#c99f5b]/8 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-between">
          <ol className="inline-flex items-center gap-2 text-xs text-[#5a6e61] bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#ded5c5] shadow-2xs">
            <li><Link href="/" className="hover:text-[#164e2d] transition-colors">Home</Link></li>
            <li className="text-[#a4b5aa]">/</li>
            <li><Link href="/affiliate-registration" className="hover:text-[#164e2d] transition-colors">Affiliate Program</Link></li>
            <li className="text-[#a4b5aa]">/</li>
            <li className="font-semibold text-[#082213] tracking-wide" aria-current="page">Partner Dashboard</li>
          </ol>
        </nav>

        {status === 'loading' && (
          <div className="bg-white rounded-3xl border border-[#ded5c5] p-12 text-center text-[#5a6e61] shadow-sm my-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#164e2d] border-t-transparent mb-4" />
            <h3 className="text-base font-serif font-bold text-[#082213]">Loading Affiliate Control Center...</h3>
            <p className="text-xs text-[#5a6e61] mt-1">Connecting to Kshithija partner authentication system</p>
          </div>
        )}

        {status === 'guest' && (
          <div className="bg-white rounded-3xl border border-[#ded5c5] p-8 sm:p-12 text-center shadow-sm my-8 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#eaf4ed] text-[#164e2d] border border-[#c2dfcb] flex items-center justify-center text-2xl shadow-xs">
              🔒
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082213] mb-2">
              Affiliate Partner Sign In Required
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6e61] max-w-sm mx-auto mb-6 leading-relaxed">
              Please log in with your Kshithija partner credentials to view your live commissions, referral links, and payouts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/affiliate-login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Go to Affiliate Login</span>
                <span>→</span>
              </Link>
              <Link
                href="/affiliate-registration"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#faf8f4] hover:bg-[#f0eae0] text-[#082213] text-xs font-semibold border border-[#ded5c5] transition-all cursor-pointer"
              >
                <span>Become an Affiliate</span>
              </Link>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-[#071a10] via-[#0c2a1a] to-[#143d26] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#235837] shadow-xl overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1c5535] to-[#082213] border-2 border-[#a3cf54]/50 text-white flex items-center justify-center font-serif font-bold text-xl sm:text-2xl shadow-lg shadow-black/30">
                      <span>{initials || 'KA'}</span>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2ea843] border-2 border-[#071a10] rounded-full flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight truncate">
                      Welcome back, {displayName}!
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#9ebaa7] mt-1">
                      <span>
                        Username: <strong className="text-white">@{username}</strong>
                      </span>
                      <span>•</span>
                      <span className="hidden sm:inline text-[#9ebaa7]">{user?.email || 'partner@kshithija.in'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyText(refUrl, 'link')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2ea843] to-[#208332] hover:from-[#35be4d] hover:to-[#26973a] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{copiedLink ? 'Copied! ✓' : 'Copy Referral Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#ded5c5] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a6e61]">Total Orders</span>
                  <div className="w-9 h-9 rounded-xl bg-[#eaf4ed] text-[#164e2d] flex items-center justify-center text-base">🛍️</div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#082213] tracking-tight mb-1.5">
                  {summary?.totalOrders ?? 0} Orders
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a6e61]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Orders placed with your coupon</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#ded5c5] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a6e61]">Total Sales</span>
                  <div className="w-9 h-9 rounded-xl bg-[#f0f4ff] text-[#2563eb] flex items-center justify-center text-base">📈</div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#082213] tracking-tight mb-1.5">
                  {summary?.totalSalesFormatted || '₹0'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a6e61]">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Gross sales value generated</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#ded5c5] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a6e61]">Sales Rewards Earned</span>
                  <div className="w-9 h-9 rounded-xl bg-[#eaf4ed] text-[#164e2d] flex items-center justify-center text-base">💰</div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 tracking-tight mb-1.5">
                  {summary?.salesRewardsEarnedFormatted || '₹0'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a6e61]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>10% reward on completed orders</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#ded5c5] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5a6e61]">Pending Sales Rewards</span>
                  <div className="w-9 h-9 rounded-xl bg-[#fef7ea] text-[#b45309] flex items-center justify-center text-base">⏳</div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 tracking-tight mb-1.5">
                  {summary?.pendingSalesRewardsFormatted || '₹0'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a6e61]">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Processing / awaiting delivery</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#ded5c5] shadow-sm">
                <div className="relative mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082213] mb-1.5">
                    Generated Affiliate URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      readOnly
                      value={refUrl}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#f4ede0]/50 border border-[#ded5c5] text-xs sm:text-sm font-mono text-[#082213] select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyText(refUrl, 'link')}
                      className="px-5 py-3 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>{copiedLink ? 'Copied! ✓' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-gradient-to-br from-[#faf7f0] to-[#f4ede0] rounded-3xl p-6 sm:p-7 border-2 border-dashed border-[#c99f5b] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#926c27] bg-[#fbf5e6] px-2.5 py-1 rounded-full border border-[#e8d2a6]">
                      Exclusive Follower Discount
                    </span>
                    <span className="text-xl">🏷️</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#082213] mb-1">
                    Your Personal Coupon Code
                  </h3>

                  <div className="bg-white rounded-2xl p-4 border border-[#e2d5be] shadow-xs flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#7c9082] block tracking-widest">Active Coupon</span>
                      <span className="text-lg sm:text-xl font-mono font-bold text-[#164e2d] tracking-wider truncate block">
                        {couponCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(couponCode, 'coupon')}
                      className="px-5 py-2.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-95 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      <span>{copiedCoupon ? 'Copied! ✓' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded5c5] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#f0eae0]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082213] tracking-tight">Recent Orders</h2>
                  <p className="text-xs text-[#5a6e61] mt-0.5">Live orders placed by customers using your partner coupon code</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf4ed] text-[#164e2d] border border-[#c4e1cc]">
                  {ordersLoading ? 'Syncing with store...' : `${orders.length} Orders`}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#ded5c5] text-[#5a6e61] uppercase tracking-wider font-semibold text-[11px]">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Order Ref</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Products Purchased</th>
                      <th className="py-3 px-3">Order Total</th>
                      <th className="py-3 px-3">Your Commission</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eae0] text-[#082213]">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-[#5a6e61]">
                          Loading orders from WordPress store...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 px-4 text-center text-[#5a6e61]">
                          No orders placed yet with your coupon code.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 px-3">{o.dateFormatted}</td>
                          <td className="py-3 px-3 font-bold">#{o.orderNumber}</td>
                          <td className="py-3 px-3">{o.customer}</td>
                          <td className="py-3 px-3">{o.itemsSummary}</td>
                          <td className="py-3 px-3 font-semibold">{o.totalFormatted}</td>
                          <td className="py-3 px-3 font-bold text-[#164e2d]">{o.commissionFormatted}</td>
                          <td className="py-3 px-3 text-right">{o.statusLabel}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
