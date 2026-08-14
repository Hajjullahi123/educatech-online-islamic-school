import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { BookOpen, CheckCircle2, Lock, PlayCircle, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function CurriculumPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'STUDENT') {
    if (session.user.role === 'TEACHER') redirect('/teacher');
    if (session.user.role === 'ADMIN') redirect('/admin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true
    }
  });

  if (!user) {
    return <div className="p-10 text-center">User not found.</div>;
  }

  const syllabusUnits = [
    {
      title: "Module 1: Introductory Tajweed & Al-Fatihah",
      status: "COMPLETED",
      description: "Foundational articulation points (Makharij), properties of letters, and perfect recitation of Surah Al-Fatihah.",
      lessons: [
        { title: "Introduction to Quranic Phonetics & Makharij", duration: "45 mins", completed: true },
        { title: "Characteristics of Arabic Letters (Sifaat)", duration: "60 mins", completed: true },
        { title: "Surah Al-Fatihah: Precise Articulation", duration: "50 mins", completed: true }
      ]
    },
    {
      title: "Module 2: Rules of Noon Sakinah & Tanween",
      status: "IN_PROGRESS",
      description: "Mastery of Izhar, Idgham, Iqlab, and Ikhfa rules with practical application in Surah Al-Baqarah.",
      lessons: [
        { title: "Izhar Halqi & Noon Sakinah Definition", duration: "50 mins", completed: true },
        { title: "Rules of Idgham (with and without Ghunnah)", duration: "60 mins", completed: true },
        { title: "The Rule of Iqlab (Heart of Tajweed)", duration: "45 mins", completed: false, isNext: true },
        { title: "Ikhfa Haqiqi & Pronunciation Drills", duration: "55 mins", completed: false }
      ]
    },
    {
      title: "Module 3: Rules of Meem Sakinah & Madd",
      status: "LOCKED",
      description: "Mastery of Meem rules and vocal elongations (Madd Natural, Madd Obligatory, Madd Permissible).",
      lessons: [
        { title: "Izhar, Idgham & Ikhfa Shafawi", duration: "65 mins", completed: false },
        { title: "Primary & Secondary Madd (Elongations)", duration: "60 mins", completed: false },
        { title: "Madd Laazim (Compulsory Elongations)", duration: "75 mins", completed: false }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="STUDENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Curriculum Syllabus</h1>
              <p className="text-slate-500 font-medium">Your personalized path to mastering the Riwayah Hafs track.</p>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100/50">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Active Track: Riwayah Hafs
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Content: Syllabus Units */}
            <div className="lg:col-span-2 space-y-6">
              {syllabusUnits.map((unit, unitIdx) => (
                <div 
                  key={unitIdx} 
                  className={`glass bg-white p-8 rounded-[2.5rem] border transition-all ${
                    unit.status === 'IN_PROGRESS' 
                      ? 'border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5' 
                      : 'border-slate-100 shadow-xl shadow-slate-200/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-black text-slate-900">{unit.title}</h3>
                    {unit.status === 'COMPLETED' && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                    {unit.status === 'IN_PROGRESS' && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        In Progress
                      </span>
                    )}
                    {unit.status === 'LOCKED' && (
                      <span className="bg-slate-50 text-slate-400 border border-slate-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{unit.description}</p>

                  <div className="space-y-3">
                    {unit.lessons.map((lesson, lessonIdx) => (
                      <div 
                        key={lessonIdx}
                        className={`flex items-center justify-between p-4 rounded-2xl border ${
                          lesson.isNext 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-slate-50/50 border-slate-100'
                        } ${unit.status === 'LOCKED' ? 'opacity-55' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : lesson.isNext ? (
                            <PlayCircle className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800">{lesson.title}</p>
                            <span className="text-[10px] text-slate-400 font-medium">{lesson.duration}</span>
                          </div>
                        </div>

                        {lesson.isNext && (
                          <Link href="/classroom" className="bg-primary text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Start Next
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Panel: Academic Stats & Tracks overview */}
            <div className="space-y-8">
              {/* Progress Summary Card */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <h3 className="text-lg font-black text-slate-900">Syllabus Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                      <span>Course Progress</span>
                      <span>50% Completed</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-primary" style={{ width: '50%' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-center">
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <span className="block text-2xl font-black text-primary">5</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <span className="block text-2xl font-black text-slate-700">5</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate & Graduation preview */}
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="text-lg font-black leading-snug">Track Ijazah & Certification</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Complete all lessons in this syllabus path and pass the final vocal evaluation to be issued your digital, Shariah-compliant verified Ijazah.
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-115 transition-transform duration-500">
                  <Award className="w-36 h-36 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
