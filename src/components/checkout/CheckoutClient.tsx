'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { COUNTRIES } from '@data/countries';
import { useCart, parsePrice } from '@components/common/CartContext';

const WP_BASE = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in').replace(/\/+$/, '');
const HEADLESS_SECRET =
  process.env.NEXT_PUBLIC_HEADLESS_VERIFY_SECRET ||
  '19827fe00484d444da19911adf8110ec30dc2d4e51cfe55f47a22c02d8d18d71';
const CHECKOUT_API = `${WP_BASE}/wp-json/headless/v1/checkout`;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void;
    };
  }
}

const STATES = [
  'Karnataka',
  'Kerala',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Goa',
  'Delhi NCR',
  'Gujarat',
  'Rajasthan',
  'Other',
];

export default function CheckoutClient() {
  const { items, subtotal, clear } = useCart();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [country, setCountry] = useState('IN');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateVal, setStateVal] = useState('Karnataka');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'whatsapp'>('razorpay');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placingLabel, setPlacingLabel] = useState('');
  const [successOrder, setSuccessOrder] = useState<{
    orderRef: string;
    total: number;
    paymentLabel: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kshithija_auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u.email) setEmail(u.email);
        if (u.firstName) setFname(u.firstName);
        if (u.lastName) setLname(u.lastName);
      }
    } catch {}
  }, []);

  const applyCoupon = async (overrideCode?: string) => {
    const code = (overrideCode ?? couponInput).trim().toUpperCase();
    if (!code) return;
    setCheckingCoupon(true);

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
      if (data.success) {
        const resolvedCode = data.code || code;
        const couponAmountNum = Number(data.coupon_amount || 0);
        const isPercent100 = data.discount_type === 'percent' && couponAmountNum >= 100;
        const isFixedCoverAll =
          Number(data.discount_amount || 0) >= subtotal ||
          (data.new_total !== undefined && Number(data.new_total) === 0);
        const is100Percent = subtotal > 0 && (isPercent100 || isFixedCoverAll);

        setAppliedCoupon(resolvedCode);
        setCouponInput(resolvedCode);
        setDiscountAmount(is100Percent ? subtotal : Number(data.discount_amount || 0));
        sessionStorage.setItem('kshithija_applied_coupon', resolvedCode);
        setCouponMsg({
          ok: true,
          text: is100Percent
            ? `✓ Coupon "${resolvedCode}" applied! (100% Off - ₹${subtotal.toLocaleString('en-IN')} saved) (Free Order)`
            : `✓ ${data.message} (${data.description || 'Discount Applied'})`,
        });
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        sessionStorage.removeItem('kshithija_applied_coupon');
        setCouponMsg({ ok: false, text: data.message || 'Invalid coupon code.' });
      }
    } catch {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      sessionStorage.removeItem('kshithija_applied_coupon');
      setCouponMsg({ ok: false, text: 'Unable to apply coupon. Please verify your connection.' });
    } finally {
      setCheckingCoupon(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('kshithija_applied_coupon');
    if (saved && items.length > 0 && !appliedCoupon) {
      setCouponInput(saved);
      applyCoupon(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMsg(null);
    sessionStorage.removeItem('kshithija_applied_coupon');
  };

  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  const isFullDiscountOrder = subtotal > 0 && discountAmount >= subtotal && finalTotal <= 0;

  const handlePlaceOrder = async () => {
    if (!email.trim() || !phone.trim() || !fname.trim() || !lname.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      alert('Please fill in all required shipping and contact fields marked with *');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    setPlacing(true);
    setPlacingLabel('Securing your order...');
    const fullStreetAddress = landmark.trim() ? `${address.trim()}, Near ${landmark.trim()}` : address.trim();
    const idempotencyKey = 'ksh_idem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const activePaymentMethod = isFullDiscountOrder ? 'free' : paymentMethod;

    try {
      let customerId = 0;
      try {
        const raw = localStorage.getItem('kshithija_auth_user');
        if (raw) {
          const u = JSON.parse(raw);
          if (u?.id) customerId = Number(u.id);
        }
      } catch {}

      const orderPayload = {
        idempotency_key: idempotencyKey,
        customer_id: customerId,
        billing: {
          first_name: fname.trim(),
          last_name: lname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address_1: fullStreetAddress,
          city: city.trim(),
          state: stateVal,
          postcode: pincode.trim(),
          country,
        },
        shipping: {
          first_name: fname.trim(),
          last_name: lname.trim(),
          address_1: fullStreetAddress,
          city: city.trim(),
          state: stateVal,
          postcode: pincode.trim(),
          country,
        },
        items: items.map((i) => ({
          id: i.id,
          slug: i.slug || (typeof i.id === 'string' ? i.id : ''),
          quantity: i.quantity,
        })),
        coupon_code: appliedCoupon || '',
        payment_method: activePaymentMethod,
        customer_notes: notes.trim(),
      };

      const orderRes = await fetch(`${CHECKOUT_API}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Headless-Secret': HEADLESS_SECRET,
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json().catch(() => null);
      if (!orderRes.ok || !orderData?.success || !orderData?.order_id) {
        alert(
          (orderData && (orderData.message || orderData.code)) ||
            `Unable to place order (Server responded with status ${orderRes.status}).`
        );
        setPlacing(false);
        return;
      }

      const orderIdNum = orderData.order_id;
      const orderRef = `KSH-${orderIdNum}`;
      const resolvedTotal = isFullDiscountOrder ? 0 : Number(orderData.total) || finalTotal;

      if (activePaymentMethod === 'free' && resolvedTotal <= 0) {
        setPlacingLabel('Completing free order...');
        await fetch(`${CHECKOUT_API}/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Headless-Secret': HEADLESS_SECRET },
          body: JSON.stringify({ order_id: orderIdNum, bypassed: true }),
        }).catch(() => {});

        setSuccessOrder({ orderRef, total: 0, paymentLabel: 'Order Placed (100% Discounted)' });
        clear();
        setPlacing(false);
        return;
      }

      if (activePaymentMethod === 'razorpay') {
        setPlacingLabel('Initializing secure payment...');
        const rzpRes = await fetch(`${CHECKOUT_API}/create-razorpay-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Headless-Secret': HEADLESS_SECRET },
          body: JSON.stringify({ order_id: orderIdNum, amount: Math.round(resolvedTotal * 100) }),
        });

        const rzpOrder = await rzpRes.json();
        if (!rzpRes.ok || !rzpOrder.success || !rzpOrder.razorpay_key_id) {
          alert(rzpOrder.message || 'Payment initialization failed. Please choose Cash on Delivery.');
          setPlacing(false);
          return;
        }

        if (!window.Razorpay) {
          alert('Payment gateway SDK is loading. Please check your network and refresh.');
          setPlacing(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: rzpOrder.razorpay_key_id,
          amount: rzpOrder.amount || Math.round(resolvedTotal * 100),
          currency: rzpOrder.currency || 'INR',
          name: 'Kshithija Enterprises',
          description: `Order #${orderRef}`,
          image: '/images/logo.png',
          order_id: rzpOrder.razorpay_order_id,
          prefill: { name: `${fname} ${lname}`, email, contact: phone },
          theme: { color: '#164e2d' },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              alert(`Payment was closed. Your order #${orderRef} has been recorded.`);
            },
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            setPlacingLabel('Verifying payment...');
            await fetch(`${CHECKOUT_API}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Headless-Secret': HEADLESS_SECRET },
              body: JSON.stringify({
                order_id: orderIdNum,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }).catch(() => {});

            setSuccessOrder({ orderRef, total: resolvedTotal, paymentLabel: 'Razorpay (Paid Online)' });
            clear();
            setPlacing(false);
          },
        });

        rzp.on('payment.failed', (resp) => {
          alert(resp.error?.description || 'Payment was declined or failed. Please try again.');
          setPlacing(false);
        });
        rzp.open();
        return;
      }

      if (activePaymentMethod === 'cod') {
        setSuccessOrder({ orderRef, total: resolvedTotal, paymentLabel: 'Cash on Delivery' });
        clear();
        setPlacing(false);
        return;
      }

      const itemsList = items
        .map((i, idx) => `${idx + 1}. ${i.name} x ${i.quantity} (₹${(i.priceNum || parsePrice(i.price)) * i.quantity})`)
        .join('%0A');
      const waText =
        `*New Order: ${orderRef}*%0A` +
        `------------------------------%0A` +
        `*Customer:* ${encodeURIComponent(fname + ' ' + lname)}%0A` +
        `*Phone:* +91 ${encodeURIComponent(phone)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A%0A` +
        `*Delivery Address:*%0A${encodeURIComponent(fullStreetAddress)}, ${encodeURIComponent(city)}, ${encodeURIComponent(stateVal)}, ${encodeURIComponent(country)} - ${encodeURIComponent(pincode)}%0A` +
        `*Ordered Items:*%0A${itemsList}%0A%0A` +
        `*Payment Mode:* WHATSAPP ORDER%0A` +
        `*Total Payable:* ₹${resolvedTotal.toLocaleString('en-IN')}%0A`;

      window.open(`https://wa.me/919482126493?text=${waText}`, '_blank');
      setSuccessOrder({ orderRef, total: resolvedTotal, paymentLabel: 'WhatsApp Order' });
      clear();
      setPlacing(false);
    } catch (err) {
      alert((err as Error).message || 'An error occurred while placing your order. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="min-h-screen bg-[#faf7f2] text-[#082213] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 sm:mb-10">
            <nav aria-label="Breadcrumb" className="mb-3 text-xs text-[#55695b]">
              <ol className="flex items-center gap-2 flex-wrap">
                <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
                <li className="text-[#98a89e]">/</li>
                <li><Link href="/products" className="hover:text-[#0c3920] transition-colors">Products</Link></li>
                <li className="text-[#98a89e]">/</li>
                <li className="text-[#082213] font-semibold">Checkout</li>
              </ol>
            </nav>
          </header>

          {items.length === 0 && !successOrder ? (
            <section className="py-16 sm:py-24 text-center max-w-md mx-auto bg-white rounded-3xl border border-[#ded5c5] p-8 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[#f4ede0] text-4xl flex items-center justify-center mx-auto mb-4">🛍️</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082213] mb-2">Your Basket is Empty</h2>
              <p className="text-sm text-[#55695b] mb-6 leading-relaxed">
                Looks like you haven&apos;t added any botanical formulations or wellness supplements yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] text-white text-sm font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <span>Explore Natural Products</span>
                <span>&rarr;</span>
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-7 space-y-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* STEP 1 */}
                  <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8dfcf] shadow-2xs">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#f4ede0]">
                      <div className="w-8 h-8 rounded-full bg-[#082213] text-white flex items-center justify-center font-bold text-xs">1</div>
                      <div>
                        <h2 className="text-base sm:text-lg font-serif font-bold text-[#082213]">Contact Information</h2>
                        <p className="text-xs text-[#627568]">We will send order confirmation and dispatch updates here.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">Mobile Number</label>
                        <div className="flex items-center rounded-xl border border-[#ded5c5] bg-[#faf8f4] overflow-hidden focus-within:ring-2 focus-within:ring-[#164e2d] focus-within:bg-white transition-all">
                          <span className="px-3.5 py-2.5 text-xs font-semibold text-[#55695b] border-r border-[#ded5c5] bg-[#f4ede0]/50 select-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="98765 43210"
                            className="flex-1 px-4 py-2.5 text-sm text-[#082213] bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* STEP 2 */}
                  <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8dfcf] shadow-2xs">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#f4ede0]">
                      <div className="w-8 h-8 rounded-full bg-[#082213] text-white flex items-center justify-center font-bold text-xs">2</div>
                      <div>
                        <h2 className="text-base sm:text-lg font-serif font-bold text-[#082213]">Delivery Address</h2>
                        <p className="text-xs text-[#627568]">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fname}
                          onChange={(e) => setFname(e.target.value)}
                          placeholder="First Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lname}
                          onChange={(e) => setLname(e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Street Address (Flat / House / Building No.) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House / Flat No., Apartment Name, Street Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">Landmark / Area (Optional)</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near temple, metro station, or main road"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          Country / Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Mangaluru"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 575003"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all"
                        >
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#082213] mb-1.5">Order Notes (Optional)</label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Notes about your order, e.g. special directions for delivery."
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-[#082213] text-sm focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:bg-white transition-all resize-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* STEP 3 */}
                  <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8dfcf] shadow-2xs">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#f4ede0]">
                      <div className="w-8 h-8 rounded-full bg-[#082213] text-white flex items-center justify-center font-bold text-xs">3</div>
                      <div>
                        <h2 className="text-base sm:text-lg font-serif font-bold text-[#082213]">Payment &amp; Order Mode</h2>
                      </div>
                    </div>

                    {isFullDiscountOrder ? (
                      <div className="p-4 sm:p-5 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-xs sm:text-sm text-[#1e293b] leading-relaxed shadow-2xs font-normal">
                        No payment required. A 100% discount has been applied to your order.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label
                          className={`relative flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'razorpay' ? 'border-2 border-[#164e2d] bg-[#fcfaf7]' : 'border-[#ded5c5] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={() => setPaymentMethod('razorpay')}
                            className="mt-1 text-[#164e2d] focus:ring-[#164e2d]"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-bold text-[#082213] flex items-center gap-1.5">
                              <span>Pay Online via Razorpay</span>
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Fast &amp; Secure
                              </span>
                            </span>
                            <p className="text-xs text-[#627568] mt-1">
                              UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards &amp; Net Banking.
                            </p>
                          </div>
                        </label>

                        <label
                          className={`relative flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'cod' ? 'border-2 border-[#164e2d] bg-[#fcfaf7]' : 'border-[#ded5c5] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="mt-1 text-[#164e2d] focus:ring-[#164e2d]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-[#082213]">Cash on Delivery (COD)</span>
                              <span className="text-sm">💵</span>
                            </div>
                            <p className="text-xs text-[#627568] mt-1">
                              Pay with cash or UPI QR at your doorstep upon delivery.
                            </p>
                          </div>
                        </label>

                        <label
                          className={`relative flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                            paymentMethod === 'whatsapp' ? 'border-2 border-[#164e2d] bg-[#fcfaf7]' : 'border-[#ded5c5] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="whatsapp"
                            checked={paymentMethod === 'whatsapp'}
                            onChange={() => setPaymentMethod('whatsapp')}
                            className="mt-1 text-[#164e2d] focus:ring-[#164e2d]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-[#082213]">Order via WhatsApp</span>
                              <span className="text-sm text-[#25D366]">💬</span>
                            </div>
                            <p className="text-xs text-[#627568] mt-1">
                              Chat directly with our Mangaluru store team to confirm dispatch and customize orders.
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    <div className="pt-6 mt-6 border-t border-[#f4ede0]">
                      <button
                        type="button"
                        disabled={placing}
                        onClick={handlePlaceOrder}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#164e2d] via-[#103e23] to-[#082213] hover:from-[#1b5e37] hover:to-[#0c3920] active:scale-[0.99] text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <span>
                          {placing ? placingLabel : `Complete Order • ₹${finalTotal.toLocaleString('en-IN')}`}
                        </span>
                        {!placing && <span className="text-base">&rarr;</span>}
                      </button>
                    </div>
                  </section>
                </form>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-5">
                <aside className="sticky top-24 space-y-5">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8dfcf] shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-[#f4ede0] mb-4">
                      <h2 className="text-lg font-serif font-bold text-[#082213]">Your Order</h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f4ede0] text-[#082213]">
                        {items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      {items.map((item) => {
                        const itemTotal = (item.priceNum || parsePrice(item.price)) * item.quantity;
                        return (
                          <div key={String(item.id)} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-[#f4ede0] border border-[#e8dfcf] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#082213] truncate">{item.name}</p>
                              <p className="text-[11px] text-[#627568]">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-bold text-[#082213]">₹{itemTotal.toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#f4ede0]">
                      <div className="flex gap-2">
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
                          placeholder="Enter Coupon Code"
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#ded5c5] bg-[#faf8f4] text-xs uppercase font-medium focus:outline-none focus:ring-1 focus:ring-[#164e2d]"
                        />
                        <button
                          type="button"
                          disabled={checkingCoupon}
                          onClick={() => applyCoupon()}
                          className="px-4 py-2 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {checkingCoupon ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                      {couponMsg && (
                        <div
                          className={`text-xs mt-1.5 flex items-center justify-between ${
                            couponMsg.ok ? 'text-emerald-700 font-semibold' : 'text-red-600 font-medium'
                          }`}
                        >
                          <span>{couponMsg.text}</span>
                          {couponMsg.ok && (
                            <button
                              type="button"
                              onClick={removeCoupon}
                              className="text-[11px] text-red-600 hover:underline cursor-pointer font-medium ml-2"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#f4ede0] space-y-2.5 text-xs text-[#55695b]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-[#082213]">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Shipping</span>
                        <span className="inline-flex items-center gap-1 font-bold text-[#1c643b] bg-[#eaf4ed] px-2 py-0.5 rounded-md">
                          <span>✓ FREE</span>
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount</span>
                          <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#f4ede0] flex justify-between items-baseline text-sm font-bold text-[#082213]">
                        <span>Total</span>
                        <span className="text-xl font-serif">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-[#ded5c5] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#eaf4ed] text-[#164e2d] flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#082213]">Order Confirmed!</h2>
            <p className="text-xs sm:text-sm text-[#55695b]">
              Thank you for shopping with Kshithija Enterprises. Your order reference is{' '}
              <strong className="text-[#082213]">{successOrder.orderRef}</strong>.
            </p>
            <div className="p-4 rounded-2xl bg-[#faf8f4] border border-[#e8dfcf] text-xs space-y-1">
              <p>
                Total: <strong>₹{successOrder.total.toLocaleString('en-IN')}</strong>
              </p>
              <p>
                Payment: <strong>{successOrder.paymentLabel}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://wa.me/919482126493?text=Hi%20Kshithija%2C%20I%20have%20placed%20order%20${successOrder.orderRef}%20for%20%E2%82%B9${successOrder.total}.%20Please%20confirm%20dispatch.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm via WhatsApp
              </a>
              <Link
                href="/orders"
                className="py-3 px-5 rounded-xl bg-[#0c3920] text-white text-xs font-bold uppercase tracking-wider"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
