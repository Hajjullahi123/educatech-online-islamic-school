import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { Users, BookOpen, Clock, Award, Star, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function AdminStudentDirectory() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  // Fetch all students from the database
  const students = await prisma.user.findMany({
    where: { type: 'STUDENT' },
    include: {
      studentProfile: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          {/* Header section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                <Link href="/admin" className="hover:underline">Dashboard</Link>
                <span className="opacity-40">/</span>
                <span>Student Directory</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900">Student Registry</h1>
              <p className="text-slate-500 font-medium">Manage and audit our active student enrollment files.</p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="bg-white border border-slate-100 pl-12 pr-6 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 w-80 text-sm font-medium transition-all"
                />
              </div>
              <button className="flex items-center gap-2 bg-white border border-slate-100 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </header>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.length === 0 ? (
              <div className="col-span-3 border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center text-slate-400">
                No students registered yet. Try seeding the database!
              </div>
            ) : (
              students.map((student) => {
                const profile = student.studentProfile;
                const hours = profile ? Math.round(profile.totalMinutes / 60) : 0;
                
                return (
                  <div key={student.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all flex flex-col">
                    <div className="p-8 pb-4 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-xl">
                          {(student.name || 'S')[0]}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          profile?.currentLevel === 'Advanced' ? 'bg-indigo-50 text-indigo-600' :
                          profile?.currentLevel === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
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
                        <p className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-1"><Clock className="w-3.5 h-3.5" /> Hours</p>
                        <p className="font-black text-slate-900 text-sm">{hours} hrs</p>
                      </div>
                      <div className="space-y-1 border-l border-slate-100">
                        <p className="text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-1"><Award className="w-3.5 h-3.5" /> Points</p>
                        <p className="font-black text-slate-900 text-sm">{profile ? profile.totalMinutes * 10 : 0}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                      <Link 
                        href={`/admin/finances`}
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
        </div>
      </main>
    </div>
  );
}
