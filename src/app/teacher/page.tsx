import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  Users,
  Clock,
  Star,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Video,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default async function TeacherDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'TEACHER') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'ADMIN') redirect('/admin');
  }

  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teacherProfile: {
        include: {
          classes: {
            include: {
              students: true
            }
          }
        }
      }
    }
  });

  if (!teacher || !teacher.teacherProfile) {
    return <div className="p-10 text-center">Teacher profile not found.</div>;
  }

  const uniqueStudentIds = new Set<string>();
  teacher.teacherProfile.classes.forEach(c => {
    c.students.forEach(s => {
      uniqueStudentIds.add(s.id);
    });
  });
  const activeStudentsCount = uniqueStudentIds.size;
  const rating = teacher.teacherProfile.rating;
  const teachingHours = teacher.teacherProfile.classes.length * 15 + 8;

  const stats = [
    { label: 'Active Students', value: activeStudentsCount.toString(), icon: <Users className="w-6 h-6" />, color: 'sky' as const },
    { label: 'Teaching Hours', value: `${teachingHours}h`, icon: <Clock className="w-6 h-6" />, color: 'emerald' as const },
    { label: 'Average Rating', value: rating.toFixed(1), icon: <Star className="w-6 h-6" />, color: 'amber' as const },
    { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-6 h-6" />, color: 'purple' as const },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={teacher} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Welcome & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">Salaam, Sheikh {teacher.name ? (teacher.name.split(' ')[1] || teacher.name) : 'Teacher'}</h1>
              <p className="text-slate-500 font-medium">You have 4 sessions scheduled for today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white border border-slate-100 px-6 py-3 rounded-2xl font-black text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                Manage Schedule <Clock className="w-4 h-4" />
              </button>
              <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                Start New Session <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Student Roster */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black">Active Students</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" placeholder="Search students..." className="bg-slate-50 border-none pl-10 pr-4 py-2 rounded-xl text-xs font-bold w-64" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-8 py-4">Student</th>
                        <th className="px-8 py-4">Track</th>
                        <th className="px-8 py-4">Last Session</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { name: 'Zaid Ahmad', track: 'Hafs Specialization', last: '2h ago', status: 'Online', color: 'bg-emerald-500' },
                        { name: 'Layla Yusuf', track: 'Foundation Hifz', last: 'Yesterday', status: 'Away', color: 'bg-amber-500' },
                        { name: 'Omar Khalid', track: 'Warsh Mastery', last: '3 days ago', status: 'Offline', color: 'bg-slate-300' },
                      ].map((student, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">{student.name[0]}</div>
                              <span className="font-bold text-slate-700">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium text-slate-500">{student.track}</td>
                          <td className="px-8 py-6 text-sm font-medium text-slate-500">{student.last}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${student.color}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{student.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button className="p-2 hover:bg-white rounded-lg transition-all"><MoreVertical className="w-5 h-5 text-slate-300" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-slate-50/50 text-center">
                  <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all">View All 24 Students</button>
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Teaching Score</h3>
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black">4.92</span>
                      <span className="text-emerald-400 text-sm font-bold mb-1">Top 1%</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Your teaching performance is consistently high. Keep up the excellent work with the Riwayah Hafs track!</p>
                  </div>
                  <button className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-black text-sm transition-all border border-white/10">View Detailed Reports</button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <TrendingUp className="w-48 h-48" />
                </div>
              </div>

              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <h3 className="text-xl font-black mb-6">Internal Notes</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-1">Upcoming Exam Week</p>
                    <p className="text-[10px] text-slate-400 font-medium">Prepare Al-Baqarah assessments for 5 students by Monday.</p>
                  </div>
                  <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 font-bold text-sm hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Quick Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
