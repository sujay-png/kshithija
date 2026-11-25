'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';

const WP_BASE = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://kshithija.in').replace(/\/+$/, '');
const HEADLESS_SECRET =
  process.env.NEXT_PUBLIC_HEADLESS_VERIFY_SECRET ||
  '19827fe00484d444da19911adf8110ec30dc2d4e51cfe55f47a22c02d8d18d71';

export default function AffiliateRegistrationClient() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('kshithija_auth_token');
    setToken(t);
    setIsLoggedIn(Boolean(t));
    try {
      const raw = localStorage.getItem('kshithija_auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        setIsAffiliate(
          Boolean(
            u &&
              (u.isAffiliate === true ||
                u.isAffiliate === '1' ||
                u.isAffiliate === 1 ||
                (Array.isArray(u.roles) && u.roles.includes('affiliate')))
          )
        );
        if (u.firstName) setFirstName(u.firstName);
        if (u.lastName) setLastName(u.lastName);
        if (u.email) setEmail(u.email);
        if (u.username) setUsername(u.username);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);

    if (password !== passwordConfirm) {
      setErrorMsg('Passwords do not match! Please check and confirm your password.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Headless-Secret': HEADLESS_SECRET,
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${WP_BASE}/wp-json/headless/v1/auth/register-affiliate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please check your information.');
      }

      if (data.token) localStorage.setItem('kshithija_auth_token', data.token);
      if (data.user) localStorage.setItem('kshithija_auth_user', JSON.stringify(data.user));

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/affiliate-dashboard';
      }, 1200);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative w-full bg-[#fbf9f4] pt-12 sm:pt-16 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#e8dfcf] overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 opacity-5 pointer-events-none select-none text-[#082213]">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="inline-flex items-center justify-center gap-2 text-xs text-[#5a6e61]">
              <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
              <li className="text-[#a4b5aa]">/</li>
              <li className="font-semibold text-[#082213] tracking-wide" aria-current="page">Affiliate Registration</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="relative w-full bg-[#fcfaf6] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#ded5c5] shadow-sm">
            <div className="mb-8 pb-6 border-b border-[#f4ede0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#082213] tracking-tight">
                  Become an Affiliate
                </h2>
                <p className="text-xs sm:text-sm text-[#5a6e61] mt-1 font-normal">
                  Register for free and get your own personal discount coupon.
                </p>
              </div>

              <Link
                href={isLoggedIn ? '/affiliate-dashboard' : '/affiliate-login'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f4ede0] hover:bg-[#ebd8bc] text-[#082213] text-xs font-semibold border border-[#ded5c5] transition-all self-start sm:self-auto shrink-0"
              >
                <span>{isLoggedIn ? 'Go to Affiliate Dashboard' : 'Already registered? Log In'}</span>
                <span>→</span>
              </Link>
            </div>

            {isLoggedIn && isAffiliate && (
              <div className="mb-6 p-4 rounded-2xl bg-[#eaf4ed] border border-[#c2dfcb] text-xs sm:text-sm text-[#18532f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌿</span>
                  <span>You are already an active Kshithija Affiliate Partner!</span>
                </div>
                <Link
                  href="/affiliate-dashboard"
                  className="px-4 py-1.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto shrink-0"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Bhat"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ramesh_wellness"
                  className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#082213] mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    minLength={8}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c643b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2.5">
                  <span className="text-base">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-[#eaf4ed] border border-[#c2dfcb] text-xs sm:text-sm text-[#18532f] flex items-center gap-3">
                  <span className="text-xl">🎉</span>
                  <div>
                    <strong>Registration Successful!</strong> Welcome to the Kshithija affiliate partner family. Redirecting to your dashboard...
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#c99f5b] hover:bg-[#b88c45] active:bg-[#a67c37] text-[#082213] font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  <span>
                    {success
                      ? 'Joined Successfully! ✓'
                      : loading
                      ? isLoggedIn
                        ? 'Joining Program...'
                        : 'Registering Account...'
                      : isLoggedIn
                      ? 'Join now the affiliate program'
                      : 'Register as Affiliate'}
                  </span>
                  {!loading && !success && (
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
