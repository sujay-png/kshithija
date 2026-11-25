'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart, parsePrice } from '@components/common/CartContext';

const WP_BASE = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in').replace(/\/+$/, '');
const HEADLESS_SECRET =
  process.env.NEXT_PUBLIC_HEADLESS_VERIFY_SECRET ||
  '19827fe00484d444da19911adf8110ec30dc2d4e51cfe55f47a22c02d8d18d71';
const CHECKOUT_API = `${WP_BASE}/wp-json/headless/v1/checkout`;

export default function CartPageClient() {
  const { items, totalQty, subtotal, updateQty, removeItem } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [applying, setApplying] = useState(false);

  const applyCoupon = async (overrideCode?: string) => {
    const code = (overrideCode ?? couponInput).trim().toUpperCase();
    if (!code) return;

    setApplying(true);
    try {
      const payloadItems = items.map((i) => ({
        id: i.id,
        slug: i.slug || (typeof i.id === 'string' ? i.id : ''),
        quantity: i.quantity,
      }));

      const res = await fetch(`${CHECKOUT_API}/apply-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Headless-Secret': HEADLESS_SECRET,
        },
        body: JSON.stringify({ code, items: payloadItems, subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDiscountAmount(Number(data.discount_amount) || 0);
        setAppliedCouponName(`${data.code} (${data.description || 'Discount Applied'})`);
        setCouponInput(data.code || code);
        sessionStorage.setItem('kshithija_applied_coupon', data.code || code);
        setCouponFeedback({
          ok: true,
          msg: `✓ ${data.message || 'Coupon applied successfully!'} (${data.description || ''})`,
        });
      } else {
        setDiscountAmount(0);
        setAppliedCouponName('');
        sessionStorage.removeItem('kshithija_applied_coupon');
        setCouponFeedback({ ok: false, msg: data.message || 'Invalid coupon code.' });
      }
    } catch {
      setDiscountAmount(0);
      setAppliedCouponName('');
      sessionStorage.removeItem('kshithija_applied_coupon');
      setCouponFeedback({ ok: false, msg: 'Unable to apply coupon. Please check your connection.' });
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('kshithija_applied_coupon');
    if (saved && items.length > 0) {
      setCouponInput(saved);
      applyCoupon(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCouponName('');
    setCouponInput('');
    setCouponFeedback(null);
    sessionStorage.removeItem('kshithija_applied_coupon');
  };

  const grandTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#0a1c12] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[#607065]">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-[#0f3822] transition-colors">Home</Link></li>
            <li className="text-[#b5c0b9]">/</li>
            <li><Link href="/products" className="hover:text-[#0f3822] transition-colors">Products</Link></li>
            <li className="text-[#b5c0b9]">/</li>
            <li className="text-[#0a1c12] font-semibold">Shopping Cart</li>
          </ol>
        </nav>

        <header className="mb-8 pb-5 border-b border-[#e2dcd2] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold tracking-tight text-[#0a1c12]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#607065]">
            {items.length === 0 ? '0 items' : `${totalQty} item${totalQty === 1 ? '' : 's'} in your cart`}
          </p>
        </header>

        {items.length === 0 ? (
          <section className="py-16 sm:py-24 text-center max-w-lg mx-auto bg-white rounded-2xl border border-[#e2dcd2] p-8 sm:p-12 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-[#f4ede0] text-[#0f3822] flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 fill-none stroke-current stroke-1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#0a1c12] mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-[#607065] mb-8 leading-relaxed max-w-sm mx-auto">
              Explore our collection of authentic, chemical-free botanical skincare and Ayurvedic wellness formulations.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#0f3822] hover:bg-[#184f32] active:scale-98 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
            >
              Return to Shop &rarr;
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl border border-[#e2dcd2] shadow-2xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2dcd2] bg-[#f9f7f2] text-[11px] font-semibold uppercase tracking-wider text-[#607065]">
                      <th className="py-3.5 pl-6 pr-4">Product</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 text-center">Quantity</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 pr-6 pl-4 text-center w-12"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece6dc]">
                    {items.map((item) => {
                      const unitPrice = item.priceNum || parsePrice(item.price);
                      const lineTotal = unitPrice * item.quantity;
                      return (
                        <tr key={String(item.id)} className="hover:bg-[#faf9f6] transition-colors">
                          <td className="py-4 pl-6 pr-4">
                            <div className="flex items-center gap-3.5">
                              <Link
                                href={`/product/${item.id}`}
                                className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#e2dcd2] block"
                              >
                                <img
                                  src={item.image || '/products/placeholder.webp'}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                              <div>
                                <Link
                                  href={`/product/${item.id}`}
                                  className="text-xs sm:text-sm font-semibold text-[#0a1c12] hover:text-[#1c643b] transition-colors leading-snug line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                <span className="text-[11px] text-[#7d8d82] mt-0.5 block">100% Herbal formulation</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-[#0a1c12] whitespace-nowrap">{item.price}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center border border-[#d5cec3] rounded-lg bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, -1)}
                                className="px-2.5 py-1 text-xs font-bold text-[#0a1c12] hover:bg-[#f4ede0] transition-colors cursor-pointer select-none"
                              >
                                −
                              </button>
                              <span className="px-3 text-xs font-semibold text-[#0a1c12] min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, 1)}
                                className="px-2.5 py-1 text-xs font-bold text-[#0a1c12] hover:bg-[#f4ede0] transition-colors cursor-pointer select-none"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right text-xs sm:text-sm font-semibold text-[#0a1c12] whitespace-nowrap font-serif">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 pr-6 pl-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 rounded-full text-[#7d8d82] hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-base font-bold transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {items.map((item) => {
                  const unitPrice = item.priceNum || parsePrice(item.price);
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <div
                      key={String(item.id)}
                      className="bg-white rounded-2xl p-4 border border-[#e2dcd2] shadow-2xs flex gap-3.5 items-start"
                    >
                      <Link
                        href={`/product/${item.id}`}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#e2dcd2] shrink-0 block"
                      >
                        <img
                          src={item.image || '/products/placeholder.webp'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/product/${item.id}`} className="text-xs font-semibold text-[#0a1c12] truncate block">
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[#7d8d82] hover:text-red-600 text-lg leading-none cursor-pointer p-0.5"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </div>
                        <p className="text-xs font-bold text-[#1c643b] mt-0.5">{item.price}</p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4ede0]">
                          <div className="inline-flex items-center border border-[#d5cec3] rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="px-2 py-0.5 text-xs font-bold text-[#0a1c12]"
                            >
                              −
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#0a1c12]">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="px-2 py-0.5 text-xs font-bold text-[#0a1c12]"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-serif font-bold text-[#0a1c12]">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon & Continue */}
              <div className="bg-white rounded-2xl p-5 border border-[#e2dcd2] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyCoupon();
                      }
                    }}
                    placeholder="Coupon code"
                    className="flex-1 sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-[#d5cec3] bg-[#faf8f4] text-[#0a1c12] uppercase font-medium focus:outline-none focus:ring-1 focus:ring-[#0f3822] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    disabled={applying}
                    onClick={() => applyCoupon()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0f3822] hover:bg-[#184f32] active:scale-95 text-white transition-colors cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {applying ? 'Applying...' : 'Apply'}
                  </button>
                </div>

                <Link
                  href="/products"
                  className="text-xs font-semibold text-[#0f3822] hover:text-[#1c643b] underline underline-offset-2 transition-colors text-center sm:text-right"
                >
                  &larr; Continue Shopping
                </Link>
              </div>

              {couponFeedback && (
                <div className={`text-xs px-2 font-medium ${couponFeedback.ok ? 'text-[#1c643b]' : 'text-red-600'}`}>
                  {couponFeedback.msg}
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <aside className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2dcd2] shadow-2xs space-y-5 sticky top-24">
                <h2 className="text-lg font-serif font-semibold text-[#0a1c12] pb-4 border-b border-[#e2dcd2]">
                  Cart Totals
                </h2>

                <div className="space-y-3.5 text-xs text-[#506155]">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#0a1c12] text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-[#f0eae0] space-y-1">
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className="font-semibold text-[#1c643b]">Free Shipping</span>
                    </div>
                    <p className="text-[11px] text-[#7d8d82]">Door delivery to Karnataka &amp; across India.</p>
                  </div>

                  {discountAmount > 0 && (
                    <div className="pt-3 border-t border-[#f0eae0] flex justify-between items-center text-[#1c643b]">
                      <div className="flex items-center gap-1.5">
                        <span>Discount ({appliedCouponName})</span>
                        <button type="button" onClick={removeCoupon} className="text-[11px] text-red-600 hover:underline">
                          [Remove]
                        </button>
                      </div>
                      <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#d8d2c7] flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#0a1c12]">Total</span>
                    <span className="text-2xl font-serif font-bold text-[#0a1c12]">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0f3822] hover:bg-[#184f32] active:scale-98 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md text-center cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
