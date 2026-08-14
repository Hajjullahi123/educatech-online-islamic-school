"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import {
  DollarSign,
  Save,
  RefreshCw,
  Settings2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
  features: string;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    setSaving(id);
    try {
      await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      // Optionally show a success toast
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id: string, field: keyof PricingPlan, value: any) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: "Admin", role: "ADMIN" } as any} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">Dynamic Pricing</h1>
              <p className="text-slate-500 font-medium">Manage program fees and marketplace positioning.</p>
            </div>
            <button
              onClick={fetchPlans}
              className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  layout
                  className={`glass bg-white p-8 rounded-[2.5rem] border transition-all ${plan.isPopular ? 'border-primary' : 'border-slate-100'} shadow-xl shadow-slate-200/50 space-y-6 relative`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                      Popular Plan
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black">{plan.name}</h3>
                      <Settings2 className="w-5 h-5 text-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price per Month (NGN)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => handleChange(plan.id, 'price', parseFloat(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl font-black text-xl text-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Landing Page Description</label>
                      <textarea
                        value={plan.description}
                        onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <input
                        type="checkbox"
                        id={`popular-${plan.id}`}
                        checked={plan.isPopular}
                        onChange={(e) => handleChange(plan.id, 'isPopular', e.target.checked)}
                        className="w-5 h-5 accent-primary rounded-lg"
                      />
                      <label htmlFor={`popular-${plan.id}`} className="text-sm font-bold text-slate-700 cursor-pointer">
                        Mark as "Most Popular"
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdate(plan.id)}
                    disabled={saving === plan.id}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {saving === plan.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-all" />}
                    Update Pricing Plan
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-600 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-black text-amber-900 uppercase tracking-widest">Global Marketplace sync</p>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">Changes made here will reflect globally across the Academy landing page and enrollment forms. Please ensure all tax implications are reviewed before final submission of price updates.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
