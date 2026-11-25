'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AccountSidebar from '@components/common/AccountSidebar';
import {
  getStoredToken,
  getStoredUser,
  getCustomerOrders,
  getCustomerProfile,
  type CustomerAddress,
  type CustomerProfile,
} from '@lib/auth';
import { cancelWooCommerceOrder } from '@lib/checkout';

interface OrderData {
  rawId?: number;
  orderId: string;
  date: string;
  price: string;
  subtotal?: string;
  discount?: string;
  customerNote?: string;
  status: 'pending' | 'on-hold' | 'pre-order' | 'in-transit' | 'confirmed' | 'cancelled' | 'refunded' | 'failed';
  statusLabel: string;
  itemsSummary: string;
  itemsList: Array<{ name: string; qty: number; price: string }>;
  awbNumber: string;
  paymentMethod?: string;
  shippingAddress?: string;
  billingAddress?: string;
  billing?: CustomerAddress | null;
  shipping?: CustomerAddress | null;
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
        <span>⏳</span>
        <span>{label || 'Pending payment'}</span>
      </span>
    );
  if (status === 'on-hold')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]">
        <span>⏸️</span>
        <span>{label || 'On hold'}</span>
      </span>
    );
  if (status === 'pre-order')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]">
        <span>⚙️</span>
        <span>{label || 'Processing'}</span>
      </span>
    );
  if (status === 'in-transit')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f8fafc] text-[#475569] border border-[#cbd5e1]">
        <span>🚚</span>
        <span>{label || 'In Transit'}</span>
      </span>
    );
  if (status === 'confirmed')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
        <span>✓</span>
        <span>{label || 'Completed'}</span>
      </span>
    );
  if (status === 'cancelled')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
        <span>✕</span>
        <span>{label || 'Cancelled'}</span>
      </span>
    );
  if (status === 'refunded')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fdf4ff] text-[#a21caf] border border-[#f5d0fe]">
        <span>↩</span>
        <span>{label || 'Refunded'}</span>
      </span>
    );
  if (status === 'failed')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3]">
        <span>⚠️</span>
        <span>{label || 'Failed'}</span>
      </span>
    );
  return <span>{label}</span>;
}

export default function OrdersClient() {
  const [state, setState] = useState<'loading' | 'unauthenticated' | 'empty' | 'ready'>('loading');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const syncOrders = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setState('unauthenticated');
      return;
    }

    try {
      const [fetchedProfile, wpOrders] = await Promise.all([
        getCustomerProfile().catch(() => null),
        getCustomerOrders(),
      ]);
      if (fetchedProfile) setProfile(fetchedProfile);

      if (!wpOrders || wpOrders.length === 0) {
        setOrders([]);
        setState('empty');
        return;
      }

      const mapped: OrderData[] = wpOrders.map((o) => {
        const st = (o.status || 'processing').toLowerCase();
        let mappedStatus: OrderData['status'] = 'pre-order';
        if (st === 'completed') mappedStatus = 'confirmed';
        else if (st === 'cancelled') mappedStatus = 'cancelled';
        else if (st === 'refunded') mappedStatus = 'refunded';
        else if (st === 'failed') mappedStatus = 'failed';
        else if (st === 'pending') mappedStatus = 'pending';
        else if (st === 'on-hold') mappedStatus = 'on-hold';
        else if (st.includes('transit') || st.includes('shipped')) mappedStatus = 'in-transit';

        const items = Array.isArray(o.items) ? o.items : [];
        return {
          rawId: o.id,
          orderId: `#${o.orderNumber || o.id}`,
          date: o.dateCreated
            ? new Date(o.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recent',
          price: o.total || `₹${o.rawTotal || '0.00'}`,
          subtotal: o.subtotal,
          discount: o.discount,
          customerNote: o.customerNote,
          status: mappedStatus,
          statusLabel: o.statusLabel || st,
          itemsSummary: items.length > 0 ? items.map((i) => i.name).join(', ') : 'Natural Wellness Products',
          itemsList:
            items.length > 0
              ? items.map((i) => ({
                  name: i.name,
                  qty: i.quantity || 1,
                  price: i.subtotal || `₹${(parseFloat(o.rawTotal || '0') / (items.length || 1)).toFixed(2)}`,
                }))
              : [{ name: 'Natural Wellness Product', qty: 1, price: o.total || '₹0.00' }],
          awbNumber: `WP-${o.id}`,
          paymentMethod: o.paymentMethod || 'Online Payment',
          shippingAddress: o.shippingAddress || '',
          billingAddress: o.billingAddress || '',
          billing: o.billing || fetchedProfile?.billing || null,
          shipping: o.shipping || fetchedProfile?.shipping || null,
        };
      });

      setOrders(mapped);
      setState('ready');
    } catch {
      setState((prev) => (prev === 'ready' ? 'ready' : 'empty'));
    }
  }, []);

  useEffect(() => {
    syncOrders();
    const onFocus = () => syncOrders();
    const onVis = () => {
      if (document.visibilityState === 'visible') syncOrders();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') syncOrders();
    }, 25000);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
      clearInterval(interval);
    };
  }, [syncOrders]);

  const filtered = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return o.orderId.toLowerCase().includes(q) || o.itemsSummary.toLowerCase().includes(q);
  });

  const handleCancel = async (item: OrderData) => {
    const confirmMsg = `Are you sure you want to cancel order ${item.orderId}?\nIf you paid online via Razorpay, a full refund of ${item.price} will be refunded to your original payment method.`;
    if (!confirm(confirmMsg)) return;

    setCancellingId(item.orderId);
    try {
      const rawNum = item.rawId || Number(item.orderId.replace(/\D/g, ''));
      const token = getStoredToken();
      const result = await cancelWooCommerceOrder({
        order_id: Number(rawNum),
        reason: 'Customer requested cancellation via My Orders',
        token: token || undefined,
      });

      if (result.success) {
        const nextStatus: OrderData['status'] =
          result.status === 'refunded' || result.refund_id ? 'refunded' : 'cancelled';
        const nextLabel = result.status_label || (nextStatus === 'refunded' ? 'Refunded' : 'Cancelled');
        setOrders((prev) =>
          prev.map((o) => (o.orderId === item.orderId ? { ...o, status: nextStatus, statusLabel: nextLabel } : o))
        );
        alert(result.message || `Order ${item.orderId} was cancelled successfully.`);
      } else {
        alert(result.message || 'Unable to cancel order. Please contact store support.');
      }
    } catch {
      alert('Failed to connect to cancellation server. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const user = typeof window !== 'undefined' ? getStoredUser() : null;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#2ea843]/10 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#c99f5b]/10 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#64748b]">
          <ol className="inline-flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/my-account" className="hover:text-[#0c3920] transition-colors">My account</Link></li>
            <li>/</li>
            <li className="font-semibold text-[#082213]" aria-current="page">Orders</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <AccountSidebar activeItem="orders" />

          <div className="flex-1 w-full min-w-0 space-y-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#e2e8f0] text-[#082213]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#082213] tracking-tight">My orders</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf4ed] text-[#1c643b] border border-[#2ea843]/30">
                    {filtered.length} order{filtered.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#475569] flex-wrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by ID..."
                      className="bg-[#f8fafc] text-[#082213] text-xs rounded-lg pl-8 pr-3 py-1.5 border border-[#cbd5e1] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0c3920] placeholder-[#94a3b8] w-36 sm:w-44"
                    />
                    <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {state === 'loading' && (
                <div className="py-16 text-center text-[#64748b]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#0c3920] border-t-transparent mb-3" />
                  <p className="text-xs font-semibold text-[#082213]">Loading orders</p>
                </div>
              )}

              {state === 'unauthenticated' && (
                <div className="py-16 text-center text-[#64748b]">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-2xl">
                    🔒
                  </div>
                  <h3 className="text-base font-bold text-[#082213] mb-1">Sign in to view your orders</h3>
                  <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5 leading-relaxed">
                    Log in with your Kshithija customer credentials to fetch your real WooCommerce orders and delivery updates.
                  </p>
                  <Link
                    href="/login?redirect=/orders"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] active:scale-95 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                  >
                    <span>Sign In to Your Account</span>
                    <span>→</span>
                  </Link>
                </div>
              )}

              {state === 'empty' && (
                <div className="py-16 text-center text-[#64748b]">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <h3 className="text-base font-bold text-[#082213] mb-1">No orders found</h3>
                  <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5 leading-relaxed">
                    You haven&apos;t placed any orders yet on Kshithija Enterprises. Explore our natural wellness and botanical beauty products.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] active:scale-95 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                  >
                    <span>Browse Products</span>
                    <span>→</span>
                  </Link>
                </div>
              )}

              {state === 'ready' && filtered.length === 0 && (
                <div className="py-16 text-center text-[#64748b]">
                  <span className="text-3xl block mb-2">🔍</span>
                  <p className="text-sm font-bold text-[#082213] mb-1">No matching orders found</p>
                  <p className="text-xs text-[#64748b] mb-4">Try clearing your search query or changing filter settings.</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#082213] text-xs font-semibold cursor-pointer transition"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {state === 'ready' && filtered.length > 0 && (
                <div className="divide-y divide-[#e2e8f0]">
                  {filtered.map((o) => (
                    <div
                      key={o.orderId}
                      className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors hover:bg-[#f8fafc] rounded-xl px-2"
                    >
                      <div className="w-full md:w-44 shrink-0">
                        <span className="text-[11px] text-[#64748b] block mb-0.5">Order ID:</span>
                        <span className="text-xs sm:text-sm font-bold text-[#082213] tracking-wide">{o.orderId}</span>
                      </div>

                      <div className="w-full md:w-28 shrink-0">
                        <span className="text-[11px] text-[#64748b] block mb-0.5">Date:</span>
                        <span className="text-xs sm:text-sm font-bold text-[#082213]">{o.date}</span>
                      </div>

                      <div className="w-full md:w-24 shrink-0">
                        <span className="text-[11px] text-[#64748b] block mb-0.5">Price:</span>
                        <span className="text-xs sm:text-sm font-bold text-[#082213]">{o.price}</span>
                      </div>

                      <div className="w-full md:w-32 shrink-0">
                        <span className="text-[11px] text-[#64748b] block mb-1">Status:</span>
                        <StatusBadge status={o.status} label={o.statusLabel} />
                      </div>

                      <div className="flex items-center gap-2 shrink-0 justify-start md:justify-end mt-1 md:mt-0 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="px-3.5 py-1.5 rounded-lg border border-[#cbd5e1] bg-white hover:bg-[#f8fafc] text-[#082213] text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          View
                        </button>

                        {o.status !== 'cancelled' && o.status !== 'refunded' && (
                          <button
                            type="button"
                            disabled={cancellingId === o.orderId}
                            onClick={() => handleCancel(o)}
                            className="px-3.5 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                          >
                            {cancellingId === o.orderId ? 'Processing...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#082213] rounded-3xl border border-[#cbd5e1] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-[#64748b] hover:text-[#082213] p-1.5 rounded-full hover:bg-[#f1f5f9] text-base cursor-pointer transition"
            >
              ✕
            </button>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="border-b border-[#e2e8f0] pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-[#082213]">Order {selectedOrder.orderId}</h2>
                <p className="text-xs text-[#64748b] mt-1">
                  Placed on {selectedOrder.date} · Status: <strong>{selectedOrder.statusLabel}</strong>
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-2">Items Ordered</h3>
                <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-xl overflow-hidden">
                  {selectedOrder.itemsList.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-[#f8fafc]">
                      <span>
                        {it.name} <strong className="text-[#64748b]">× {it.qty}</strong>
                      </span>
                      <span className="font-bold">{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1">Billing &amp; Customer</h4>
                  <p className="text-xs text-[#334155]">
                    {selectedOrder.billingAddress ||
                      profile?.billing?.address1 ||
                      user?.displayName ||
                      'On file'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1">Shipping &amp; Payment</h4>
                  <p className="text-xs text-[#334155] mb-1">
                    {selectedOrder.shippingAddress || profile?.shipping?.address1 || 'Same as billing'}
                  </p>
                  <p className="text-xs text-[#64748b]">Payment: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0] font-bold text-base">
                <span>Total Paid</span>
                <span>{selectedOrder.price}</span>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-[#e2e8f0] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] text-white text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
