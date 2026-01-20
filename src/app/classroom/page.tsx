"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Video,
  Monitor,
  Hand,
  MessageSquare,
  Settings,
  X,
  Maximize,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const Classroom = () => {
  const [activeTab, setActiveTab] = useState('quran');

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-white/10 flex items-center justify-between glass mx-4 mt-4 rounded-2xl z-20">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-xl text-primary-light">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold">Surah Al-Baqarah (Verses 1-10)</h1>
            <p className="text-[10px] opacity-40 uppercase tracking-widest font-black">Riwayah Warsh • Advanced Tajweed</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-primary/20 flex items-center justify-center text-[10px] font-bold">SO</div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">ZA</div>
          </div>
          <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all">Leave Session</button>
        </div>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">

        {/* Quran Display Area */}
        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col border border-white/5 relative bg-[#fdfcf9]">
          <div className="p-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-lg">Quran View</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Teacher's Whiteboard</button>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm font-bold text-slate-600">Page 12</span>
              <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#fdfcf9] text-center">
            <div className="text-slate-800 text-5xl leading-[2.5] font-arabic font-medium max-w-2xl mx-auto">
              {/* Mock Quran Text with Highlight */}
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              <br />
              <span className="bg-emerald-100 px-2 rounded-lg decoration-emerald-500 decoration-wavy underline underline-offset-8">الٓمٓ ١ ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ</span> ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ٢
            </div>

            {/* Highlight Legend (Floating) */}
            <div className="absolute bottom-6 left-6 flex gap-4">
              <div className="glass p-3 rounded-2xl flex items-center gap-2 border border-slate-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tajweed Help</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video & Controls Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Teacher Video */}
          <div className="relative aspect-video glass rounded-2xl overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-600">
              <Video className="w-12 h-12 opacity-20" />
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-2 glass px-3 py-1 rounded-full border-white/20">
              <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Teacher: Sheikh Omar</span>
            </div>
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all">
              <div className="flex gap-2">
                <button className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-all"><Settings className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Student Video (Self) */}
          <div className="relative aspect-video glass rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center text-slate-600 bg-slate-800">
            <div className="text-center">
              <Video className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Camera Off</p>
            </div>
            <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full border-white/20">
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">You (Zaid)</span>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="flex-1 glass rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Mic, label: 'Mute', active: false },
                { icon: Video, label: 'Camera', active: false },
                { icon: Hand, label: 'Raise', active: false },
                { icon: Monitor, label: 'Share', active: false },
                { icon: MessageSquare, label: 'Chat', active: true },
                { icon: Layers, label: 'Board', active: false },
              ].map((ctrl, i) => (
                <button key={i} className="flex flex-col items-center gap-2 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${ctrl.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'}`}>
                    <ctrl.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">{ctrl.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Placeholder */}
            <div className="border-t border-white/10 pt-6 space-y-4 flex-1 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-3 text-xs leading-relaxed max-w-[80%]">
                  <span className="font-black text-primary-light block mb-1">Sheikh Omar:</span>
                  Jazakumullah. Focus on the Madd in Al-Fatiha...
                </div>
              </div>
              <div className="relative">
                <input type="text" placeholder="Send a message..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        .font-arabic {
          font-family: 'Amiri', serif;
        }
      `}</style>
    </div>
  );
};

export default Classroom;
