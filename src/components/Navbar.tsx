"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, GraduationCap, Users, Globe, LayoutDashboard, LogOut } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { tenant } = useTenant();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Riwayah Tracks', href: '#tracks', icon: BookOpen },
    { name: 'Teachers', href: '#teachers', icon: Users },
    { name: 'Certification', href: '#certification', icon: GraduationCap },
    { name: 'Teach with Us', href: '/teacher/apply', icon: GraduationCap },
    { name: 'Pricing', href: '#pricing', icon: Globe },
  ];

  const getDashboardPath = () => {
    const role = (session?.user as any)?.role;
    if (role === 'ADMIN') return '/admin';
    if (role === 'TEACHER') return '/teacher';
    if (role === 'PARENT') return '/parent';
    return '/dashboard';
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                {tenant.name}
              </span>
              <span className="text-[10px] uppercase tracking-[2px] opacity-70 font-semibold text-emerald-700">
                Online Academy Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {session?.user ? (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  href={getDashboardPath()}
                  className="flex items-center gap-1.5 bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 border border-slate-200 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  href="/auth/login"
                  className="bg-emerald-700 text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute w-full left-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'top-full opacity-100 visible' : '-top-[500px] opacity-0 invisible pointer-events-none'} bg-white/98 backdrop-blur-xl border-b border-slate-200/80 shadow-2xl`}>
        <div className="px-5 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="w-4 h-4 text-emerald-700" />
              {link.name}
            </Link>
          ))}
          <div className="pt-3 px-1 space-y-2.5">
            {session?.user ? (
              <>
                <Link
                  href={getDashboardPath()}
                  className="flex items-center justify-center gap-2 w-full text-center bg-emerald-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-all duration-200 shadow-md shadow-emerald-700/20"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Access Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full text-center border border-rose-200 text-rose-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-rose-50 transition-all duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block w-full text-center bg-emerald-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-all duration-200 shadow-md shadow-emerald-700/20"
                onClick={() => setIsOpen(false)}
              >
                Login to Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
