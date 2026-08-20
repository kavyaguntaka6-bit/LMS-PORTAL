import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';
import { NotificationDrawer } from '../navigation/NotificationDrawer';
import { AITutorDrawer } from '../navigation/AITutorDrawer';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  BarChart3,
  FileCheck,
  Briefcase,
  Layers,
  Settings,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Course CMS', href: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Students', href: '/admin/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Instructors', href: '/admin/instructors', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Analytics & Reports', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Project Reviews', href: '/admin/projects', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Career Board', href: '/admin/career', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-tyc-bg dark:bg-[#111412] text-tyc-text dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      {/* Admin Subheader */}
      <div className="bg-white dark:bg-[#151916] border-b border-tyc-border dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-tyc-text dark:text-white leading-none">TYC Administration & CMS</h2>
              <span className="text-[11px] text-tyc-muted dark:text-gray-400">Enterprise Platform Governance</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-tyc-muted dark:text-gray-300 hover:text-tyc-text dark:hover:text-white font-medium px-2.5 py-1 bg-tyc-bg dark:bg-gray-800 rounded-lg border border-tyc-border dark:border-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student Portal</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-white dark:bg-[#151916] border border-tyc-border dark:border-gray-800 rounded-xl p-2 shadow-subtle space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-tyc-muted dark:text-gray-400 uppercase tracking-wider">
              Admin Navigation
            </div>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-tyc-green-soft dark:bg-tyc-green/20 text-tyc-green dark:text-green-400 font-semibold'
                    : 'text-tyc-muted dark:text-gray-300 hover:text-tyc-text dark:hover:text-white hover:bg-tyc-bg dark:hover:bg-gray-800'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationDrawer />
      <AITutorDrawer />
    </div>
  );
};
