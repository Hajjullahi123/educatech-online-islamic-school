"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Lock, User, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const router = useRouter();
  const { tenant } = useTenant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const target = e.target as any;
    const name = target[0].value;
    const email = target[1].value;
    const password = target[2].value;
    const confirmPassword = target[3].value;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      
      // Auto sign in user
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Redirect to login if auto sign in fails for some reason
        router.push('/auth/login?registered=true');
      } else {
        // Redirect based on role
        if (type === 'TEACHER') {
          router.push('/teacher');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
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
        className="max-w-md w-full glass p-8 md:p-12 rounded-[2.5rem] border border-white relative z-10 my-8"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="w-12 h-12 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-300 border border-amber-500/20"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                <BookOpen className="text-white w-6 h-6" />
              </div>
            )}
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {tenant.name}
            </span>
          </Link>
          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-foreground/50 font-medium">Join our global Quranic learning network.</p>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center">{error}</div>}
          {success && <div className="mt-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold text-center">Registration successful! Logging in...</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">I want to register as a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('STUDENT')}
                className={`py-3 px-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${type === 'STUDENT' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/20 text-foreground/60'}`}
              >
                <User className="w-4 h-4" /> Student
              </button>
              <button
                type="button"
                onClick={() => setType('TEACHER')}
                className={`py-3 px-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${type === 'TEACHER' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/20 text-foreground/60'}`}
              >
                <UserCheck className="w-4 h-4" /> Teacher
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="text"
                required
                placeholder="Abdullah Ahmad"
                className="w-full bg-background border border-border pl-12 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-background border border-border pl-12 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border pl-12 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border pl-12 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-light transition-all active:scale-[0.98] disabled:opacity-70 mt-6"
          >
            {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-foreground/50 font-medium">
            Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
