"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, Clock, Check, Calendar, Plus, Trash2 } from 'lucide-react';

export default function TeacherSettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Sheikh Ibrahim',
    email: 'teacher@educatech.org',
    hourlyRate: 25,
    bio: 'Senior reciter with 20 years of experience teaching global students.',
    certificates: 'Ijazah in Ten Qiraat, PhD in Islamic Studies'
  });

  const [schedule, setSchedule] = useState([
    { day: 'Monday', start: '09:00', end: '11:00', active: true },
    { day: 'Tuesday', start: '09:00', end: '11:00', active: true },
    { day: 'Wednesday', start: '10:00', end: '12:00', active: false },
    { day: 'Thursday', start: '10:00', end: '12:00', active: false },
    { day: 'Friday', start: '14:00', end: '16:00', active: false }
  ]);

  const [languages, setLanguages] = useState({
    arabic: true,
    english: true,
    urdu: true,
    french: false
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleDay = (idx: number) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, active: !s.active } : s));
  };

  const updateTime = (idx: number, field: 'start' | 'end', val: string) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: profile.name, role: "TEACHER" } as any} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Faculty Settings</h1>
            <p className="text-slate-500 font-medium">Manage your credentials, set availability hours, and configure student rates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content: Bio & Profile */}
            <div className="lg:col-span-8 space-y-8">
              {/* Profile Details */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" /> Faculty Profile
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Hourly Rate ($USD)</label>
                      <input
                        type="number"
                        value={profile.hourlyRate}
                        onChange={e => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Academic Certificates</label>
                      <input
                        type="text"
                        value={profile.certificates}
                        onChange={e => setProfile({ ...profile, certificates: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Biography / Bio Info</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4" /> Save Faculty Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Content: Weekly Availability Grid */}
            <div className="lg:col-span-4 space-y-8">
              {/* Availability Panel */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" /> Active Availability
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-normal">
                  Configure the days and hourly slots students can book sessions with you.
                </p>

                <div className="space-y-4">
                  {schedule.map((item, idx) => (
                    <div key={item.day} className={`p-4 rounded-2xl border transition-all ${
                      item.active ? 'bg-primary/5 border-primary/20' : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.active}
                            onChange={() => toggleDay(idx)}
                            className="w-4 h-4 text-primary focus:ring-primary rounded border-slate-200"
                          />
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{item.day}</span>
                        </label>
                      </div>

                      {item.active && (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={item.start}
                            onChange={e => updateTime(idx, 'start', e.target.value)}
                            className="w-full bg-white border border-slate-100 px-3 py-2 rounded-xl text-center font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                          />
                          <span className="text-xs font-bold text-slate-400">to</span>
                          <input
                            type="text"
                            value={item.end}
                            onChange={e => updateTime(idx, 'end', e.target.value)}
                            className="w-full bg-white border border-slate-100 px-3 py-2 rounded-xl text-center font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 text-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Language list */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" /> Spoken Languages
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'english', label: 'English' },
                    { id: 'arabic', label: 'Arabic' },
                    { id: 'urdu', label: 'Urdu' }
                  ].map(lang => (
                    <label key={lang.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(languages as any)[lang.id]}
                        onChange={e => setLanguages({ ...languages, [lang.id]: e.target.checked })}
                        className="w-4.5 h-4.5 text-primary focus:ring-primary rounded border-slate-200"
                      />
                      <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save success toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-slate-950 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50 border border-white/10"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Faculty Settings Saved Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
