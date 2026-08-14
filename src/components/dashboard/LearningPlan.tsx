"use client";

import React from 'react';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface LearningPlanProps {
  progress: number;
  track: string;
  nextVerse: string;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ progress, track, nextVerse }) => {
  return (
    <div className="glass bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 w-fit">
            <GraduationCap className="w-4 h-4" /> Current Enrollment
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900">{track}</h2>
            <p className="text-slate-500 font-medium">Next Milestone: <span className="text-primary font-bold">{nextVerse}</span></p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest opacity-40">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
                <div className="absolute top-0 right-0 h-full w-8 bg-white/20 skew-x-12 translate-x-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[240px] flex flex-col gap-4">
          <Link href="/classroom" className="w-full bg-slate-900 text-white p-5 rounded-3xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
            Continue Learning <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/curriculum" className="w-full bg-white border border-slate-100 p-5 rounded-3xl font-black text-sm text-slate-500 hover:bg-slate-50 transition-all text-center">
            View Curriculum
          </Link>
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none pointer-events-none">
        <BookOpen className="w-96 h-96" />
      </div>
    </div>
  );
};

export default LearningPlan;
