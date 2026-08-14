import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import LearningPlan from '@/components/dashboard/LearningPlan';
import CalendarComponent from '@/components/Calendar';
import { BookOpen, Video, Trophy, Clock } from 'lucide-react';

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'STUDENT') {
    // Check if user is teacher and redirect if so
    if (session.user.role === 'TEACHER') redirect('/teacher');
    if (session.user.role === 'ADMIN') redirect('/admin');
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: {
        include: {
          classes: true
        }
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) {
    return <div className="p-10 text-center">User not found. Please contact support.</div>;
  }

  // Create student profile on the fly if it is missing
  if (!user.studentProfile) {
    const app = await prisma.application.findFirst({
      where: { userId: session.user.id, type: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
    });
    let targetRiwayah = 'Hafs';
    let learningGoals = '';
    if (app) {
      try {
        const data = JSON.parse(app.submittedData);
        targetRiwayah = data.riwayahPreference || 'Hafs';
        learningGoals = data.experience || '';
      } catch (e) {}
    }
    await prisma.studentProfile.create({
      data: {
        userId: session.user.id!,
        currentLevel: 'Beginner',
        targetRiwayah,
        learningGoals,
        totalMinutes: 0,
      },
    });

    // Re-fetch user with profile
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentProfile: {
          include: {
            classes: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  }

  // Double check in case of database issues
  if (!user || !user.studentProfile) {
    return <div className="p-10 text-center">Profile not found. Please contact support.</div>;
  }

  const stats = [
    { label: 'Total Learning', value: `${Math.round(user.studentProfile.totalMinutes / 60)}h`, icon: <Clock className="w-6 h-6" />, color: 'emerald' as const },
    { label: 'Current Level', value: user.studentProfile.currentLevel || 'N/A', icon: <BookOpen className="w-6 h-6" />, color: 'amber' as const },
    { label: 'Live Sessions', value: user.studentProfile.classes.length.toString(), icon: <Video className="w-6 h-6" />, color: 'sky' as const },
    { label: 'Knowledge Points', value: (user.studentProfile.totalMinutes * 10).toString(), icon: <Trophy className="w-6 h-6" />, color: 'purple' as const },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="STUDENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Assalamu Alaikum, {user.name}</h1>
            <p className="text-slate-500 font-medium">Ready to continue your journey with the Words of Allah?</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Learning Progress & Calendar */}
            <div className="lg:col-span-8 space-y-8">
              <LearningPlan progress={85} track="Riwayah Hafs" nextVerse="Al-Baqarah: 154" />
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black mb-6">Academic Schedule</h3>
                <CalendarComponent />
              </div>
            </div>

            {/* Right Column: Activity & Quick Links */}
            <div className="lg:col-span-4 space-y-8">
              <ActivityFeed activities={[]} />

              {/* Virtual Classroom Direct Access */}
              <div className="bg-primary p-8 rounded-[2.5rem] text-white space-y-4 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-black">Virtual Classroom</h3>
                  <p className="text-emerald-100/70 text-sm font-medium mb-6">Your next session starts in 15 minutes.</p>
                  <a href="/classroom" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all">
                    Enter Studio <Video className="w-4 h-4" />
                  </a>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-40 h-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
