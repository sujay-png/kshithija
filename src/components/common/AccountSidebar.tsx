'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredUser, logout } from '@lib/auth';

export interface AccountSidebarProps {
  activeItem?: 'dashboard' | 'orders' | 'reviews' | 'addresses' | 'recent' | 'favorites' | 'settings' | 'profile';
}

export default function AccountSidebar({ activeItem = 'orders' }: AccountSidebarProps) {
  const [identity, setIdentity] = useState({
    name: 'Jese Leos (Personal)',
    email: 'jese@flowbite.com',
    initials: 'JL',
  });

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      const displayName =
        user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Jese Leos (Personal)';
      const initials = ((user.firstName?.[0] || displayName[0] || 'J') + (user.lastName?.[0] || 'L')).toUpperCase();
      setIdentity({
        name: displayName,
        email: user.email || 'jese@flowbite.com',
        initials,
      });
    }
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout('/login');
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-[#071911] text-white rounded-3xl border border-[#1a3a29] p-4 sm:p-5 shadow-xl sticky top-24 transition-all select-none">
        {/* User Profile Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-[#143323]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#143323] border border-[#2a543b] text-white flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden">
                <span id="sidebar-avatar-text">{identity.initials}</span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 id="sidebar-name" className="text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                  {identity.name}
                </h3>
              </div>
              <p id="sidebar-email" className="text-[11px] text-[#8ea998] truncate leading-tight mt-0.5">
                {identity.email}
              </p>
            </div>
          </div>

          <Link
            href="/my-account"
            className="text-[#8ea998] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Account Options"
            aria-label="Account Options"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 my-3.5" />

        {/* Vertical Navigation Menu */}
        <nav className="space-y-1 pt-1" aria-label="Customer Navigation">
          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeItem === 'dashboard'
                ? 'bg-[#153424] text-white font-semibold shadow-xs'
                : 'text-[#cbd5e1] hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/orders"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeItem === 'orders'
                ? 'bg-[#153424] text-white font-semibold shadow-xs'
                : 'text-[#cbd5e1] hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span>My orders</span>
          </Link>

          <Link
            href="/addresses"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeItem === 'addresses'
                ? 'bg-[#153424] text-white font-semibold shadow-xs'
                : 'text-[#cbd5e1] hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Delivery addresses</span>
          </Link>

          <Link
            href="/my-account/edit-account"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeItem === 'favorites'
                ? 'bg-[#153424] text-white font-semibold shadow-xs'
                : 'text-[#cbd5e1] hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Account Details</span>
          </Link>

          <Link
            href="/affiliate-dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#86efac] hover:bg-emerald-950/60 hover:text-white transition-all border border-emerald-500/20 my-1"
          >
            <span className="font-semibold">Affiliate Portal</span>
          </Link>

          <div className="pt-2 my-1 border-t border-[#143323]">
            <button
              type="button"
              id="btn-sidebar-logout"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#f87171] hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer mt-1"
            >
              <svg className="w-4 h-4 shrink-0 text-[#f87171]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
