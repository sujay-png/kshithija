'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import AccountSidebar from '@components/common/AccountSidebar';
import { COUNTRIES } from '@data/countries';
import {
  getCustomerProfile,
  updateCustomerAddress,
  getStoredToken,
  type CustomerAddress,
} from '@lib/auth';

const STATES = [
  'Karnataka',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Puducherry',
  'Jammu and Kashmir',
  'Ladakh',
];

function hasAddressData(addr?: CustomerAddress | null) {
  return Boolean(addr && (addr.address1 || addr.city || addr.postcode));
}

export default function AddressesClient() {
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'list' | 'form'>('loading');
  const [shipping, setShipping] = useState<CustomerAddress>({});
  const [billing, setBilling] = useState<CustomerAddress>({});
  const [editingType, setEditingType] = useState<'shipping' | 'billing'>('shipping');
  const [formData, setFormData] = useState<CustomerAddress>({
    firstName: '',
    lastName: '',
    company: '',
    country: 'IN',
    address1: '',
    address2: '',
    city: '',
    state: 'Karnataka',
    postcode: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    (async () => {
      try {
        const profile = await getCustomerProfile();
        const ship = profile?.shipping || {};
        const bill = profile?.billing || {};
        setShipping(ship);
        setBilling(bill);

        const params = new URLSearchParams(window.location.search);
        const editParam = params.get('edit');
        if (editParam === 'shipping' || editParam === 'billing') {
          const target = editParam === 'shipping' ? ship : bill;
          setEditingType(editParam);
          setFormData({
            firstName: target.firstName || '',
            lastName: target.lastName || '',
            company: target.company || '',
            country: target.country || 'IN',
            address1: target.address1 || '',
            address2: target.address2 || '',
            city: target.city || '',
            state: target.state || 'Karnataka',
            postcode: target.postcode || '',
            phone: target.phone || '',
            email: target.email || profile?.email || '',
          });
          setStatus('form');
        } else {
          setStatus('list');
        }
      } catch {
        setStatus('list');
      }
    })();
  }, []);

  const openEditor = (type: 'shipping' | 'billing') => {
    const target = type === 'shipping' ? shipping : billing;
    setEditingType(type);
    setFormData({
      firstName: target.firstName || '',
      lastName: target.lastName || '',
      company: target.company || '',
      country: target.country || 'IN',
      address1: target.address1 || '',
      address2: target.address2 || '',
      city: target.city || '',
      state: target.state || 'Karnataka',
      postcode: target.postcode || '',
      phone: target.phone || '',
      email: target.email || '',
    });
    setStatus('form');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomerAddress(editingType, formData as unknown as Record<string, string>);
      if (editingType === 'shipping') setShipping(formData);
      else setBilling(formData);
      setStatus('list');
      showToast(`${editingType === 'shipping' ? 'Shipping' : 'Billing'} address saved successfully!`);
    } catch (err) {
      alert((err as Error).message || 'Failed to update address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#082213] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#64748b]">
          <ol className="inline-flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/orders" className="hover:text-[#0c3920] transition-colors">My account</Link></li>
            <li>/</li>
            <li>
              <button type="button" onClick={() => setStatus('list')} className="hover:text-[#0c3920] transition-colors cursor-pointer">
                Delivery addresses
              </button>
            </li>
            {status === 'form' && (
              <>
                <li>/</li>
                <li className="font-semibold text-[#082213]">
                  Edit {editingType === 'shipping' ? 'Shipping' : 'Billing'} Address
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <AccountSidebar activeItem="addresses" />

          <div className="flex-1 w-full min-w-0 space-y-6">
            {status === 'unauthenticated' && (
              <div className="bg-white rounded-3xl border border-[#cbd5e1] py-16 text-center text-[#64748b] shadow-xs">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h3 className="text-base font-bold text-[#082213] mb-1">Sign in to view your addresses</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5 leading-relaxed">
                  Log in with your Kshithija customer credentials to manage your live WooCommerce shipping and billing addresses.
                </p>
                <Link
                  href="/login?redirect=/addresses"
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
                <p className="text-xs font-semibold text-[#082213]">Loading customer addresses</p>
              </div>
            )}

            {status === 'list' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#cbd5e1] shadow-xs">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#082213] tracking-tight">My addresses</h1>
                  <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                    The following addresses will be used on the checkout page by default.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['shipping', 'billing'] as const).map((type) => {
                    const addr = type === 'shipping' ? shipping : billing;
                    const configured = hasAddressData(addr);
                    return (
                      <div
                        key={type}
                        className="bg-white rounded-3xl border border-[#cbd5e1] p-6 sm:p-7 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e2e8f0]">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                type === 'shipping'
                                  ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                                  : 'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]'
                              }`}
                            >
                              <span>{type === 'shipping' ? '📦' : '💳'}</span>
                              <span>{type === 'shipping' ? 'Shipping Address' : 'Billing Address'}</span>
                            </span>
                          </div>

                          {configured ? (
                            <>
                              <h3 className="text-sm sm:text-base font-bold text-[#082213] mb-1.5">
                                {`${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Saved Address'}
                              </h3>
                              <div className="text-xs sm:text-sm text-[#475569] leading-relaxed space-y-1">
                                {addr.company && <p>{addr.company}</p>}
                                <p>{addr.address1}</p>
                                {addr.address2 && <p>{addr.address2}</p>}
                                <p>
                                  {addr.city}
                                  {addr.state ? `, ${addr.state}` : ''} {addr.postcode}
                                </p>
                                {addr.phone && <p className="text-xs text-[#64748b] pt-1">📞 {addr.phone}</p>}
                              </div>
                            </>
                          ) : (
                            <p className="text-xs sm:text-sm text-[#64748b] italic">
                              You have not set up this type of address yet.
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => openEditor(type)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] hover:underline cursor-pointer"
                          >
                            <span>{configured ? '✏️ Edit address' : '+ Add address'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {status === 'form' && (
              <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 sm:p-8 shadow-xs">
                <button
                  type="button"
                  onClick={() => setStatus('list')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#082213] mb-4 cursor-pointer transition"
                >
                  <span>←</span>
                  <span>Back to addresses</span>
                </button>

                <div className="pb-5 border-b border-[#e2e8f0]">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#082213] tracking-tight">
                    {editingType === 'shipping' ? 'Shipping address' : 'Billing address'}
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Enter your address details below. This will be used as your default address on checkout.
                  </p>
                </div>

                <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Adithya"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Puthraya"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                      Company name <span className="text-[#94a3b8] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Kshithija Enterprises"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.country || 'IN'}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition cursor-pointer"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address1 || ''}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      placeholder="House number and street name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                    />
                    <input
                      type="text"
                      value={formData.address2 || ''}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                      placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Mangaluru"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.state || 'Karnataka'}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition cursor-pointer"
                      >
                        <option value="">Select a state...</option>
                        {STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={formData.postcode || ''}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        placeholder="e.g. 575002"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9481973468"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                  </div>

                  {editingType === 'billing' && (
                    <div>
                      <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                      />
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#e2e8f0] flex flex-wrap items-center justify-start gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                    >
                      <span>{saving ? 'Saving...' : 'Save address'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('list')}
                      className="px-5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#082213] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082213] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 text-xs font-semibold">
          <span className="text-emerald-400 text-base">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}
