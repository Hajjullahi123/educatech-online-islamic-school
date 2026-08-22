"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  MapPin,
  Book,
  Award,
  FileCheck,
  Clock,
  Globe,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/context/TenantContext';

const TeacherRecruitment = () => {
  const { tenant } = useTenant();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    qualifications: '',
    riwayahExpertise: [] as string[],
    secondaryRiwayah: [] as string[],
    hourlyRate: 25,
    biography: '',
    teachingStyle: '',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const RiwayahList = [
    'Hafs an Asim', 'Shu\'bah an Asim', 'Warsh an Nafi', 'Qalun an Nafi',
    'Ad-Duri an Abu Amr', 'Al-Sousi an Abu Amr',
    'Al-Bazzi an Ibn Kathir', 'Qumbul an Ibn Kathir',
    'Hisham an Ibn Amir', 'Ibn Zakwan an Ibn Amir',
    'Khalaf an Hamzah', 'Khallad an Hamzah',
    'Abul-Harith an Al-Kisa\'i', 'Ad-Duri an Al-Kisa\'i'
  ];

  const toggleRiwayah = (name: string) => {
    setFormData(prev => ({
      ...prev,
      riwayahExpertise: prev.riwayahExpertise.includes(name)
        ? prev.riwayahExpertise.filter(r => r !== name)
        : [...prev.riwayahExpertise, name]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    
    if (!formData.fullName || !formData.email) {
      setErrorMsg('Please fill in your name and email on step 1.');
      setStep(1);
      setLoading(false);
      return;
    }

    if (formData.riwayahExpertise.length === 0) {
      setErrorMsg('Please select at least one Riwayah expertise on step 2.');
      setStep(2);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/teacher/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          riwayatMastery: formData.riwayahExpertise,
          ijazahUrls: [],
          hourlyRate: formData.hourlyRate || 25,
          availability: {
            monday: ['09:00', '11:00'],
            tuesday: ['09:00', '11:00']
          },
          languages: ['English', 'Arabic']
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      {/* Hero Section */}
      {step === 1 && !submitted && (
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-transparent text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Join Our Faculty of Scholars
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-foreground">
              Empower the Next Generation of <span className="text-gradient">Quranic Reciters</span>
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed font-medium">
              {tenant.name} is looking for qualified teachers with verified Ijazah to join our global platform. Teach from anywhere, set your own rates, and impact thousands.
            </p>
            <div className="flex justify-center gap-6 pt-6">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-primary">$35+</span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Avg. Hourly Rate</span>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-primary">Flexible</span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Global Schedule</span>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-primary">Authentic</span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Ijazah Verified</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Application Form */}
      <section className={`${step === 1 && !submitted ? 'pb-24' : 'pt-32 pb-24'} px-4`}>
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass bg-white p-12 md:p-20 rounded-[3rem] text-center border border-slate-100 shadow-2xl space-y-6 max-w-2xl mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 -z-1">
                <GraduationCap className="w-48 h-48 text-primary" />
              </div>
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl border border-emerald-100/50">
                <FileCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Application Submitted!</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto font-medium">
                Assalamu Alaikum {formData.fullName}. Your hiring application has been registered. Our Shariah Academic Board will verify your Ijazah records. Check your inbox for updates.
              </p>
              <div className="pt-4">
                <Link href="/" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all inline-block shadow-lg shadow-primary/10">
                  Return to Academy Home
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= i ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
                      {i}
                    </div>
                    {i < 4 && <div className={`w-8 h-0.5 rounded-full ${step > i ? 'bg-primary' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>

              <div className="glass bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -z-1">
                  <GraduationCap className="w-64 h-64 text-primary" />
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black mb-2">Basic Information</h2>
                        <p className="opacity-50 font-medium text-slate-500">Let's start with your contact details and location.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                          <input
                            type="text"
                            placeholder="Sheikh Omar Al-Faruq"
                            className="w-full bg-slate-50/50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Work Email</label>
                          <input
                            type="email"
                            placeholder="omar@academy.com"
                            className="w-full bg-slate-50/50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Current Location (City, Country)</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                            <input
                              type="text"
                              placeholder="Cairo, Egypt"
                              className="w-full bg-slate-50/50 border border-slate-200 pl-12 pr-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-800"
                              value={formData.location}
                              onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Proposed Hourly Rate (USD)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold opacity-30">$</span>
                            <input
                              type="number"
                              className="w-full bg-slate-50/50 border border-slate-200 pl-10 pr-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800"
                              value={formData.hourlyRate}
                              onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black mb-2">Riwayah Mastery</h2>
                        <p className="opacity-50 font-medium text-slate-500">Select all Riwayat you have a verified Ijazah for.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {RiwayahList.map(r => (
                          <button
                            key={r}
                            onClick={() => toggleRiwayah(r)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.riwayahExpertise.includes(r) ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-slate-100 hover:border-primary/20 bg-white'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Book className={`w-5 h-5 ${formData.riwayahExpertise.includes(r) ? 'text-primary' : 'text-slate-300'}`} />
                              {formData.riwayahExpertise.includes(r) && <Award className="w-4 h-4 text-secondary fill-secondary" />}
                            </div>
                            <p className="font-bold text-sm text-slate-800">{r}</p>
                          </button>
                        ))}
                      </div>

                      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4 shadow-sm">
                        <FileCheck className="w-6 h-6 text-amber-600 mt-1" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-amber-900 uppercase tracking-widest">Verification Required</p>
                          <p className="text-xs text-amber-800 leading-relaxed font-medium">After submitting, you will be required to upload high-resolution scans of your Ijazah for each selected Riwayah. Our Shariah board will verify these within 5-7 business days.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black mb-2">Teaching Portfolio</h2>
                        <p className="opacity-50 font-medium text-slate-500">Tell us about your background and teaching philosophy.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Educational Background</label>
                          <textarea
                            placeholder="Mention degrees from Al-Azhar, Islamic University of Madinah, etc."
                            className="w-full bg-slate-50/50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium min-h-[120px] text-slate-800"
                            value={formData.qualifications}
                            onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Short Biography (Public Profile)</label>
                          <textarea
                            placeholder="An overview of your journey with the Quran..."
                            className="w-full bg-slate-50/50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium min-h-[150px] text-slate-800"
                            value={formData.biography}
                            onChange={e => setFormData({ ...formData, biography: e.target.value })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center pb-8">
                      <div className="w-24 h-24 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                        <Upload className="w-12 h-12" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black mb-4 text-slate-900">Sample Recitation</h2>
                        <p className="opacity-50 font-medium max-w-lg mx-auto leading-relaxed text-slate-500">
                          To demonstrate your proficiency, please upload a 2-3 minute audio clip of your recitation. Choose a passage that highlights your mastery of your primary Riwayah.
                        </p>
                      </div>

                      <div className="border-2 border-dashed border-primary/20 rounded-[3rem] p-12 bg-primary/5 space-y-4 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-all">
                          <Book className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-slate-800">Upload Recitation Clip</p>
                          <p className="text-xs font-bold opacity-30 uppercase tracking-[3px] text-slate-500">High-Quality Audio Preferred</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded-lg" />
                          <span className="text-xs font-bold text-slate-600 text-left leading-relaxed">
                            I agree to the <Link href="#" className="text-primary hover:underline">Teacher Service Agreement</Link> and confirm that all Ijazah information provided is authentic and correct.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between pt-10 border-t border-slate-100">
                  <button
                    onClick={prevStep}
                    disabled={loading}
                    className={`flex items-center gap-2 group font-black text-sm uppercase tracking-widest ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Last Step
                  </button>

                  <button
                    onClick={step === 4 ? handleSubmit : nextStep}
                    disabled={loading}
                    className="bg-primary text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-primary/20 flex items-center gap-3 hover:bg-primary-light transition-all active:scale-[0.98] disabled:opacity-75"
                  >
                    {loading ? 'Submitting...' : step === 4 ? 'Confirm & Submit Application' : 'Next Step'} <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Global Reach', desc: 'Connect with students from over 40 countries seeking authentic Riwayah.', icon: Globe },
              { title: 'Secure Payments', desc: 'Automated weekly payouts directly to your local bank or Islamic account.', icon: ShieldCheck },
              { title: 'Flexible Schedule', desc: 'Manage your teaching hours through our advanced timezone-synced calendar.', icon: Clock },
              { title: 'Certification Power', desc: `Issue recognized ${tenant.name} certificates backed by our Shariah board.`, icon: Award },
            ].map((benefit, i) => (
              <div key={i} className="space-y-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary-light border border-white/10">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold">{benefit.title}</h4>
                <p className="text-sm opacity-40 leading-relaxed font-medium text-slate-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center opacity-30 text-xs font-black uppercase tracking-widest text-slate-400">
        &copy; 2026 {tenant.name} • Teacher Services Division
      </footer>
    </main>
  );
};

export default TeacherRecruitment;
