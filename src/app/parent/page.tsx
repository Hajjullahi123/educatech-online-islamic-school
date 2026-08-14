import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { Award, Bell, Clock, Calendar, CheckCircle2, DollarSign, Users, ShieldCheck, Download, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default async function ParentPortalDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Ensure role is PARENT or ADMIN
  if (session.user.role !== 'PARENT' && session.user.role !== 'ADMIN') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'TEACHER') redirect('/teacher');
    if (session.user.role === 'ADMIN') redirect('/admin');
  }

  // Fetch Parent profile with linked students
  const parentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      parentProfile: {
        include: {
          students: {
            include: {
              user: true,
              assessments: {
                orderBy: { createdAt: 'desc' }
              },
              attendance: {
                orderBy: { date: 'desc' }
              }
            }
          }
        }
      }
    }
  });

  if (!parentUser || !parentUser.parentProfile) {
    return <div className="p-10 text-center">Parent profile not found. Please contact support.</div>;
  }

  const linkedStudents = parentUser.parentProfile.students;

  // Let's assume the first student is active for display
  const activeStudent = linkedStudents[0];

  if (!activeStudent) {
    return (
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar userType="PARENT" />
        <main className="flex-1 flex flex-col justify-center items-center p-8">
          <GraduationCap className="w-16 h-16 text-slate-300 mb-4" />
          <p className="font-bold text-slate-400">No linked student files found on your Parent account.</p>
        </main>
      </div>
    );
  }

  // Calculate stats
  const totalLearningHours = Math.round(activeStudent.totalMinutes / 60);
  const totalAssessments = activeStudent.assessments.length;
  const attendanceRate = activeStudent.attendance.length > 0
    ? Math.round((activeStudent.attendance.filter(a => a.status === 'PRESENT').length / activeStudent.attendance.length) * 100)
    : 100;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* We pass ADMIN sidebar style for parents since they have similar overview fields */}
      <Sidebar userType="PARENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Parent Portal</h1>
              <p className="text-slate-500 font-medium">Monitoring academic files and progress for child: <span className="text-primary font-bold">{activeStudent.user.name}</span></p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Linked Family Profile
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Learning</p>
                <p className="text-xl font-black text-slate-900">{totalLearningHours} hrs</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Level</p>
                <p className="text-xl font-black text-slate-900">{activeStudent.currentLevel || 'Beginner'}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendance Rate</p>
                <p className="text-xl font-black text-slate-900">{attendanceRate}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Term Evaluations</p>
                <p className="text-xl font-black text-slate-900">{totalAssessments}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Academic Report Cards */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Term Report Cards</h3>
              
              {activeStudent.assessments.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400">
                  No academic report cards issued for this term yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {activeStudent.assessments.map((report) => (
                    <div key={report.id} className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{report.subject}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Evaluated by: {report.teacherName} • {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button className="bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                          <Download className="w-4 h-4" /> Save PDF
                        </button>
                      </div>

                      {/* Grades breakdown progress bars */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-50">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span>Tajweed Makharij</span>
                            <span className="text-slate-700">{report.tajweedScore}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${report.tajweedScore}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span>Hifz Strength</span>
                            <span className="text-slate-700">{report.hifzScore}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${report.hifzScore}%` }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span>Fluency & Tarteel</span>
                            <span className="text-slate-700">{report.fluencyScore}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500" style={{ width: `${report.fluencyScore}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instructor Feedback Remarks</span>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-1">"{report.feedback}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Attendance register review & Tuition billing */}
            <div className="lg:col-span-4 space-y-8">
              {/* Tuition Billing Card */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-slate-900">Tuition Payments</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Balance</span>
                      <p className="text-2xl font-black text-slate-800">₦0.00</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">Paid</span>
                  </div>

                  <Link href="/checkout?planId=cmko10h0b0000y9ued1y01tdb" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider block text-center shadow-lg transition-all">
                    Pre-Pay Term Tuition
                  </Link>
                </div>
              </div>

              {/* Attendance Log list */}
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-slate-900">Attendance Log</h3>
                
                {activeStudent.attendance.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center font-bold">No attendance logs found.</p>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {activeStudent.attendance.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs font-semibold">
                        <span className="text-slate-700">{new Date(log.date).toLocaleDateString()}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                          log.status === 'LATE' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                          'bg-rose-50 text-rose-600 border border-rose-100/50'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
