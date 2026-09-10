import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';
import { NotificationDrawer } from '../navigation/NotificationDrawer';
import { AITutorDrawer } from '../navigation/AITutorDrawer';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Award,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  KeyRound,
  Video,
  BarChart3,
  Building2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

export const InstructorLayout: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const instructorNav = [
    { label: 'Faculty Dashboard', href: '/instructor', icon: <LayoutDashboard className="w-4 h-4 text-emerald-500" /> },
    { label: 'Submissions & Grading', href: '/instructor/submissions', icon: <FileCheck className="w-4 h-4 text-purple-500" /> },
    { label: 'Assigned Students', href: '/instructor/students', icon: <Users className="w-4 h-4 text-blue-500" /> },
    { label: 'Resource Overrides', href: '/instructor/overrides', icon: <KeyRound className="w-4 h-4 text-amber-500" /> },
    { label: 'Course Catalog & Syllabus', href: '/courses', icon: <BookOpen className="w-4 h-4 text-cyan-500" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/instructor') return location.pathname === '/instructor';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#05070A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Instructor Subheader */}
      <div className="bg-white dark:bg-[#080D17] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">TYC Instructor & Grading Portal</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                  {user?.name || 'Instructor'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Curriculum Mentorship, Assignment Reviews & Student Grading</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold px-3 py-1.5 bg-slate-100 dark:bg-[#0D121F] rounded-full border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
            <span>Student Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm dark:shadow-xl space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Instructor Console
            </div>
            {instructorNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive(item.href)
                    ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <AITutorDrawer />
    </div>
  );
};
