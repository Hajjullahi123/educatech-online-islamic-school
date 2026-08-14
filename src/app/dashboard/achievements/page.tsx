"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Download,
  Share2,
  Bookmark,
  Search,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  X,
  Printer,
  FileCheck
} from 'lucide-react';

interface Certificate {
  id: string;
  riwayah: string;
  teacher: string;
  date: string;
  status: string;
  grade: string;
  hash: string;
}

const mockCertificates: Certificate[] = [
  {
    id: 'cert_1',
    riwayah: 'Riwayah Hafs an Asim',
    teacher: 'Sheikh Omar Al-Faruq',
    date: 'December 12, 2025',
    status: 'COMPLETED',
    grade: 'Mumtaz (Excellent)',
    hash: '8f2e7b8a9c4d2e1f'
  },
  {
    id: 'cert_2',
    riwayah: 'Juz Amma Completion',
    teacher: 'Ustadha Fatima Zahra',
    date: 'October 20, 2025',
    status: 'COMPLETED',
    grade: 'MashaAllah',
    hash: '3d1a6b7c2e8f9a4d'
  }
];

const mockBadges = [
  { name: 'On-Time Scholar', icon: '⏰', desc: 'Attended 10 sessions without delay' },
  { name: 'Consistency King', icon: '🔥', desc: '30-day learning streak' },
  { name: 'Tajweed Master', icon: '💎', desc: 'Perfect score in makharij test' },
];

export default function AchievementsPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyPortfolio = () => {
    navigator.clipboard.writeText("https://edutechportal.com/verify/muhammad-abdullahi");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="STUDENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ name: "Muhammad Abdullahi", role: "STUDENT" } as any} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Hero Header */}
          <div className="glass bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-emerald-300 border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                <Award className="w-3 h-3 text-emerald-400" /> Intellectual Excellence
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">Your Quranic Achievements</h1>
              <p className="text-slate-400 font-medium">Tracking your journey through the Sanad. Every verified Ijazah and milestone earned is preserved here forever.</p>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <Award className="w-64 h-64 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Certificates Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" /> Verified Certificates
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCertificates.map((cert) => (
                  <motion.div
                    key={cert.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedCert(cert)}
                    className="glass bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 relative group overflow-hidden cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2 text-slate-300">
                        <button className="p-2 hover:bg-slate-50 hover:text-primary rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-slate-50 hover:text-primary rounded-lg transition-all"><Share2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors text-base">{cert.riwayah}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified via Shariah Board
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instructor</span>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><User className="w-3 h-3 opacity-30" /> {cert.teacher}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issued</span>
                        <p className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1">{cert.date} <Calendar className="w-3 h-3 opacity-30" /></p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade: <span className="text-emerald-600 font-bold">{cert.grade}</span></span>
                      <span className="text-[10px] font-mono text-slate-300">#{cert.hash.substring(0, 8)}</span>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State placeholder for consistency */}
                <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-primary/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Continue your current track to earn your next Ijazah.</p>
                </div>
              </div>
            </div>

            {/* Badges & Milestones Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h3 className="text-xl font-black mb-6">Course Badges</h3>
                <div className="space-y-4">
                  {mockBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{badge.icon}</span>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-slate-900">{badge.name}</p>
                        <p className="text-[10px] font-medium text-slate-500 leading-tight">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass bg-emerald-500 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-emerald-500/10">
                <h3 className="text-xl font-black">Share Success</h3>
                <p className="text-emerald-100/70 text-sm font-medium">Link your certificates to your LinkedIn or public profile with one click.</p>
                <button 
                  onClick={handleCopyPortfolio}
                  className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all"
                >
                  {copiedLink ? 'Copied Link!' : 'Copy Public Portfolio Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* GORGEOUS HIGH-FIDELITY CERTIFICATE MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full p-8 md:p-12 relative overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 transition-all hover:bg-slate-50 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Certificate Inner Frame (Printable Area) */}
              <div id="printable-certificate" className="border-[12px] border-double border-primary/20 p-8 md:p-12 rounded-[2rem] text-center space-y-8 relative bg-[#FAF9F5]/40 select-none">
                {/* Gold corner ornaments */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500/30 rounded-br-lg" />

                {/* Calligraphy header */}
                <div className="space-y-2">
                  <span className="text-3xl">🕌</span>
                  <h2 className="text-amber-600 font-extrabold text-2xl tracking-widest uppercase" style={{ fontFamily: 'var(--font-amiri)' }}>
                    Al-Qalam Quran Academy
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Academy of Classical Recitation & Ijazah</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Certificate of Achievement</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">This is to certify that</p>
                </div>

                <div className="space-y-2">
                  <p className="text-3xl font-black text-primary border-b border-primary/10 pb-4 max-w-md mx-auto">
                    Muhammad Abdullahi
                  </p>
                  <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                    has successfully mastered the rules of Tajweed and demonstrated perfect oral recitation of the Holy Quran according to the narration of
                  </p>
                  <p className="text-xl font-bold text-amber-600 pt-2">{selectedCert.riwayah}</p>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-3 gap-6 items-end pt-8">
                  <div className="text-center space-y-1">
                    <p className="font-bold text-xs text-slate-700">{selectedCert.teacher}</p>
                    <div className="h-px bg-slate-200 w-24 mx-auto" />
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Authorized Sheikh</span>
                  </div>

                  {/* Stamp Seal */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-double border-amber-500/40 flex flex-col items-center justify-center text-amber-600 bg-amber-50/50 shadow-inner rotate-12">
                      <FileCheck className="w-6 h-6" />
                      <span className="text-[7px] font-black uppercase tracking-widest mt-1">VERIFIED</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="font-bold text-xs text-slate-700">December 2025</p>
                    <div className="h-px bg-slate-200 w-24 mx-auto" />
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Date of Issue</span>
                  </div>
                </div>

                {/* Verification ID */}
                <div className="pt-6 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Ledger Hash: </span>
                  <span className="font-mono text-slate-300">#{selectedCert.hash}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  onClick={() => window.print()}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Certificate
                </button>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-sm transition-all"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
