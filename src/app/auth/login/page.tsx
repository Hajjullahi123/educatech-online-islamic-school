"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = (e.target as any)[0].value;
    const password = (e.target as any)[1].value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      const role = session?.user?.role;

      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'TEACHER') {
        router.push('/teacher');
      } else {
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl');
        router.push(callbackUrl || '/dashboard');
      }
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 md:p-12 rounded-[2.5rem] border border-white relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Al-Qalam <span className="text-secondary">Academy</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
          <p className="text-foreground/50 font-medium">Please enter your details to sign in.</p>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-background border border-border pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold opacity-60">Password</label>
              <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-light transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-foreground/50 font-medium">
            New to Al-Qalam? <Link href="/apply" className="text-primary font-bold hover:underline">Apply as a Student</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
