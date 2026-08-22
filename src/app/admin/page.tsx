import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  Users,
  GraduationCap,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  TrendingUp,
  LayoutDashboard,
  School
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'ADMIN') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'TEACHER') redirect('/teacher');
  }

  // Real aggregate data from database
  const [studentCount, teacherCount, applicationCount] = await Promise.all([
    prisma.user.count({ where: { type: 'STUDENT' } }),
    prisma.user.count({ where: { type: 'TEACHER' } }),
    prisma.application.count({ where: { status: 'PENDING' } }),
  ]);

  const stats = [
    { label: 'Total Students', value: studentCount.toString(), icon: <Users className="w-6 h-6" />, color: 'sky' as const },
    { label: 'Verified Teachers', value: teacherCount.toString(), icon: <GraduationCap className="w-6 h-6" />, color: 'emerald' as const },
    { label: 'Pending Apps', value: applicationCount.toString(), icon: <Activity className="w-6 h-6" />, color: 'amber' as const },
    { label: 'Monthly Revenue', value: '$12,450', icon: <DollarSign className="w-6 h-6" />, color: 'purple' as const },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Executive Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">AdminHub Console</h1>
              <p className="text-slate-500 font-medium">Academy performance and oversight dashboard.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/register-school"
                className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-all"
              >
                <School className="w-4 h-4" /> Register New School
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Application Queue (Real-ish) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black">Priority Review Queue</h3>
                  <Link href="/admin/applications" className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all">View All Applications</Link>
                </div>

                <div className="p-4 space-y-4">
                  {[
                    { name: 'Dr. Yusuf Mansour', type: 'Teacher', track: 'Warsh Master', time: '20m ago', id: 'APP-901' },
                    { name: 'Sarah Al-Amin', type: 'Student', track: 'Foundation', time: '1h ago', id: 'APP-902' },
                    { name: 'Sheikh Hamza', type: 'Teacher', track: 'Qalun Master', time: '3h ago', id: 'APP-903' },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${app.type === 'Teacher' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                          {app.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{app.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{app.type} • {app.track}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-slate-400">{app.time}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">{app.id}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><XCircle className="w-5 h-5" /></button>
                          <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><CheckCircle className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Health / Feedback */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <h3 className="text-xl font-black">System Health</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="opacity-40">Live Sessions</span>
                      <span className="text-emerald-500">Active</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="opacity-40">Payment Gateway</span>
                      <span className="text-emerald-500">Online</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <h3 className="text-xl font-black relative z-10">Student Feedback</h3>
                <p className="text-emerald-100/60 text-sm font-medium mt-2 relative z-10">"The new virtual classroom interface is absolutely stunning. My Hifz sessions feel more interactive than ever."</p>
                <div className="flex items-center gap-3 mt-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <span className="text-xs font-bold">Ahmed K. — JSS 2</span>
                </div>
                <MessageCircle className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
