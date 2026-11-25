'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import AccountSidebar from '@components/common/AccountSidebar';
import {
  getCustomerProfile,
  updateCustomerProfile,
  getStoredToken,
  getStoredUser,
  type CustomerProfile,
} from '@lib/auth';

export default function EditAccountClient() {
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'ready'>('loading');
  const [loadedProfile, setLoadedProfile] = useState<CustomerProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  const populate = (profile: CustomerProfile | null, user: ReturnType<typeof getStoredUser>) => {
    setFirstName(profile?.firstName || user?.firstName || '');
    setLastName(profile?.lastName || user?.lastName || '');
    setDisplayName(profile?.displayName || user?.displayName || user?.username || '');
    setEmail(profile?.email || user?.email || '');
  };

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    (async () => {
      try {
        const profile = await getCustomerProfile();
        setLoadedProfile(profile);
        populate(profile, user);
      } catch {
        populate(null, user);
      } finally {
        setStatus('ready');
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAlertState(null);

    if (!firstName.trim() || !lastName.trim() || !displayName.trim() || !email.trim()) {
      setAlertState({ type: 'error', msg: 'Please fill in all required fields (First name, Last name, Display name, Email).' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAlertState({ type: 'error', msg: 'Please enter a valid email address.' });
      return;
    }

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setAlertState({ type: 'error', msg: 'Please enter your current password to set a new password.' });
        return;
      }
      if (newPassword.length < 6) {
        setAlertState({ type: 'error', msg: 'Your new password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setAlertState({ type: 'error', msg: 'New passwords do not match. Please verify both new password fields.' });
        return;
      }
    }

    setSaving(true);
    try {
      const payload: {
        firstName: string;
        lastName: string;
        displayName: string;
        email: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName.trim(),
        email: email.trim(),
      };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateCustomerProfile(payload);
      const storedUser = getStoredUser() || {};
      const updatedUser = { ...storedUser, ...payload };
      localStorage.setItem('kshithija_auth_user', JSON.stringify(updatedUser));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setAlertState({ type: 'success', msg: res.message || 'Account details changed successfully.' });
    } catch (err) {
      setAlertState({
        type: 'error',
        msg: (err as Error).message || 'Failed to update account details. Please check your credentials.',
      });
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
            <li className="font-semibold text-[#082213]" aria-current="page">Account details</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          <AccountSidebar activeItem="favorites" />

          <div className="flex-1 w-full min-w-0 space-y-6">
            {status === 'unauthenticated' && (
              <div className="bg-white rounded-3xl border border-[#cbd5e1] py-16 text-center text-[#64748b] shadow-xs">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h3 className="text-base font-bold text-[#082213] mb-1">Sign in to edit your account details</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-5 leading-relaxed">
                  Log in with your Kshithija customer credentials to manage your personal profile information and change your password.
                </p>
                <Link
                  href="/login?redirect=/my-account/edit-account"
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
                <p className="text-xs font-semibold text-[#082213]">Loading account details</p>
              </div>
            )}

            {status === 'ready' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#cbd5e1] shadow-xs">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#082213] tracking-tight">Account details</h1>
                  <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                    Manage your personal profile information, display name, and password.
                  </p>
                </div>

                {alertState && (
                  <div
                    className={`rounded-2xl p-4 text-xs font-medium border flex items-start gap-3 ${
                      alertState.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <span className="text-base shrink-0">{alertState.type === 'success' ? '✓' : '⚠️'}</span>
                    <div className="flex-1 min-w-0">{alertState.msg}</div>
                    <button type="button" onClick={() => setAlertState(null)} className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-3xl border border-[#cbd5e1] p-6 sm:p-8 shadow-xs">
                  <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm" noValidate>
                    <div className="space-y-4">
                      <h2 className="font-bold text-[#082213] uppercase tracking-wider text-[11px] pb-2 border-b border-[#e2e8f0]">
                        Personal Information
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                            First name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
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
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="e.g. Puthraya"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                          Display name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Adithya Puthraya"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                        />
                        <p className="text-[11px] text-[#64748b] italic mt-1.5 leading-relaxed">
                          This will be how your name will be displayed in the account section and in reviews
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                        />
                      </div>
                    </div>

                    <fieldset className="pt-6 border-t border-[#e2e8f0] space-y-4">
                      <legend className="font-bold text-[#082213] uppercase tracking-wider text-[11px]">
                        Password Change (Optional)
                      </legend>

                      <div>
                        <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                          Current password (leave blank to leave unchanged)
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-[#082213] mb-1.5 text-xs">
                            New password (leave blank to leave unchanged)
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#082213] mb-1.5 text-xs">Confirm new password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm text-[#082213] bg-white focus:outline-none focus:ring-2 focus:ring-[#0c3920]/20 focus:border-[#0c3920] transition"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div className="pt-4 border-t border-[#e2e8f0] flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-[#0c3920] hover:bg-[#164e2d] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                      >
                        {saving ? 'Saving to WordPress...' : 'Save changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => populate(loadedProfile, getStoredUser())}
                        className="px-5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs sm:text-sm font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#082213] transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
