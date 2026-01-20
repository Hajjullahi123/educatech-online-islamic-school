"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Calendar, CheckCircle, ArrowRight, ArrowLeft, Upload } from 'lucide-react';

const ApplyPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ageGroup: '',
    riwayahPreference: 'Hafs',
    goals: [],
    experience: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredSchedule: '',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const RiwayahOptions = [
    { id: 'Hafs', name: 'Hafs an Asim', desc: 'Standard / Global' },
    { id: 'Warsh', name: 'Warsh an Nafi', desc: 'North Africa' },
    { id: 'Qalun', name: 'Qalun an Nafi', desc: 'Libya / Tunisia' },
    { id: 'Duri', name: 'Ad-Duri an Abu Amr', desc: 'East Africa / Sudan' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 text-center">Join the Academy</h1>
            <p className="text-foreground/60 text-center mb-10">Complete the application to begin your journey.</p>

            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-1 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-1 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />

              {[1, 2, 3].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= i ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white border-2 border-border text-foreground/40'}`}>
                  {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="text-primary" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold opacity-60 ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Abdullah Ahmad"
                        className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="abdullah@example.com"
                        className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-60 ml-1">Age Group</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['5-12', '13-17', '18-24', '25+'].map(age => (
                        <button
                          key={age}
                          onClick={() => setFormData({ ...formData, ageGroup: age })}
                          className={`py-3 px-4 rounded-xl border-2 transition-all ${formData.ageGroup === age ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'}`}
                        >
                          {age === '25+' ? 'Adult' : age}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="text-primary" /> Learning Preferences
                  </h2>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold opacity-60 ml-1">Target Riwayah</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {RiwayahOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, riwayahPreference: opt.id })}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 ${formData.riwayahPreference === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                        >
                          <span className="font-bold">{opt.name}</span>
                          <span className="text-xs opacity-60">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-60 ml-1">Current Experience</label>
                    <textarea
                      placeholder="Tell us about your previous Quran studies..."
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold">Placement Submission</h2>
                  <p className="text-foreground/60">
                    To match you with the right teacher, please record yourself reciting 3 verses of Surah Al-Fatiha or any other portion.
                  </p>

                  <div className="border-2 border-dashed border-border rounded-[2rem] p-12 hover:border-primary/50 transition-all cursor-pointer group bg-background/50">
                    <div className="space-y-2">
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">Click to record or upload audio</p>
                      <p className="text-xs opacity-40 uppercase tracking-widest font-bold">MP3, WAV, or WebM max 10MB</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-4 text-amber-800 text-sm font-medium border border-amber-100">
                    Application Fee: <span className="font-bold">$29.00</span> (Payable on next step)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/40 hover:text-foreground hover:bg-black/5'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>

              <button
                onClick={nextStep}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
              >
                {step === 3 ? 'Proceed to Payment' : 'Continue'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplyPage;
