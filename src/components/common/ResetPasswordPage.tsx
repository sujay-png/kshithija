'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { requestPasswordReset, resetPasswordWithKey, getStoredUser, logout } from '@lib/auth';

export default function ResetPasswordPage() {
  const [urlParams, setUrlParams] = useState<{
    key: string | null;
    login: string;
    notice: string | null;
    error: string | null;
  }>({ key: null, login: '', notice: null, error: null });

  const [view, setView] = useState<'request' | 'request-success' | 'reset' | 'reset-success'>('request');
  const [conflictMsg, setConflictMsg] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState('User');
  const [genericError, setGenericError] = useState<string | null>(null);

  const [userLogin, setUserLogin] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [mismatchHint, setMismatchHint] = useState(false);

  const fallbackLostFormRef = useRef<HTMLFormElement>(null);
  const fallbackResetFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const login = params.get('login') || params.get('id') || '';
    const notice = params.get('notice');
    const errorParam = params.get('error');
    setUrlParams({ key, login, notice, error: errorParam });

    if (key) setView('reset');

    const currentUser = getStoredUser();
    if (currentUser) {
      setLoggedInUsername(currentUser.username || currentUser.email || 'Active User');
      if (login && currentUser.username && currentUser.username.toLowerCase() !== login.toLowerCase()) {
        setConflictMsg(`This password reset key is for a different user account (${login}). Please log out and try again.`);
      } else if (notice === 'different_user' || errorParam === 'different_user') {
        setConflictMsg('This password reset key is for a different user account. Please log out and try again.');
      }
    } else if (notice === 'different_user' || errorParam === 'different_user') {
      setConflictMsg('This password reset key is for a different user account. Please log out and try again.');
    }
  }, []);

  let strengthScore = 0;
  if (newPassword.length >= 6) strengthScore++;
  if (newPassword.length >= 8 && /[0-9]/.test(newPassword)) strengthScore++;
  if (newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)) strengthScore++;
  const strengthLabel =
    strengthScore === 0 ? 'Too short' : strengthScore === 1 ? 'Weak' : strengthScore === 2 ? 'Medium' : 'Strong';

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGenericError(null);
    const trimmed = userLogin.trim();
    if (!trimmed) {
      setGenericError('Please enter your username or email address.');
      return;
    }

    setRequestLoading(true);
    try {
      const res = await requestPasswordReset(trimmed);
      if ((res as { fallback?: boolean }).fallback && fallbackLostFormRef.current) {
        const originInput = fallbackLostFormRef.current.querySelector<HTMLInputElement>('#fallback_frontend_url');
        const loginInput = fallbackLostFormRef.current.querySelector<HTMLInputElement>('#fallback_user_login');
        if (originInput) originInput.value = window.location.origin;
        if (loginInput) loginInput.value = trimmed;
        fallbackLostFormRef.current.submit();
      }
      await new Promise((r) => setTimeout(r, 700));
      setView('request-success');
    } catch (err) {
      setGenericError((err as Error).message || 'Failed to send reset email. Please verify your details.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGenericError(null);
    setMismatchHint(false);

    if (newPassword.length < 6) {
      setGenericError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMismatchHint(true);
      setGenericError('Passwords do not match. Please re-enter.');
      return;
    }

    setResetLoading(true);
    try {
      let success = false;
      try {
        const res = await resetPasswordWithKey({
          key: urlParams.key || '',
          login: urlParams.login || '',
          password: newPassword,
        });
        if (res.success) success = true;
      } catch {
        if (fallbackResetFormRef.current) {
          const fbP1 = fallbackResetFormRef.current.querySelector<HTMLInputElement>('#fallback_pass1');
          const fbP2 = fallbackResetFormRef.current.querySelector<HTMLInputElement>('#fallback_pass2');
          const fbKey = fallbackResetFormRef.current.querySelector<HTMLInputElement>('#fallback_key');
          const fbLogin = fallbackResetFormRef.current.querySelector<HTMLInputElement>('#fallback_login');
          if (fbP1) fbP1.value = newPassword;
          if (fbP2) fbP2.value = confirmPassword;
          if (fbKey) fbKey.value = urlParams.key || '';
          if (fbLogin) fbLogin.value = urlParams.login || '';
          fallbackResetFormRef.current.submit();
          success = true;
        }
      }

      await new Promise((r) => setTimeout(r, 800));
      if (success) setView('reset-success');
    } catch (err) {
      setGenericError((err as Error).message || 'Failed to reset password. The link may have expired.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#fcfaf6] text-[#082213] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <nav aria-label="Breadcrumb" className="text-xs text-[#64748b]">
          <ol className="inline-flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#0c3920] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/login" className="hover:text-[#0c3920] transition-colors">My account</Link></li>
            <li>/</li>
            <li className="font-semibold text-[#082213]" aria-current="page">
              {view === 'reset' || view === 'reset-success' ? 'Reset password' : 'Lost password'}
            </li>
          </ol>
        </nav>

        <div className="border-b border-[#ded5c5] pb-4">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#082213] tracking-tight">My account</h1>
          <p className="text-xs sm:text-sm text-[#55695b] mt-1 font-medium">
            {view === 'reset'
              ? 'Enter a new password below for your account.'
              : 'Lost your password? Manage your account access securely.'}
          </p>
        </div>

        {conflictMsg && (
          <div className="p-4 sm:p-5 bg-[#fef2f2] border-l-4 border-red-600 rounded-2xl text-red-900 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                !
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">{conflictMsg}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      logout(false as unknown as string);
                      window.location.reload();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Log out &amp; try again</span>
                    <span>&rarr;</span>
                  </button>
                  <span className="text-[11px] text-red-700 font-normal">
                    Currently logged in as: <strong>{loggedInUsername}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {genericError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-2xl">
            <div className="flex items-start gap-2.5">
              <span className="text-base font-bold text-red-600 leading-none mt-0.5">✕</span>
              <span className="flex-1 font-medium">{genericError}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ded5c5] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#164e2d] via-[#2ea843] to-[#a3cf54]" />

          {view === 'request' && (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
              </p>

              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div>
                  <label htmlFor="user_login" className="block text-xs font-bold uppercase tracking-wider text-[#082213] mb-2">
                    Username or email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="user_login"
                      id="user_login"
                      required
                      value={userLogin}
                      onChange={(e) => setUserLogin(e.target.value)}
                      autoComplete="username"
                      placeholder="Enter your username or email address"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:border-transparent transition-all shadow-2xs"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                      👤
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{requestLoading ? 'Sending Email...' : 'RESET PASSWORD'}</span>
                    {!requestLoading && <span className="text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>}
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-[#ded5c5]/60 flex items-center justify-between text-xs">
                <Link href="/login" className="font-semibold text-[#164e2d] hover:text-[#0c3920] hover:underline inline-flex items-center gap-1.5 transition-colors">
                  <span>&larr;</span>
                  <span>Back to Login</span>
                </Link>
                <Link href="/" className="text-[#718778] hover:text-[#082213] transition-colors">
                  Return to Store
                </Link>
              </div>
            </div>
          )}

          {view === 'request-success' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-[#eaf4ed] text-[#164e2d] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082213] mb-2">Check Your Email</h2>
                <p className="text-xs sm:text-sm text-[#5a6e61] max-w-sm mx-auto leading-relaxed">
                  A password reset link has been dispatched to your email address. Please click the link to choose your new password.
                </p>
              </div>
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('request');
                    setGenericError(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-[#164e2d] text-[#164e2d] hover:bg-[#164e2d]/5 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Try another username or email
                </button>
                <Link
                  href="/login"
                  className="block w-full py-3 px-4 rounded-xl bg-[#164e2d] text-white hover:bg-[#0c3920] font-semibold text-xs transition-colors text-center shadow-xs"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {view === 'reset' && (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">Enter a new password below.</p>
              <div className="p-3.5 bg-[#f5f9f6] border border-[#d2e4d7] rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#eaf4ed] text-[#164e2d] flex items-center justify-center text-sm font-bold shrink-0">
                  🔑
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#55695b]">Resetting Password For</p>
                  <p className="text-xs sm:text-sm font-bold text-[#082213] truncate">{urlParams.login || 'Your Account'}</p>
                </div>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label htmlFor="new_password" className="block text-xs font-bold uppercase tracking-wider text-[#082213] mb-1.5">
                    New password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      id="new_password"
                      name="new_password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Enter at least 6 characters"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:border-transparent transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#082213] p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showNewPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className={`h-1 flex-1 rounded-full transition-colors ${strengthScore >= 1 ? 'bg-red-400' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${strengthScore >= 2 ? 'bg-amber-400' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${strengthScore >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    <span className="text-[10px] font-semibold text-gray-400 pl-1">{strengthLabel}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-wider text-[#082213] mb-1.5">
                    Re-enter new password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      id="confirm_password"
                      name="confirm_password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#faf8f4] border border-[#ded5c5] text-xs sm:text-sm text-[#082213] placeholder-[#9caea2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#164e2d] focus:border-transparent transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#082213] p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {mismatchHint && <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <span>{resetLoading ? 'Saving Password...' : 'SAVE PASSWORD'}</span>
                    {!resetLoading && <span className="text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>}
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-[#ded5c5]/60 text-center">
                <Link href="/login" className="text-xs font-semibold text-[#164e2d] hover:underline">
                  &larr; Cancel and return to Login
                </Link>
              </div>
            </div>
          )}

          {view === 'reset-success' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-[#eaf4ed] text-[#164e2d] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#082213] mb-2">Password Successfully Changed!</h2>
                <p className="text-xs sm:text-sm text-[#5a6e61] max-w-sm mx-auto leading-relaxed">
                  Your password has been securely updated. You can now log into your Kshithija account using your new credentials.
                </p>
              </div>
              <div className="pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#164e2d] hover:bg-[#0c3920] active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  <span>Log In to Your Account</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <form
          ref={fallbackLostFormRef}
          method="POST"
          action="https://kshithija.in/wp-login.php?action=lostpassword"
          target="lostpassword_target_frame"
          className="hidden"
        >
          <input type="hidden" name="user_login" id="fallback_user_login" defaultValue="" />
          <input type="hidden" name="frontend_url" id="fallback_frontend_url" defaultValue="" />
          <input type="hidden" name="redirect_to" value="https://kshithija.in/wp-login.php?checkemail=confirm" />
        </form>

        <form
          ref={fallbackResetFormRef}
          method="POST"
          action="https://kshithija.in/my-account/lost-password/"
          target="lostpassword_target_frame"
          className="hidden"
        >
          <input type="hidden" name="password_1" id="fallback_pass1" defaultValue="" />
          <input type="hidden" name="password_2" id="fallback_pass2" defaultValue="" />
          <input type="hidden" name="reset_key" id="fallback_key" defaultValue="" />
          <input type="hidden" name="reset_login" id="fallback_login" defaultValue="" />
          <input type="hidden" name="wc_reset_password" value="true" />
        </form>

        <iframe
          id="lostpassword_target_frame"
          name="lostpassword_target_frame"
          className="hidden"
          style={{ display: 'none', width: 0, height: 0, border: 0 }}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
