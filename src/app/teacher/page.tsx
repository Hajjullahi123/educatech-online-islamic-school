"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Video, Calendar, Bell, Search, Star, MessageSquare } from 'lucide-react';

const TeacherDashboard = () => {
  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black">Teacher Workspace</h1>
            <p className="text-foreground/50 font-medium">Manage your students, classes, and track academic progress.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="Search students..."
                className="bg-white border border-border pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 w-64"
              />
            </div>
            <button className="p-2.5 glass rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-[2rem] space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-40">Ready to Teach?</h3>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                <Video className="w-5 h-5" /> Start Classroom
              </button>
              <button className="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/5 transition-all">
                <Calendar className="w-5 h-5" /> View Schedule
              </button>
            </div>

            <div className="glass p-6 rounded-[2rem] space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-40">Teacher Profile</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">SO</div>
                <div>
                  <p className="font-bold">Sheikh Omar</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="text-xs font-bold">4.9 (120 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <p className="text-xs font-bold opacity-40">MASTERY</p>
                <div className="flex flex-wrap gap-2">
                  {['Hafs', 'Warsh', 'Qalun'].map(r => (
                    <span key={r} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Roster */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Active Student Roster</h2>
              <button className="text-primary font-bold text-sm flex items-center gap-1">View All <GraduationCap className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Zaid Ahmad', level: 'Intermediate', track: 'Warsh', nextClass: 'Tomorrow, 2:00 PM', progress: 75 },
                { name: 'Yusuf Ali', level: 'Beginner', track: 'Hafs', nextClass: 'Today, 4:00 PM', progress: 30 },
                { name: 'Amira Farrah', level: 'Advanced', track: 'Qalun', nextClass: 'Monday, 10:00 AM', progress: 90 },
                { name: 'Ibrahim Khan', level: 'Beginner', track: 'Hafs', nextClass: 'Today, 5:30 PM', progress: 15 },
              ].map((student, i) => (
                <div key={i} className="glass p-6 rounded-[2.5rem] border border-white hover:border-primary/20 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{student.name}</h4>
                        <p className="text-xs opacity-40 font-bold uppercase tracking-widest">{student.level} • {student.track}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-primary/10 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span>Learning Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${student.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                        <Calendar className="w-3.5 h-3.5" /> {student.nextClass}
                      </div>
                      <button className="text-xs font-bold text-primary hover:underline underline-offset-4">Open Profile</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Teaching Analytics Placeholder */}
            <div className="glass p-10 rounded-[3rem] border border-primary/5 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Teaching Performance</h3>
                  <p className="text-sm opacity-50 max-w-xs">Your academic impact score and student satisfaction metrics for this month.</p>
                </div>
                <div className="flex gap-10">
                  <div className="text-center">
                    <span className="text-4xl font-black text-primary">24</span>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Active Seats</p>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-black text-secondary">$1.2k</span>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Est. Earnings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherDashboard;
