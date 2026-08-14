import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import TeacherAttendanceClient from '@/components/dashboard/TeacherAttendanceClient';

export default async function TeacherAttendancePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'PARENT') redirect('/parent');
  }

  // Fetch teacher's profile along with classes and students
  const teacher = await prisma.user.findUnique({
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

  if (!teacher || !teacher.teacherProfile) {
    return <div className="p-10 text-center font-sans text-slate-500">Teacher profile not found. Please contact administration.</div>;
  }

  // Format classes database model for frontend ease
  const classesData = teacher.teacherProfile.classes.map(cls => ({
    id: cls.id,
    type: cls.type,
    riwayah: cls.riwayah,
    level: cls.level,
    schedule: cls.schedule,
    students: cls.students.map(s => ({
      id: s.id,
      name: s.user.name || 'Student',
      email: s.user.email,
      currentLevel: s.currentLevel
    }))
  }));

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={teacher} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="space-y-1 font-sans">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Attendance Register</h1>
            <p className="text-slate-500 font-medium">Mark class attendance logs. Students and parents receive immediate updates.</p>
          </div>

          <TeacherAttendanceClient initialClasses={classesData} />
        </div>
      </main>
    </div>
  );
}
