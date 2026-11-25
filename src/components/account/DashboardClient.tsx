'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AccountSidebar from '@components/common/AccountSidebar';
import { getStoredToken, getStoredUser, getCustomerProfile, getCustomerOrders, logout, type CustomerOrder } from '@lib/auth';

export default function DashboardClient() {
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'ready'>('loading');
  const [displayName, setDisplayName] = useState('Customer');
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addressSnippet, setAddressSnippet] = useState('Manage shipping & billing');

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    (async () => {
      try {
        const [profile, fetchedOrders] = await Promise.all([
          getCustomerProfile().catch(() => null),
          getCustomerOrders().catch(() => []),
        ]);
        const name = profile?.displayName || user?.displayName || user?.firstName || 'Customer';
        setDisplayName(name);
        setEmail(profile?.email || user?.email || 'Manage profile');
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);

        const city = profile?.shipping?.city || '';
        const state = profile?.shipping?.state || '';
        if (city || state) {
          setAddressSnippet(`${city}${city && state ? ', ' : ''}${state}`);
        }
      } finally {
        setStatus('ready');
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#082213] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#64748b]">
          <ol className="inline-flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/dashboard" className="hover:text-[#0c3920] transition-colors">My account</Link></li>
            <li>/</li>
            <li className="font-semibold text-[#082213]" aria-current="page">Dashboard</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <AccountSidebar activeItem="dashboard" />

          <div className="flex-1 w-full min-w-0 space-y-6">
            {status === 'unauthenticated' && (
              <div className="bg-white rounded-3xl border border-[#cbd5e1] py-16 text-center text-[#64748b] shadow-xs">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h3 className="text-base font-bold text-[#082213] mb-1">Sign in to view your account dashboard</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5 leading-relaxed">
                  Log in with your Kshithija customer credentials to manage your orders, delivery addresses, and personal details.
                </p>
                <Link
                  href="/login?redirect=/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] active:scale-95 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  <span>Sign In to Your Account</span>
                  <span>→</span>
                </Link>
              </div>
            )}

            {status === 'loading' && (
              <div className="bg-white rounded-3xl border border-[#cbd5e1] py-16 text-center text-[#64748b] shadow-xs">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#0c3920] border-t-transparent mb-3" />
                <p className="text-xs font-semibold text-[#082213]">Loading dashboard</p>
              </div>
            )}

            {status === 'ready' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cbd5e1] shadow-xs relative overflow-hidden">
                  <div className="max-w-2xl">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#082213] tracking-tight mb-2">
                      Hello, {displayName}!
                    </h1>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                      (not <strong className="text-[#082213]">{displayName}</strong>?{' '}
                      <button
                        type="button"
                        onClick={() => logout()}
                        className="text-[#0284c7] hover:underline font-semibold cursor-pointer"
                      >
                        Log out
                      </button>
                      )
                    </p>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      From your account dashboard you can easily track your{' '}
                      <Link href="/orders" className="text-[#0284c7] font-semibold hover:underline">recent orders</Link>, manage your{' '}
                      <Link href="/addresses" className="text-[#0284c7] font-semibold hover:underline">shipping and billing addresses</Link>, and edit your{' '}
                      <Link href="/my-account/edit-account" className="text-[#0284c7] font-semibold hover:underline">password and account details</Link>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] flex items-center justify-center text-lg mb-4">
                        📦
                      </div>
                      <h3 className="text-base font-bold text-[#082213] mb-1">Orders</h3>
                      <p className="text-xs text-[#64748b] leading-relaxed mb-3">
                        Track shipments, check pending payments, and view past order history.
                      </p>
                      <p className="text-xs font-semibold text-[#0c3920] mb-4">
                        {orders.length === 1 ? '1 order on file' : `${orders.length} orders on file`}
                      </p>
                    </div>
                    <Link
                      href="/orders"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] hover:underline pt-3 border-t border-[#e2e8f0]"
                    >
                      <span>View recent orders</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7] flex items-center justify-center text-lg mb-4">
                        🏠
                      </div>
                      <h3 className="text-base font-bold text-[#082213] mb-1">Addresses</h3>
                      <p className="text-xs text-[#64748b] leading-relaxed mb-3">
                        Manage default delivery and billing addresses used during checkout.
                      </p>
                      <p className="text-xs font-semibold text-[#0c3920] mb-4 truncate">{addressSnippet}</p>
                    </div>
                    <Link
                      href="/addresses"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] hover:underline pt-3 border-t border-[#e2e8f0]"
                    >
                      <span>Manage addresses</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#fff7ed] border border-[#ffedd5] text-[#ea580c] flex items-center justify-center text-lg mb-4">
                        👤
                      </div>
                      <h3 className="text-base font-bold text-[#082213] mb-1">Account details</h3>
                      <p className="text-xs text-[#64748b] leading-relaxed mb-3">
                        Update personal profile name, registered email address, and change password.
                      </p>
                      <p className="text-xs font-semibold text-[#0c3920] mb-4 truncate">{email || 'Account security & password'}</p>
                    </div>
                    <Link
                      href="/my-account/edit-account"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] hover:underline pt-3 border-t border-[#e2e8f0]"
                    >
                      <span>Edit account details</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#082213] tracking-tight">Recent Orders</h2>
                      <p className="text-xs text-[#64748b]">Your most recent purchases on Kshithija Enterprises</p>
                    </div>
                    <Link href="/orders" className="text-xs font-semibold text-[#0284c7] hover:underline">
                      View all →
                    </Link>
                  </div>

                  <div className="divide-y divide-[#e2e8f0]">
                    {orders.length === 0 ? (
                      <div className="py-8 text-center text-[#64748b]">
                        <p className="text-xs mb-3">No orders placed yet.</p>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c3920] text-white text-xs font-semibold hover:bg-[#164e2d] transition"
                        >
                          <span>Browse Products</span>
                          <span>→</span>
                        </Link>
                      </div>
                    ) : (
                      orders.slice(0, 3).map((o) => {
                        const rawNum = o.orderNumber || o.id;
                        const dateStr = o.dateCreated
                          ? new Date(o.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Recent';
                        return (
                          <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#082213]">Order #{rawNum}</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1]">
                                  {o.statusLabel || o.status || 'Processing'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748b] mt-0.5">Placed on {dateStr}</p>
                            </div>
                            <div className="flex items-center gap-4 justify-between sm:justify-end">
                              <span className="font-bold text-[#082213] text-sm">{o.total || `₹${o.rawTotal || '0.00'}`}</span>
                              <Link
                                href="/orders"
                                className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] text-[#0284c7] hover:bg-[#f0f9ff] text-xs font-semibold transition"
                              >
                                View order
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
