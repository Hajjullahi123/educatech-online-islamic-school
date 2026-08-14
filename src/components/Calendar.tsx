"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarComponent = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-primary/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm text-foreground/80">{currentMonth} {currentYear}</h3>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map((day, i) => (
          <span key={i} className="text-[10px] font-black uppercase tracking-[2px] opacity-30">{day}</span>
        ))}

        {/* Placeholder for days */}
        {[...Array(31)].map((_, i) => (
          <div key={i} className="relative group">
            <span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-pointer ${i + 1 === date.getDate() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/5 text-foreground/60'}`}>
              {i + 1}
            </span>
            {(i === 12 || i === 15 || i === 20) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-primary rounded-full mt-1" />
          <div>
            <p className="text-xs font-bold">10:00 AM - Hifz Session</p>
            <p className="text-[10px] opacity-50 font-medium">with Sheikh Omar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
