"use client";

import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  LogOut,
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings2,
  Users,
  GraduationCap,
  School
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTenant } from '@/context/TenantContext';

interface SidebarProps {
  userType: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PARENT';
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const pathname = usePathname();
  const { tenant } = useTenant();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: userType === 'STUDENT' ? '/dashboard' : (userType === 'ADMIN' ? '/admin' : (userType === 'TEACHER' ? '/teacher' : '/parent')) },
    { name: 'Assignments', icon: ClipboardList, path: '/dashboard/assignments', roles: ['STUDENT'] },
    { name: 'Curriculum', icon: BookOpen, path: userType === 'STUDENT' ? '/dashboard/curriculum' : (userType === 'TEACHER' ? '/teacher/curriculum' : '#'), roles: ['STUDENT', 'TEACHER'] },
    { name: 'Classroom', icon: Calendar, path: '/classroom', roles: ['STUDENT', 'TEACHER'] },
    { name: 'Gradebook', icon: Award, path: '/teacher/gradebook', roles: ['TEACHER'] },
    { name: 'Attendance', icon: ClipboardList, path: '/teacher/attendance', roles: ['TEACHER'] },
    { name: 'Messages', icon: MessageSquare, path: userType === 'STUDENT' ? '/dashboard/messages' : (userType === 'ADMIN' ? '/admin/messages' : (userType === 'TEACHER' ? '/teacher/messages' : '#')), roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Achievements', icon: Award, path: '/dashboard/achievements', roles: ['STUDENT'] },
    { name: 'Students', icon: Users, path: '/admin/students', roles: ['ADMIN'] },
    { name: 'Teachers', icon: GraduationCap, path: '/admin/teachers', roles: ['ADMIN'] },
    { name: 'Register School', icon: School, path: '/register-school', roles: ['ADMIN'] },
    { name: 'Applications', icon: ClipboardList, path: '/admin/applications', roles: ['ADMIN'] },
    { name: 'Financial Ledger', icon: DollarSign, path: '/admin/finances', roles: ['ADMIN'] },
    { name: 'Dynamic Pricing', icon: Settings2, path: '/admin/pricing', roles: ['ADMIN'] },
    { name: 'Settings', icon: Settings2, path: userType === 'STUDENT' ? '/dashboard/settings' : (userType === 'ADMIN' ? '/admin/settings' : (userType === 'TEACHER' ? '/teacher/settings' : '#')), roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col h-screen shrink-0 relative z-20">
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          {tenant.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="w-9 h-9 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0 border border-amber-500/20"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 truncate">
              {tenant.name}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold">
              Portal
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 font-sans">
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(userType)) return null;

          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-primary'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`} />
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto border-t border-slate-50 space-y-6">
        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 font-sans">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Next Milestone</p>
          <div className="h-2 bg-emerald-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary" style={{ width: '65%' }} />
          </div>
          <p className="text-[10px] font-bold text-emerald-700">65% of Surah Al-Kahf</p>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
