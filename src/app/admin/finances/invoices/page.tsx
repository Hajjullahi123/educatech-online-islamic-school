import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AdminInvoicesClient from '@/components/dashboard/AdminInvoicesClient';

export default async function AdminInvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'ADMIN') {
    if (session.user.role === 'STUDENT') redirect('/dashboard');
    if (session.user.role === 'TEACHER') redirect('/teacher');
    if (session.user.role === 'PARENT') redirect('/parent');
  }

  // Fetch all payment receipts
  const payments = await prisma.payment.findMany({
    include: {
      user: {
        include: {
          studentProfile: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Format payments database schema for frontend rendering
  const invoices = payments.map(p => ({
    id: p.id,
    userId: p.userId,
    userName: p.user.name || 'Student',
    userEmail: p.user.email,
    amount: p.amount,
    status: p.status,
    gatewayResponse: p.gatewayResponse,
    invoiceUrl: p.invoiceUrl,
    createdAt: p.createdAt.toISOString(),
    track: p.user.studentProfile?.currentLevel || 'Intensive'
  }));

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <div className="print:hidden">
        <Sidebar userType="ADMIN" />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden print:p-0">
        <div className="print:hidden">
          <Header user={session.user} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar print:overflow-visible print:p-0">
          <div className="space-y-1 font-sans print:hidden">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Tuition Invoice Manager</h1>
            <p className="text-slate-500 font-medium">Verify payments, download transaction receipts, and print certified educational invoices.</p>
          </div>

          <AdminInvoicesClient invoices={invoices} />
        </div>
      </main>
    </div>
  );
}
