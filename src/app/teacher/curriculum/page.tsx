import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { BookOpen, GraduationCap, Clock, PlayCircle, Star, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherCurriculumPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'TEACHER') {
    redirect('/auth/login');
  }

  // Fetch teacher and their profiles/classes
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teacherProfile: {
        include: {
          classes: {
            include: {
              students: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user || !user.teacherProfile) {
    return <div className="p-10 text-center">Profile not found. Please contact support.</div>;
  }

  // Default syllabus modules for reference
  const referenceSyllabus = [
    {
      title: "Riwayah Hafs Track",
      modules: [
        { name: "Module 1: Introductory Tajweed & Makharij", lessons: 4 },
        { name: "Module 2: Rules of Noon Sakinah & Tanween", lessons: 5 },
        { name: "Module 3: Rules of Meem Sakinah & Madd", lessons: 6 }
      ]
    },
    {
      title: "Riwayah Warsh Track",
      modules: [
        { name: "Module 1: Warsh Principles & Madd Elongation", lessons: 5 },
        { name: "Module 2: Rules of Al-Naql & Al-Sila", lessons: 4 },
        { name: "Module 3: Vocal inclination (Taqlil)", lessons: 5 }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Teaching Curriculum</h1>
              <p className="text-slate-500 font-medium">Manage your active classes, check student milestones, and view syllabus structures.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content: Active Student Classes */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Your Active Student Rosters
              </h3>

              {user.teacherProfile.classes.length === 0 ? (
                /* Pre-seeded demo class box if DB is empty */
                <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Zaid Ahmad</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 mt-1">Class Type: Individual Hifz</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4 border-y border-slate-50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Current Track</span>
                      <p className="text-sm font-bold text-slate-800">Riwayah Hafs</p>
                    </div>
                    <div className="space-y-1 border-x border-slate-50 px-6">
                      <span className="text-[10px] font-black uppercase text-slate-400">Next Lesson</span>
                      <p className="text-sm font-bold text-primary">Al-Baqarah: 154</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Target Level</span>
                      <p className="text-sm font-bold text-slate-800">Intermediate</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Link 
                      href="/classroom?role=teacher" 
                      className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <PlayCircle className="w-4.5 h-4.5" /> Start Live Classroom
                    </Link>
                  </div>
                </div>
              ) : (
                user.teacherProfile.classes.map((cls) => (
                  <div key={cls.id} className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-black text-slate-900">
                          {cls.students.map(s => s.user.name).join(', ') || 'Anonymous Class'}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 mt-1">Class Type: {cls.type}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-6 py-4 border-y border-slate-50">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400">Current Track</span>
                        <p className="text-sm font-bold text-slate-800">Riwayah {cls.riwayah}</p>
                      </div>
                      <div className="space-y-1 border-x border-slate-50 px-6">
                        <span className="text-[10px] font-black uppercase text-slate-400">Target Level</span>
                        <p className="text-sm font-bold text-slate-800">{cls.level}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400">Schedule</span>
                        <p className="text-sm font-bold text-slate-800">Mon 10:00 AM</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Link 
                        href="/classroom?role=teacher" 
                        className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        <PlayCircle className="w-4.5 h-4.5" /> Start Live Classroom
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Content: Syllabus Reference Lists */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Track Syllabi
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-normal">
                  Standardized curriculum units you can assign to your students.
                </p>

                <div className="space-y-6">
                  {referenceSyllabus.map((track, trackIdx) => (
                    <div key={trackIdx} className="space-y-3 pt-4 border-t border-slate-50 first:border-0 first:pt-0">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">{track.title}</h4>
                      <div className="space-y-2">
                        {track.modules.map((mod, modIdx) => (
                          <div key={modIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 truncate max-w-[200px]">{mod.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold shrink-0">{mod.lessons} lessons</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
