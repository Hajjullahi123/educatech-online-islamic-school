'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { School, ShieldCheck, ArrowRight, Palette, Globe, CheckCircle2, Sparkles, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterSchoolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    schoolName: '',
    slug: '',
    adminName: '',
    adminEmail: '',
    password: '',
    primaryColor: '#064e3b',
    secondaryColor: '#d97706',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/register-school');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register school');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating the school organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide">Super Admin Console</span>
              <span className="text-[10px] block text-emerald-400 font-medium">Tenant Organization Provisioning</span>
            </div>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Super Admin Mode
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 w-full z-10">
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">School Registered Successfully!</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              MashaAllah! <span className="text-emerald-400 font-semibold">{formData.schoolName}</span> has been onboarded onto the multi-tenant network.
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-left mb-6 text-xs space-y-2 font-mono text-slate-300">
              <div><span className="text-slate-500">School URL:</span> https://{formData.slug || 'your-school'}.educatech.org</div>
              <div><span className="text-slate-500">Admin Email:</span> {formData.adminEmail}</div>
              <div><span className="text-slate-500">Tenant Status:</span> Active White-label Tenant</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-6 py-3 rounded-xl border border-white/10 transition-all"
              >
                Return to Admin Console
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    schoolName: '',
                    slug: '',
                    adminName: '',
                    adminEmail: '',
                    password: '',
                    primaryColor: '#064e3b',
                    secondaryColor: '#d97706',
                  });
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                Register Another School <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left Column: Explainer */}
            <div className="md:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Multi-Tenant SaaS Network
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Register Your Islamic School
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your academy with white-label virtual Quran classrooms, custom school branding, verified Ijazah gradebooks, and automated student enrollment.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Custom School Branding</h4>
                    <p className="text-[11px] text-slate-400">Your school name, logo, and brand colors across all student and teacher portals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Dedicated Subdomain & Portal</h4>
                    <p className="text-[11px] text-slate-400">Get your isolated tenant portal e.g. <code className="text-emerald-300">al-azhar.educatech.org</code>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Shariah-Compliant Payments</h4>
                    <p className="text-[11px] text-slate-400">Integrated tuition collection, invoice logs, and teacher payouts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="md:col-span-3 bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">School / Academy Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Azhar Quranic Institute"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Desired Subdomain / Slug</label>
                  <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl px-3 text-sm">
                    <input
                      type="text"
                      required
                      placeholder="al-azhar"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full bg-transparent py-2.5 text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-500 font-mono">.educatech.org</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Mahmoud Al-Husseini"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@alazhar.edu"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" /> Primary School Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-white/10"
                    />
                    <span className="text-xs text-slate-400 font-mono">{formData.primaryColor}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Provisioning School...
                    </>
                  ) : (
                    <>
                      Register School on Network <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 z-10">
        © 2026 EducaTech Online Islamic School SaaS. All Rights Reserved.
      </footer>
    </div>
  );
}
