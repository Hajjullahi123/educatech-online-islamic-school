"use client";

import React from 'react';
import { Search, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons, tracks..."
            className="w-full bg-slate-50 border-none pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-slate-100" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Level: {user?.studentProfile?.currentLevel || 'Premium Member'}</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
