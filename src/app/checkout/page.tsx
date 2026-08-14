"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string; // JSON string
  isPopular: boolean;
}

const CheckoutPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [error, setError] = useState('');

  // Fetch plan details
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/pricing');
        if (!res.ok) throw new Error('Failed to load plans');
        const data: PricingPlan[] = await res.json();
        
        const params = new URLSearchParams(window.location.search);
        const planId = params.get('planId');
        
        let selected = data.find(p => p.id === planId);
        if (!selected && data.length > 0) {
          // Fallback to the middle one (usually Specialization)
          selected = data.find(p => p.name === 'Specialization') || data[0];
        }
        
        setPlan(selected || null);
      } catch (err) {
        console.error(err);
        setError('Could not load plan details.');
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, []);

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    
    if (!plan) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate secure checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout session URL was not returned.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const getPriceInUSD = (priceInNGN: number) => {
    return Math.round(priceInNGN * 0.00071);
  };

  if (status === 'loading' || loadingPlan) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const parsedFeatures = plan ? JSON.parse(plan.features) : [];
  const planPrice = plan ? getPriceInUSD(plan.price) : 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <nav className="p-8 border-b border-slate-100 flex items-center justify-between bg-white text-primary">
        <Link href="/" className="flex items-center gap-2 group">
          <BookOpen className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="font-black text-xl uppercase tracking-tighter">Al-Qalam</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
          <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
        </div>
      </nav>

      {error && (
        <div className="max-w-4xl mx-auto w-full px-4 mt-6">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100 font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!session && (
        <div className="max-w-4xl mx-auto w-full px-4 mt-6">
          <div className="p-6 bg-amber-50 text-amber-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-base">You are not signed in</p>
                <p className="text-sm opacity-80 font-medium">Please sign in or create an account to secure your student enrollment and complete checkout.</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link href={`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="bg-primary text-white text-center font-bold px-6 py-2.5 rounded-xl text-sm flex-1 hover:bg-primary-light transition-all shadow-md">
                Sign In
              </Link>
              <Link href="/apply" className="bg-white text-slate-800 text-center font-bold px-6 py-2.5 rounded-xl text-sm border border-slate-200 flex-1 hover:bg-slate-50 transition-all shadow-sm">
                Apply / Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {plan ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Summary */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Your Investment</span>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Mastering the <span className="text-secondary">Words of Allah.</span></h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                You are about to start your path toward verified Riwayah mastery. All payments are processed securely according to Shariah-compliant standards.
              </p>
            </div>

            <div className="glass bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">${planPrice}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{plan.period || '/month'}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                {parsedFeatures.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="opacity-40">Subtotal</span>
                  <span>${planPrice}.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                  <span className="opacity-40">Application Credit</span>
                  <span>-$0.00</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black">Total Due Now</span>
                  <span className="text-2xl font-black text-primary">${planPrice}.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>100% Satisfaction Guarantee. Pause or cancel your subscription at any time.</p>
            </div>
          </div>

          {/* Right: Payment Method Selection */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-black">Choose Payment Method</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'bank', label: 'Islamic Bank Transfer', icon: Lock },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${selectedMethod === method.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`p-3 rounded-xl ${selectedMethod === method.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-900">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="space-y-8">
                  {selectedMethod === 'card' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Details</label>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-400">Card verification will be completed on Stripe's secure portal</span>
                          <CreditCard className="w-5 h-5 text-slate-300" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-8 text-center">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                        <Lock className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">Direct Bank Settlement</h4>
                      <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Transfer directly to our Shariah-compliant endowment fund. Details will be provided upon confirmation.
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                      {loading ? 'Processing...' : !session ? 'Sign In & Pay' : `Confirm & Pay $${planPrice}.00`} <ChevronRight className="w-6 h-6" />
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Lock className="w-3 h-3" /> PCI DSS Compliant & Verified Secure
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 opacity-40">
              <div className="flex gap-8 items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 grayscale" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 grayscale" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5 grayscale" alt="PayPal" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[5px]">Al-Qalam Financial Systems</p>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 font-bold">No plan selected or plan not found.</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
