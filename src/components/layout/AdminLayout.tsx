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
  ShieldCheck,
  Crown,
  KeyRound,
  DollarSign,
  ScrollText,
  Sliders,
  Award,
  Layers,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, isSuperAdmin } = useAuth();
  const isSuperAdminRoute = location.pathname.startsWith('/super-admin');

  const superAdminNav = [
    { label: 'Executive Terminal', href: '/super-admin', icon: <Crown className="w-4 h-4 text-amber-500" /> },
    { label: 'RBAC & Permissions', href: '/super-admin/rbac', icon: <KeyRound className="w-4 h-4 text-purple-500" /> },
    { label: 'User & Admin Ops', href: '/super-admin/users', icon: <Users className="w-4 h-4 text-blue-500" /> },
    { label: 'Global Audit Logs', href: '/super-admin/audit', icon: <ScrollText className="w-4 h-4 text-emerald-500" /> },
    { label: 'Security & SSO', href: '/super-admin/security', icon: <ShieldCheck className="w-4 h-4 text-rose-500" /> },
    { label: 'Global Finance & Stripe', href: '/super-admin/finance', icon: <DollarSign className="w-4 h-4 text-amber-500" /> },
    { label: 'Platform & Tenants', href: '/super-admin/settings', icon: <Sliders className="w-4 h-4 text-cyan-500" /> },
  ];

  const adminNav = [
    { label: 'Department Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4 text-blue-500" /> },
    { label: 'Course CMS & Review', href: '/admin/courses', icon: <BookOpen className="w-4 h-4 text-emerald-500" /> },
    { label: 'Student Management', href: '/admin/students', icon: <Users className="w-4 h-4 text-cyan-500" /> },
    { label: 'Cohorts & Batches', href: '/admin/cohorts', icon: <Layers className="w-4 h-4 text-indigo-500" /> },
    { label: 'Career Board Approvals', href: '/admin/career', icon: <Briefcase className="w-4 h-4 text-orange-500" /> },
    { label: 'Certificates Compliance', href: '/admin/certificates', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { label: 'Department Finance', href: '/admin/finance', icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
    { label: 'Analytics & Reports', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 text-purple-500" /> },
  ];

  const currentNav = isSuperAdminRoute ? superAdminNav : adminNav;

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/super-admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#05070A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Dynamic Subheader */}
      <div className="bg-white dark:bg-[#080D17] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                'p-2 rounded-xl border shadow-sm',
                isSuperAdminRoute
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/80'
              )}
            >
              {isSuperAdminRoute ? <Crown className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {isSuperAdminRoute ? 'TYC Super Administrator Terminal' : 'TYC Department Administration Console'}
                </h2>
                <span
                  className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    isSuperAdminRoute
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                  )}
                >
                  {isSuperAdminRoute ? 'ROOT CLEARANCE' : user?.department || 'OPERATIONS'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isSuperAdminRoute
                  ? 'Platform infrastructure, global RBAC, multi-tenant partitioning, and audit analytics'
                  : 'Course review moderation, student cohort provisioning, and department revenue'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSuperAdmin && !isSuperAdminRoute && (
              <Link
                to="/super-admin"
                className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-full border border-amber-200 dark:border-amber-800/80 transition-colors"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin Terminal</span>
              </Link>
            )}
            {isSuperAdmin && isSuperAdminRoute && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold px-3 py-1.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-full border border-cyan-200 dark:border-cyan-800/80 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold px-3 py-1.5 bg-slate-100 dark:bg-[#0D121F] rounded-full border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
              <span>Student Portal</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm dark:shadow-xl space-y-1 sticky top-24">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isSuperAdminRoute ? 'Super Admin Console' : 'Admin Operations'}
            </div>
            {currentNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive(item.href)
                    ? isSuperAdminRoute
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-sm'
                      : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm'
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
