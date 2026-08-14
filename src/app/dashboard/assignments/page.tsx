import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AssignmentsList from '@/components/dashboard/AssignmentsList';

export default async function AssignmentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
    if (session.user.role === 'TEACHER') redirect('/teacher');
    if (session.user.role === 'PARENT') redirect('/parent');
  }

  // Fetch student profile based on session
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: {
        include: {
          assignments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  if (!student || !student.studentProfile) {
    return <div className="p-10 text-center font-sans text-slate-500">Student profile not found. Please contact administration.</div>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="STUDENT" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={student} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          <div className="space-y-1 font-sans">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Quran Recitation Assignments</h1>
            <p className="text-slate-500 font-medium">Record your Quran recitations and submit them for feedback from your Sheikh.</p>
          </div>

          <AssignmentsList initialAssignments={student.studentProfile.assignments} />
        </div>
      </main>
    </div>
  );
}
