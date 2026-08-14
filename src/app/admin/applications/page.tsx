import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ApplicationsClientList from '@/components/dashboard/ApplicationsClientList';

export default async function ApplicationsReview() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const applications = await prisma.application.findMany({
    where: { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Date fields to string so they can be serialized to Client Component safely
  const serializedApps = applications.map(app => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    user: {
      id: app.user.id,
      name: app.user.name,
      email: app.user.email
    }
  }));

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">Application Queue</h1>
              <p className="text-slate-500 font-medium">Reviewing pending enrollment and faculty requests in real-time.</p>
            </div>
          </div>

          <ApplicationsClientList initialApplications={serializedApps} />
        </div>
      </main>
    </div>
  );
}
