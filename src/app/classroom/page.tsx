"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  ChevronRight,
  Clock,
  HelpCircle,
  X,
  Send,
  Sparkles,
  Award
} from 'lucide-react';
import Link from 'next/link';

// Components
import QuranSync from '@/components/classroom/QuranSync';
import LiveVideo from '@/components/classroom/LiveVideo';

const Classroom = () => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'NOTES' | 'SETTINGS'>('CHAT');
  const [isTeacher, setIsTeacher] = useState(false); // Can be toggled for demo
  const [syncState, setSyncState] = useState({ surah: 1, verse: 1, highlight: null });
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to your live Hifz session with Sheikh Ahmad.', type: 'system' },
    { id: 2, sender: 'Teacher', text: 'Assalamu Alaikum Zaid, today we will review Surah Al-Fatihah and start the first five verses of Al-Baqarah.', type: 'teacher' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Auto-detect role for mock (could use Auth later)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'teacher') setIsTeacher(true);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      sender: isTeacher ? 'Teacher' : 'You',
      text: inputMessage,
      type: isTeacher ? 'teacher' : 'student'
    }]);
    setInputMessage('');
  };

  return (
    <div className="h-screen bg-[#F1F5F9] overflow-hidden flex flex-col font-sans">
      {/* Classroom Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-black text-lg leading-none">Al-Qalam <span className="text-secondary">Studio</span></h1>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Live Hifz Session #9012</p>
            </div>
          </Link>

          <div className="h-8 w-px bg-slate-100 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Session
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold px-3">
              <Clock className="w-4 h-4" /> 24:15
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Milestone Progress for Student */}
          {!isTeacher && (
            <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Juz Amma Progress</span>
                <span className="text-xs font-black text-primary">85% Complete</span>
              </div>
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '85%' }} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-primary transition-all"><HelpCircle className="w-5 h-5" /></button>
            <button className="p-2.5 text-slate-400 hover:text-primary transition-all"><Settings className="w-5 h-5" /></button>
            <button
              onClick={() => setIsTeacher(!isTeacher)}
              className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-all ml-4"
            >
              Switch to {isTeacher ? 'Student' : 'Teacher'} View
            </button>
            <Link
              href="/dashboard"
              className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black px-4 py-2.5 rounded-xl uppercase tracking-widest hover:bg-rose-100 transition-all ml-4"
            >
              Exit Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        {/* Main Learning Hub (Quran) */}
        <div className="flex-1 flex flex-col min-w-0">
          <QuranSync
            isTeacher={isTeacher}
            onStateChange={setSyncState}
            syncState={syncState}
          />
        </div>

        {/* Sidebar (Video & Interactions) */}
        <div className="w-[420px] shrink-0 flex flex-col gap-6 overflow-hidden">
          {/* Video Feeds */}
          <div className="h-[450px]">
            <LiveVideo isTeacher={isTeacher} />
          </div>

          {/* Interactive Panel */}
          <div className="flex-1 glass bg-white rounded-[2.5rem] border border-white shadow-xl flex flex-col overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex items-center p-2 bg-slate-50/50 border-b border-slate-100 shrink-0">
              {[
                { id: 'CHAT', label: 'Live Chat', icon: MessageSquare },
                { id: 'NOTES', label: 'Session Notes', icon: Award },
                { id: 'SETTINGS', label: 'Classroom', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel Content (Chat Body) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {activeTab === 'CHAT' ? (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col ${msg.type === 'student' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${msg.type === 'system' ? 'bg-slate-100 text-slate-500 w-full text-center' :
                          msg.type === 'teacher' ? 'bg-primary/5 text-slate-800 border-l-4 border-primary rounded-tl-none' :
                            'bg-slate-900 text-white rounded-tr-none shadow-lg'
                        }`}>
                        {msg.type !== 'system' && (
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{msg.sender}</p>
                        )}
                        {msg.text}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                    <Sparkles className="w-12 h-12" />
                    <p className="text-sm font-black uppercase tracking-widest">Enhanced Features<br />Coming Soon</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel Input */}
            {activeTab === 'CHAT' && (
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Message your classroom..."
                    className="w-full bg-white border border-border pl-6 pr-14 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 shadow-sm font-medium"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
