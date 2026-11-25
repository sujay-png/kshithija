'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithWordPress, isAuthenticated } from '@lib/auth';

export default function AffiliateLoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/affiliate-dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both your username/email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithWordPress(username.trim(), password, remember);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/affiliate-dashboard';
      }, 600);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[90vh] bg-[#fcfaf6] text-[#082213] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#2ea843]/10 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#c99f5b]/10 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-5 flex justify-center">
          <ol className="inline-flex items-center gap-2 text-xs text-[#5a6e61] bg-white/80 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#ded5c5]">
            <li><Link href="/" className="hover:text-[#164e2d] transition-colors">Home</Link></li>
            <li className="text-[#a4b5aa]">/</li>
            <li className="font-semibold text-[#082213] tracking-wide" aria-current="page">Affiliate Portal</li>
          </ol>
        </nav>

        <div className="bg-white rounded-3xl border border-[#ded5c5] shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#f8f5ee] to-white border-b border-[#e8dfcf]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                href="/affiliate-registration"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <span>Register Now</span>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          <div className="relative py-3 bg-[#faf7f0] border-b border-[#e8dfcf] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center px-8" aria-hidden="true">
              <div className="w-full border-t border-[#ded5c5]" />
            </div>
            <div className="relative bg-[#faf7f0] px-4 flex items-center gap-1.5 text-xs font-bold text-[#4d5e52] uppercase tracking-wider">
              <span>Already registered? Log in below</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#082213] tracking-tight">Affiliate Login</h2>
              <p className="text-xs text-[#5a6e61] mt-0.5">
                Enter your credentials to securely access your partner control center.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs" role="alert">
                <span className="text-rose-600 text-base leading-none">⚠️</span>
                <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
              </div>
            )}

            {success && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs" role="alert">
                <span className="text-emerald-600 text-base leading-none">✓</span>
                <div className="flex-1 font-medium leading-relaxed">
                  <strong>Login Successful!</strong> Redirecting to your dashboard...
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="user_login" className="block text-xs font-bold uppercase tracking-wider text-[#082213] mb-1.5">
                  Username or Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="user_login"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter your registered username or email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f7f5ef] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#8c9e92] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:border-transparent transition-all shadow-2xs"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">👤</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="user_pass" className="block text-xs font-bold uppercase tracking-wider text-[#082213]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link href="/forgotpassword" className="text-xs font-semibold text-[#164e2d] hover:text-[#082213] hover:underline transition-colors">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    id="user_pass"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    spellCheck={false}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#f7f5ef] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#8c9e92] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:border-transparent transition-all shadow-2xs"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">🔑</span>
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm cursor-pointer p-1 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#3e5044] font-medium group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-[#ded5c5] text-[#164e2d] focus:ring-[#164e2d] cursor-pointer accent-[#164e2d]"
                  />
                  <span className="group-hover:text-[#082213] transition-colors">Remember Me</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  <span>{loading ? 'LOGGING IN...' : 'LOGIN'}</span>
                  {!loading && <span className="text-base group-hover:translate-x-1 transition-transform">→</span>}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-[#f0eae0] text-center">
              <Link href="/forgotpassword" className="text-xs text-[#55695b] hover:text-[#164e2d] hover:underline font-medium transition-colors">
                Forgot your password? Click here to reset it.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
