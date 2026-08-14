"use client";

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Star,
  GraduationCap,
  MoreHorizontal,
  Globe,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  UserCheck,
  Video
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const TeacherDirectory = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const teachers = [
    // ... (rest of the teachers array remains same)
    {
      name: 'Sheikh Omar Al-Faruq',
      id: 'TCH-001',
      riwayat: ['Hafs', 'Warsh'],
      students: 12,
      hours: 1450,
      rating: 4.9,
      status: 'ACTIVE',
      image: 'https://ui-avatars.com/api/?name=Omar+F&background=059669&color=fff'
    },
    {
      name: 'Dr. Faisal Qureshi',
      id: 'TCH-002',
      riwayat: ['10 Qira\'at'],
      students: 8,
      hours: 890,
      rating: 5.0,
      status: 'ON_LEAVE',
      image: 'https://ui-avatars.com/api/?name=Faisal+Q&background=b45309&color=fff'
    },
    {
      name: 'Ustadh Ibrahim Khalil',
      id: 'TCH-003',
      riwayat: ['Hafs'],
      students: 15,
      hours: 2100,
      rating: 4.8,
      status: 'ACTIVE',
      image: 'https://ui-avatars.com/api/?name=Ibrahim+K&background=064e3b&color=fff'
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                <Link href="/admin" className="hover:underline">Dashboard</Link>
                <span className="opacity-40">/</span>
                <span>Teacher Directory</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900">Elite Faculty</h1>
              <p className="text-slate-500 font-medium">Manage and audit our network of verified Quranic scholars.</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, riwayah, ID..."
                  className="bg-white border border-border pl-12 pr-6 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 w-80 text-sm font-medium transition-all"
                />
              </div>
              <button className="flex items-center gap-2 bg-white border border-border px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </header>

          {/* Registry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all flex flex-col">
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] border-4 border-slate-50 overflow-hidden shadow-lg">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                      <MoreHorizontal className="w-5 h-5 text-slate-300" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{t.name}</h3>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.id}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {t.riwayat.map(r => (
                      <span key={r} className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg uppercase tracking-widest">{r}</span>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 mt-auto border-t border-slate-50 grid grid-cols-3 gap-4">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Students</p>
                    <p className="font-bold text-slate-900">{t.students}</p>
                  </div>
                  <div className="text-center space-y-1 border-x border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400">Hours</p>
                    <p className="font-bold text-slate-900">{t.hours}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Rating</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-900">{t.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">View Profile</button>
                  <button className="flex-1 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Audit Classes</button>
                </div>
              </div>
            ))}

            <button className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-primary/30 hover:text-primary transition-all group">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-all">
                <UserCheck className="w-8 h-8 opacity-20 group-hover:opacity-100" />
              </div>
              <p className="font-bold">Onboard New Teacher</p>
              <p className="text-[10px] uppercase font-black tracking-widest mt-2 opacity-50">Manual Process</p>
            </button>
          </div>

          {/* Directory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
            {[
              { label: 'Active Sessions', value: '18', icon: Video, color: 'text-rose-500' },
              { label: 'Verified Riwayat', value: '14/14', icon: BookOpen, color: 'text-primary' },
              { label: 'Teaching Certs', value: '156', icon: Award, color: 'text-amber-500' },
              { label: 'Online Index', value: '98%', icon: Globe, color: 'text-blue-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                  <p className="text-xl font-black text-slate-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDirectory;
