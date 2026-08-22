"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Shield, Settings, Server, Database, Check, AlertTriangle, Eye } from 'lucide-react';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Admin Manager',
    email: 'admin@educatech.org',
    role: 'SUPER_ADMIN'
  });

  const [systemState, setSystemState] = useState({
    maintenanceMode: false,
    publicRegistration: true,
    stripeMockMode: true,
    loggingLevel: 'INFO'
  });

  const [backupStatus, setBackupStatus] = useState<'IDLE' | 'PROGRESS' | 'DONE'>('IDLE');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const triggerBackup = () => {
    setBackupStatus('PROGRESS');
    setTimeout(() => {
      setBackupStatus('DONE');
      setTimeout(() => setBackupStatus('IDLE'), 3000);
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: profile.name, role: "ADMIN" } as any} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">System Settings</h1>
            <p className="text-slate-500 font-medium">Academy settings, system database backups, and operational overrides.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Profile & Security */}
            <div className="lg:col-span-8 space-y-8">
              {/* Profile details */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" /> Admin Identity
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Admin Name</label>
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
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4" /> Save Preferences
                    </button>
                  </div>
                </form>
              </div>

              {/* System Overrides */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Server className="w-5 h-5 text-primary" /> Gateway & Overrides
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stripe mock toggle */}
                    <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:border-primary/25 transition-all">
                      <input
                        type="checkbox"
                        checked={systemState.stripeMockMode}
                        onChange={e => setSystemState({ ...systemState, stripeMockMode: e.target.checked })}
                        className="mt-1 w-5 h-5 text-primary focus:ring-primary rounded border-slate-200"
                      />
                      <div>
                        <span className="text-sm font-black text-slate-800 block">Stripe Sandbox (Mock Mode)</span>
                        <span className="text-[10px] text-slate-400 font-bold leading-tight block mt-1">If enabled, subscription payments bypass Vercel checkout and auto-approve applications.</span>
                      </div>
                    </label>

                    {/* Registration toggle */}
                    <label className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:border-primary/25 transition-all">
                      <input
                        type="checkbox"
                        checked={systemState.publicRegistration}
                        onChange={e => setSystemState({ ...systemState, publicRegistration: e.target.checked })}
                        className="mt-1 w-5 h-5 text-primary focus:ring-primary rounded border-slate-200"
                      />
                      <div>
                        <span className="text-sm font-black text-slate-800 block">Open Enrollment Registration</span>
                        <span className="text-[10px] text-slate-400 font-bold leading-tight block mt-1">Allows prospective student applicants to submit enrollment forms.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Database backups & Logs */}
            <div className="lg:col-span-4 space-y-8">
              {/* Backups Panel */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" /> Database Operations
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-normal">
                  SQLite database (`dev.db`) maintenance. Schedule or download a local dump of your data tables.
                </p>

                <div className="space-y-4">
                  {backupStatus === 'IDLE' && (
                    <button
                      onClick={triggerBackup}
                      className="w-full bg-primary/5 border border-primary/25 text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Database className="w-4 h-4" /> Trigger Backup Dump
                    </button>
                  )}

                  {backupStatus === 'PROGRESS' && (
                    <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-center space-y-3">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-bold">Bundling SQLite tables...</p>
                    </div>
                  )}

                  {backupStatus === 'DONE' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-center space-y-2">
                      <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs font-black uppercase tracking-wide">Backup Download Ready</p>
                      <p className="text-[9px] text-emerald-600/60 font-bold">educatech_backup_db.sql (4.8MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Toggle */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" /> Maintenance Window
                </h3>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 font-bold leading-normal">
                    Enabling maintenance locks all student and teacher dashboards. Only admins can access system tables.
                  </p>
                </div>
                <button
                  onClick={() => setSystemState({ ...systemState, maintenanceMode: !systemState.maintenanceMode })}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${
                    systemState.maintenanceMode 
                      ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/25' 
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {systemState.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Success Toast */}
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
            <span className="text-xs font-black uppercase tracking-wider">System Settings Saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
