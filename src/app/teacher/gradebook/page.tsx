import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import TeacherGradebookClient from '@/components/dashboard/TeacherGradebookClient';

export default async function TeacherGradebookPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'PARENT') redirect('/parent');
  }

  // Fetch teacher's profile along with all classes and students
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

  // Get unique students list
  const studentsMap = new Map<string, { id: string; name: string; email: string; currentLevel: string | null }>();

  teacher.teacherProfile.classes.forEach(cls => {
    cls.students.forEach(student => {
      studentsMap.set(student.id, {
        id: student.id,
        name: student.user.name || 'Student',
        email: student.user.email,
        currentLevel: student.currentLevel
      });
    });
  });

  const uniqueStudents = Array.from(studentsMap.values());

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="TEACHER" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={teacher} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="space-y-1 font-sans">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Academic Gradebook</h1>
            <p className="text-slate-500 font-medium">Log evaluation scores and academic notes for students in your tracks.</p>
          </div>

          <TeacherGradebookClient students={uniqueStudents} />
        </div>
      </main>
    </div>
  );
}
