'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Search, Filter, Clock, Award, Users } from 'lucide-react';
import EnrollStudentModal from './EnrollStudentModal';

interface StudentData {
  id: string;
  name: string | null;
  email: string;
  studentProfile: {
    id: string;
    currentLevel: string | null;
    targetRiwayah: string | null;
    totalMinutes: number;
  } | null;
}

interface AdminStudentDirectoryClientProps {
  initialStudents: StudentData[];
}

export default function AdminStudentDirectoryClient({ initialStudents }: AdminStudentDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const filteredStudents = initialStudents.filter((student) => {
    const matchesSearch =
      (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.studentProfile?.targetRiwayah || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === 'ALL' ||
      (student.studentProfile?.currentLevel || 'Beginner').toUpperCase() === selectedLevel.toUpperCase();

    return matchesSearch && matchesLevel;
  });

  return (
    <>
      {/* Header section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span className="opacity-40">/</span>
            <span>Student Directory</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">Student Registry</h1>
          <p className="text-slate-500 font-medium">Manage, audit, and directly onboard active school students.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-100 pl-12 pr-6 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 w-64 md:w-80 text-sm font-medium transition-all"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-white border border-slate-100 px-4 py-3.5 rounded-2xl text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 transition-all"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Enroll Student
          </button>
        </div>
      </header>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudents.length === 0 ? (
          <div className="col-span-3 border-2 border-dashed border-slate-200 bg-white/50 rounded-[2.5rem] p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-700">No students match your criteria.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Enroll Student&quot; above to onboard your first student into your school roster.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const profile = student.studentProfile;
            const hours = profile ? Math.round(profile.totalMinutes / 60) : 0;

            return (
              <div
                key={student.id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all flex flex-col"
              >
                <div className="p-8 pb-4 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-xl">
                      {(student.name || 'S')[0]}
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        profile?.currentLevel === 'Advanced'
                          ? 'bg-indigo-50 text-indigo-600'
                          : profile?.currentLevel === 'Intermediate'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {profile?.currentLevel || 'Beginner'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{student.name || 'Anonymous Student'}</h3>
                    <p className="text-[10px] font-bold text-slate-400 truncate">{student.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-lg">
                      {profile?.targetRiwayah || 'Hafs'} Track
                    </span>
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 mt-auto border-t border-slate-50 grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Hours
                    </p>
                    <p className="font-black text-slate-900 text-sm">{hours} hrs</p>
                  </div>
                  <div className="space-y-1 border-l border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Points
                    </p>
                    <p className="font-black text-slate-900 text-sm">{profile ? profile.totalMinutes * 10 : 0}</p>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <Link
                    href="/admin/finances"
                    className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                  >
                    Audit Payments
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Enroll Student Modal */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </>
  );
}
