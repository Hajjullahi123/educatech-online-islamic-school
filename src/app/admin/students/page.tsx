import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AdminStudentDirectoryClient from '@/components/dashboard/AdminStudentDirectoryClient';

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
          <AdminStudentDirectoryClient initialStudents={students} />
        </div>
      </main>
    </div>
  );
}
