'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithWordPress, isAuthenticated } from '@lib/auth';

export default function LoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const params = new URLSearchParams(window.location.search);
      router.replace(params.get('redirect') || '/orders');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const authData = await loginWithWordPress(username.trim(), password, remember);
      setSuccessMsg('Login successful! Redirecting to your account...');
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get('redirect');
        let target = redirectParam;
        if (!target) {
          const isAff =
            authData?.user?.isAffiliate ||
            (Array.isArray(authData?.user?.roles) &&
              (authData.user.roles.includes('affiliate') || authData.user.roles.includes('affilate')));
          target = isAff ? '/affiliate-dashboard' : '/orders';
        }
        window.location.href = target;
      }, 600);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[85vh] bg-[#fcfaf6] text-[#082213] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#2ea843]/10 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#c99f5b]/10 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
          <ol className="inline-flex items-center gap-2 text-xs text-[#5a6e61] bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-[#ded5c5] shadow-2xs">
            <li><Link href="/" className="hover:text-[#164e2d] transition-colors">Home</Link></li>
            <li className="text-[#a4b5aa]">/</li>
            <li className="font-semibold text-[#082213] tracking-wide" aria-current="page">My account</li>
          </ol>
        </nav>

        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-3 group mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-[#2ea843] flex items-center justify-center bg-[#082213] text-white relative shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl">🌿</span>
              <span className="absolute -top-1 -right-1 text-[9px] font-bold text-[#a3cf54]">®</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#082213] leading-none font-serif">
                Kshithija
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#55695b] leading-tight mt-1">
                Enterprises
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#ded5c5] shadow-xl p-7 sm:p-9 relative overflow-hidden transition-all duration-300">
          <div className="mb-5 pb-4 border-b border-[#e8dfcf]">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#082213] tracking-tight">My account</h1>
            <h2 className="text-base sm:text-lg font-medium text-[#55695b] mt-0.5">Login</h2>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <span className="text-rose-600 text-sm shrink-0">⚠️</span>
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <span className="text-emerald-600 text-sm shrink-0">✓</span>
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-[#082213] mb-1.5">
                Username or email address <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Enter your username or email"
                className="w-full px-4 py-3 rounded-xl bg-[#faf7f0]/60 border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#8c9e92] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d]/30 focus:border-[#164e2d] transition-all shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#082213] mb-1.5">
                Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#faf7f0]/60 border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#8c9e92] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d]/30 focus:border-[#164e2d] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3.5 text-gray-400 hover:text-[#082213] cursor-pointer p-1 transition-colors select-none"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group shrink-0 disabled:opacity-60"
              >
                <span>{loading ? 'LOGGING IN...' : 'LOG IN'}</span>
                {!loading && <span className="text-sm group-hover:translate-x-0.5 transition-transform">→</span>}
              </button>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-[#3e5044] font-medium select-none group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ded5c5] text-[#164e2d] focus:ring-[#164e2d] cursor-pointer accent-[#164e2d]"
                />
                <span className="group-hover:text-[#082213] transition-colors">Remember me</span>
              </label>
            </div>

            <div className="pt-2">
              <Link
                href="/forgotpassword"
                className="text-xs sm:text-sm text-[#164e2d] hover:text-[#0c3920] hover:underline transition-colors font-semibold inline-block"
              >
                Lost your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
