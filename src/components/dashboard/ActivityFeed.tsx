"use client";

import React from 'react';
import { Clock, BookOpen, Video, Award } from 'lucide-react';

interface ActivityFeedProps {
  activities: any[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Mock internal if empty
  const mockActivities = [
    { type: 'session', content: 'Completed Quran Recitation Session #12', time: '2 hours ago', icon: Video, color: 'text-emerald-500 bg-emerald-50' },
    { type: 'achievement', content: 'Earned "Tajweed Mastery" Badge', time: 'Yesterday', icon: Award, color: 'text-amber-500 bg-amber-50' },
    { type: 'lesson', content: 'Started Surah Al-Baqarah Lesson 1', time: '3 days ago', icon: BookOpen, color: 'text-sky-500 bg-sky-50' },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70">View All</button>
      </div>

      <div className="space-y-8">
        {displayActivities.map((activity, i) => (
          <div key={i} className="flex gap-4 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-sm ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="py-1">
              <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors cursor-pointer">{activity.content}</p>
              <div className="flex items-center gap-2 mt-1 underline-offset-4">
                <Clock className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
