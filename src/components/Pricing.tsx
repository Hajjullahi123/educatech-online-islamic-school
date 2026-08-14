"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const [currency, setCurrency] = useState('NGN');
  const [exchangeRates] = useState({
    NGN: 1,
    USD: 0.00071, // 1/1400
    GBP: 0.00056,
    EUR: 0.00065
  });

  const currencySymbols: { [key: string]: string } = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€'
  };

  const [plans, setPlans] = useState([
    {
      name: 'Foundation',
      price: 140000,
      period: '/month',
      description: 'Perfect for individual learners beginning their Quranic journey.',
      features: JSON.stringify([
        '2 classes per week (30 min)',
        'Verified Hafs Teacher',
        'Basic Tajweed Curriculum',
        'Digital Study Materials',
        'Progress Reports'
      ]),
      isPopular: false
    },
    {
      name: 'Specialization',
      price: 195000,
      period: '/month',
      description: 'Intensive learning with focus on specific Riwayah mastery.',
      features: JSON.stringify([
        '3 classes per week (30 min)',
        'Choice of any Riwayah',
        'Advanced Tajweed Rules',
        'Certificate of Completion',
        'Class Recordings Access',
        'Direct Chat with Teacher'
      ]),
      isPopular: true
    },
    {
      name: 'Hifz Intensive',
      price: 280000,
      period: '/month',
      description: 'Comprehensive memorization program with daily tracking.',
      features: JSON.stringify([
        '5 classes per week (30 min)',
        'Master Hifz Teacher',
        'Personalized Hifz Plan',
        'Ijazah Certification Track',
        'Monthly Evaluation Sessions',
        'Priority Scheduling'
      ]),
      isPopular: false
    }
  ]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        if (data && data.length > 0) {
          setPlans(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic prices:", err);
      }
    };
    fetchPlans();
  }, []);

  const formatPrice = (price: number) => {
    const converted = price * exchangeRates[currency as keyof typeof exchangeRates];
    if (currency === 'NGN') {
      return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(converted);
    }
    return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <section id="pricing" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Investment In Akhirah</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-foreground">Transparent Pricing Plans</h3>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Affordable, high-quality Quranic education. All plans include a 15% family discount for the second sibling.
          </p>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
            {Object.keys(exchangeRates).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${currency === curr ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const features = JSON.parse(plan.features);
            return (
              <div
                key={i}
                className={`relative glass p-10 rounded-[2.5rem] border flex flex-col transition-all duration-300 hover:scale-[1.02] ${plan.isPopular ? 'border-primary shadow-xl shadow-primary/10' : 'border-primary/5 shadow-sm'}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h4 className="text-2xl font-black mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">
                      {currencySymbols[currency]}{formatPrice(plan.price)}
                    </span>
                    <span className="text-sm font-bold opacity-40">{plan.period || '/month'}</span>
                  </div>
                  <p className="text-sm opacity-50 font-medium mt-4">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {features.map((feature: string, j: number) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold opacity-70">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/checkout"
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${plan.isPopular ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-light' : 'bg-white border border-primary/20 text-primary hover:bg-primary/5'}`}
                >
                  {plan.name === 'Foundation' ? 'Start Foundation' : plan.name === 'Specialization' ? 'Choose Riwayah' : 'Join Hifz Program'} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
