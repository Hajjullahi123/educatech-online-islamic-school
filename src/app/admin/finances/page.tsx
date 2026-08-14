import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';

export default async function FinancialLedger() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  // Fetch real payment data
  const payments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true
    }
  });

  const stats = [
    { label: 'Total Revenue', value: '$42,850', icon: <DollarSign className="w-6 h-6" />, color: 'emerald' as const },
    { label: 'Active Subs', value: '312', icon: <Users className="w-6 h-6" />, color: 'sky' as const },
    { label: 'Pending Payouts', value: '$3,200', icon: <CreditCard className="w-6 h-6" />, color: 'amber' as const },
    { label: 'Retention Rate', value: '94%', icon: <TrendingUp className="w-6 h-6" />, color: 'purple' as const },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar userType="ADMIN" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">Financial Ledger</h1>
              <p className="text-slate-500 font-medium">Monitoring track revenue and scholar disbursements.</p>
            </div>
            <button className="bg-white border border-slate-100 px-6 py-3 rounded-2xl font-black text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              Generate Report <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black">Incoming Revenue</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Filter className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-8 py-4">Beneficiary</th>
                        <th className="px-8 py-4">Plan</th>
                        <th className="px-8 py-4">Amount</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold">No transactions found.</td>
                        </tr>
                      ) : (
                        payments.map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-all">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{(p.user.name || 'P')[0]}</div>
                                <span className="font-bold text-slate-700">{p.user.name || 'Anonymous'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-slate-500">Specialization Track</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-1 font-black text-slate-900">
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                ${p.amount}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">{p.status}</span>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Scholar Payout Queue */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <h3 className="text-xl font-black">Scholar Payouts</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Sheikh Ibrahim', amount: '$420.00', status: 'Pending' },
                    { name: 'Sheikh Mansour', amount: '$385.00', status: 'Approved' },
                    { name: 'Sheikh Hamza', amount: '$120.00', status: 'Pending' },
                  ].map((pay, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{pay.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{pay.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{pay.amount}</p>
                        <ArrowDownRight className="w-4 h-4 text-rose-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">Batch Process Payouts</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
