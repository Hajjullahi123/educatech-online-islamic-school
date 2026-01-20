"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, GraduationCap, Users, Globe, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { name: 'Pricing', href: '#pricing', icon: Globe },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-foreground' : 'text-primary'}`}>
                Al-Qalam <span className="text-secondary">Academy</span>
              </span>
              <span className="text-[10px] uppercase tracking-[3px] opacity-60">Authentic Riwayah Learning</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/apply"
              className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-light transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground"
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
          <div className="pt-4 px-3">
            <Link
              href="/apply"
              className="block w-full text-center bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-light transition-all duration-200"
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
