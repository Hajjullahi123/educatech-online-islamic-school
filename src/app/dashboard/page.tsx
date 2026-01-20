"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Book,
  Clock,
  Calendar as CalendarIcon,
  Award,
  PlayCircle,
  Video,
  MessageSquare,
  Settings,
  ChevronRight,
  User
} from 'lucide-react';

const StudentDashboard = () => {
  const stats = [
    { label: 'Courses', value: '3', icon: Book, color: 'text-primary' },
    { label: 'Hours', value: '24', icon: Clock, color: 'text-amber-500' },
    { label: 'Progress', value: '75%', icon: Award, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Placeholder */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 glass border-r border-border hidden md:flex flex-col z-20">
        <div className="p-6">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl">A</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 pt-10">
          {[
            { icon: Book, label: 'Sessions', active: true },
            { icon: CalendarIcon, label: 'Schedule', active: false },
            { icon: MessageSquare, label: 'Messages', active: false },
            { icon: Award, label: 'Certificates', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/5 text-foreground/60 hover:text-primary'}`}>
              <item.icon className="w-6 h-6" />
              <span className="hidden lg:block font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              <User className="text-slate-400" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold">Zaid Ahmad</p>
              <p className="text-[10px] opacity-40 uppercase font-black">Free Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-20 lg:ml-64 p-4 lg:p-10">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2">Assalamu Alaikum, Zaid! 👋</h1>
            <p className="text-foreground/50 font-medium">You have a class starting in <span className="text-primary font-bold">15 minutes</span>.</p>
          </div>

          <button className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105">
            <Video className="w-5 h-5" /> Join Virtual Classroom
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-[2rem] border border-primary/5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/5`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Recent Classes */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Recent Activity <ChevronRight className="w-5 h-5 opacity-40" />
            </h2>

            <div className="space-y-4">
              {[
                { title: 'Surah Al-Baqarah (1-5)', teacher: 'Dr. Ahmad Ibrahim', date: 'Today, 10:00 AM', status: 'Completed' },
                { title: 'Tajweed: The Rules of Noon Saakin', teacher: 'Ustadh Omar', date: 'Yesterday', status: 'In Review' },
              ].map((activity, i) => (
                <div key={i} className="glass p-5 rounded-3xl flex items-center justify-between gap-4 border border-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{activity.title}</h4>
                      <p className="text-sm opacity-50">{activity.teacher} • {activity.date}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Practice Quran Tool Link */}
            <div className="bg-gradient-to-br from-primary to-primary-light p-10 rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4">Interactive <span className="text-emerald-300">Quran Tool</span></h3>
                <p className="max-w-md opacity-80 mb-8">Practice with our AI-powered recitation feedback or review your teacher's recordings with interactive Quran display.</p>
                <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2">
                  Open Tool <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <Book className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-bold">Learning Plan</h2>
            <div className="glass p-8 rounded-[2rem] border border-primary/5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold opacity-40">Hafs Track Progress</span>
                  <span className="font-bold text-primary">75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Next Milestones</h4>
                {[
                  'Complete Juz Amma',
                  'Tajweed Exam Level 1',
                  'Ijazah Assessment'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                      {i === 0 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm font-semibold ${i === 0 ? 'text-foreground' : 'opacity-40'}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
