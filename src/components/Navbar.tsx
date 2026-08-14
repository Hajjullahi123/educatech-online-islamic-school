"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, GraduationCap, Users, Globe, School } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { tenant, isMasterSaaS } = useTenant();

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
                {isMasterSaaS ? 'Multi-Tenant SaaS Engine' : 'White-Label Academy Tenant'}
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

            <Link
              href="/register-school"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-emerald-700 border border-slate-300 px-4 py-2 rounded-full hover:bg-slate-50 transition-all"
            >
              <School className="w-3.5 h-3.5 text-emerald-600" />
              Register School
            </Link>

            <Link
              href="/auth/login"
              className="text-xs font-bold text-emerald-700 hover:opacity-80 transition-all border border-emerald-600/30 px-5 py-2.5 rounded-full"
            >
              Login
            </Link>
            <Link
              href="/apply"
              className="bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Enroll Student
            </Link>
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
      <div className={`md:hidden absolute w-full transition-all duration-300 ease-in-out ${isOpen ? 'top-full opacity-100' : '-top-[500px] opacity-0'} glass`}>
        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-4 rounded-md text-base font-medium hover:bg-primary/10 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="w-5 h-5 text-primary" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 px-3 space-y-3">
            <Link
              href="/register-school"
              className="block w-full text-center border border-emerald-600 text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Register Your School
            </Link>
            <Link
              href="/auth/login"
              className="block w-full text-center border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Login to Account
            </Link>
            <Link
              href="/apply"
              className="block w-full text-center bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
