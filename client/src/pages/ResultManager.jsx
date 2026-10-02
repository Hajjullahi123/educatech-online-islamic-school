import React from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, Table, FileText, Download, TrendingUp, BarChart2, ArrowRight, CheckCircle2 } from 'lucide-react';

const ResultManager = () => {
  const HUB_MODULES = [
    {
      title: 'Result Entry & Scoring',
      desc: 'Enter scores for Assignment 1 & 2, Test 1 & 2, and Final Exams with automatic CA computation.',
      icon: FileEdit,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
      link: '/dashboard/result-entry',
      btnText: 'Enter Results'
    },
    {
      title: 'Compiled Broadsheet',
      desc: 'View comprehensive class score sheets, totals, position rankings, and subject breakdowns.',
      icon: Table,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
      link: '/dashboard/broadsheet',
      btnText: 'View Broadsheet'
    },
    {
      title: 'Term Report Cards',
      desc: 'Generate, print, and preview individual student term report cards with teacher & principal comments.',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
      badgeColor: 'bg-blue-100 text-blue-800',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      link: '/dashboard/term-report',
      btnText: 'Generate Reports'
    },
    {
      title: 'Bulk Report Download',
      desc: 'Download all student report cards for a class as a single compiled PDF or batch download.',
      icon: Download,
      color: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400',
      badgeColor: 'bg-amber-100 text-amber-800',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
      link: '/dashboard/bulk-report-download',
      btnText: 'Bulk Download'
    },
    {
      title: 'Cumulative & Promotion Reports',
      desc: 'Review 3-term annual cumulative scores, average grades, and session promotion decisions.',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400',
      badgeColor: 'bg-purple-100 text-purple-800',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
      link: '/dashboard/cumulative-report',
      btnText: 'Cumulative View'
    },
    {
      title: 'Academic Analytics',
      desc: 'Explore performance trends, subject pass rates, and class score distribution analytics.',
      icon: BarChart2,
      color: 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-400',
      badgeColor: 'bg-rose-100 text-rose-800',
      buttonBg: 'bg-rose-600 hover:bg-rose-700',
      link: '/dashboard/analytics',
      btnText: 'View Analytics'
    }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-100 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> System Active & Enhanced
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Results & Assessment Hub
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-medium leading-relaxed">
            Manage student marks, generate class broadsheets, print term report cards, and analyze academic performance across your assigned sections.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HUB_MODULES.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border-2 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 ${mod.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${mod.badgeColor}`}>
                    Module #{idx + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{mod.title}</h3>
                  <p className="text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <Link
                to={mod.link}
                className={`w-full py-3 px-4 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group ${mod.buttonBg}`}
              >
                <span>{mod.btnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultManager;
