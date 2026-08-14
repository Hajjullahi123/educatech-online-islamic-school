"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, Lock, Mic, Bell, Check, AlertCircle, Volume2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Muhammad Abdullahi',
    email: 'muhammad.abdullahi@example.com',
    targetTrack: 'Riwayah Hafs',
    recitationGoal: 'Hifz (Memoralization)'
  });

  const [passwordState, setPasswordState] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    weeklyReports: true,
    marketing: false
  });

  const [micStatus, setMicStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const testMicrophone = async () => {
    setMicStatus('TESTING');
    setMicVolume(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setMicStatus('SUCCESS');

      // Simple simulate volume level check
      const interval = setInterval(() => {
        setMicVolume(Math.floor(Math.random() * 80) + 20);
      }, 150);

      setTimeout(() => {
        clearInterval(interval);
        setMicVolume(0);
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }, 3000);

    } catch (err) {
      setMicStatus('ERROR');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="STUDENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: profile.name, role: "STUDENT" } as any} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Portal Settings</h1>
            <p className="text-slate-500 font-medium">Manage your personal settings, password changes, and hardware connections.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-8 space-y-8">
              {/* Profile Details */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" /> Personal Information
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
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Active Study Track</label>
                      <input
                        type="text"
                        disabled
                        value={profile.targetTrack}
                        className="w-full bg-slate-100 border border-slate-200 px-5 py-4 rounded-2xl font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Recitation Goal</label>
                      <select
                        value={profile.recitationGoal}
                        onChange={e => setProfile({ ...profile, recitationGoal: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800"
                      >
                        <option>Hifz (Memoralization)</option>
                        <option>Tajweed Correction</option>
                        <option>Riwayat Specialization</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4" /> Save Information
                    </button>
                  </div>
                </form>
              </div>

              {/* Password change */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" /> Account Security
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordState.current}
                        onChange={e => setPasswordState({ ...passwordState, current: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordState.newPass}
                        onChange={e => setPasswordState({ ...passwordState, newPass: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordState.confirm}
                        onChange={e => setPasswordState({ ...passwordState, confirm: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => {
                        setSaveSuccess(true);
                        setPasswordState({ current: '', newPass: '', confirm: '' });
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }}
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hardware Test & Notifications */}
            <div className="lg:col-span-4 space-y-8">
              {/* Hardware Test Diagnostic */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Mic className="w-5 h-5 text-primary" /> Recitation Hardware
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-normal">
                  Testing your microphone is critical for Ijazah and vocal classes. Connect your headset and run a diagnostics test.
                </p>

                <div className="space-y-4">
                  {micStatus === 'IDLE' && (
                    <button
                      onClick={testMicrophone}
                      className="w-full bg-primary/5 border border-primary/20 text-primary p-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Mic className="w-4 h-4" /> Start Mic Diagnostic
                    </button>
                  )}

                  {micStatus === 'TESTING' && (
                    <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-center space-y-3">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-bold">Requesting microphone access...</p>
                    </div>
                  )}

                  {micStatus === 'SUCCESS' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-center space-y-2">
                        <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                        <p className="text-xs font-black uppercase tracking-wide">Microphone Detected</p>
                        <p className="text-[10px] text-emerald-600/70 font-medium">Recitation channel is ready.</p>
                      </div>

                      {/* Volume Indicator Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> Mic Input</span>
                          <span>{micVolume}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${micVolume}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {micStatus === 'ERROR' && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-center space-y-2">
                      <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
                      <p className="text-xs font-black uppercase tracking-wide">Device Connection Fail</p>
                      <p className="text-[10px] text-rose-600/70 font-medium">Please verify browser permissions.</p>
                      <button
                        onClick={testMicrophone}
                        className="bg-white border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider mt-2 hover:bg-rose-50"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification preferences */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" /> Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'sessionReminders', label: 'Session Reminders', desc: 'Alerts 15 mins before class begins' },
                    { id: 'weeklyReports', label: 'Academic Reports', desc: 'Weekly recitation progress digest' }
                  ].map(item => (
                    <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(notifications as any)[item.id]}
                        onChange={e => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                        className="mt-1 w-4.5 h-4.5 text-primary focus:ring-primary rounded border-slate-200"
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">{item.label}</span>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Toast notification */}
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
            <span className="text-xs font-black uppercase tracking-wider">Settings Updated Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
