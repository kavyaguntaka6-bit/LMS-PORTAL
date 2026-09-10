import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLMS } from '../../context/LMSContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home,
  Compass,
  Code2,
  Terminal,
  FolderGit2,
  Users2,
  FileText,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  Award,
  LogOut,
  User as UserIcon,
  Search,
  Menu,
  X,
  Crown,
  ShieldCheck,
  GraduationCap,
  KeyRound,
  Users,
  ScrollText,
  DollarSign,
  Sliders,
  BookOpen,
  Layers,
  Briefcase,
  BarChart3,
  FileCheck
} from 'lucide-react';
import { BrandLogo } from '../shared/BrandLogo';
import { clsx } from 'clsx';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { setIsOpen: setNotifOpen } = useNotifications();
  const { setIsAiTutorOpen, setIsSearchOpen } = useLMS();
  const { effectiveTheme, toggleTheme } = useTheme();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current active role viewport
  const isSuperAdminView =
    user?.role === 'superadmin' ||
    user?.role === 'owner' ||
    location.pathname.startsWith('/super-admin');

  const isAdminView =
    !isSuperAdminView &&
    (user?.role === 'admin' || location.pathname.startsWith('/admin'));

  const isInstructorView =
    !isSuperAdminView &&
    !isAdminView &&
    (user?.role === 'instructor' || location.pathname.startsWith('/instructor'));

  // Super Admin Navigation Items (Tailored specifically for Super Admin)
  const superAdminNavItems = [
    { label: 'Executive Terminal', href: '/super-admin', icon: Crown },
    { label: 'RBAC & Roles', href: '/super-admin/rbac', icon: KeyRound },
    { label: 'User & Admin Ops', href: '/super-admin/users', icon: Users },
    { label: 'Global Audit Logs', href: '/super-admin/audit', icon: ScrollText },
    { label: 'Security & SSO', href: '/super-admin/security', icon: ShieldCheck },
    { label: 'Global Finance', href: '/super-admin/finance', icon: DollarSign },
    { label: 'Platform Settings', href: '/super-admin/settings', icon: Sliders },
  ];

  // Admin Navigation Items
  const adminNavItems = [
    { label: 'Department Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Course CMS', href: '/admin/courses', icon: BookOpen },
    { label: 'Student Management', href: '/admin/students', icon: Users },
    { label: 'Cohorts & Batches', href: '/admin/cohorts', icon: Layers },
    { label: 'Career Board', href: '/admin/career', icon: Briefcase },
    { label: 'Certificates', href: '/admin/certificates', icon: Award },
    { label: 'Department Finance', href: '/admin/finance', icon: DollarSign },
    { label: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
  ];

  // Instructor Navigation Items
  const instructorNavItems = [
    { label: 'Faculty Hub', href: '/instructor', icon: LayoutDashboard },
    { label: 'Submissions & Grading', href: '/instructor/submissions', icon: FileCheck },
    { label: 'Assigned Students', href: '/instructor/students', icon: Users },
    { label: 'Resource Overrides', href: '/instructor/overrides', icon: KeyRound },
    { label: 'Course Catalog', href: '/courses', icon: BookOpen },
  ];

  // Student Navigation Items
  const studentNavItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/courses', icon: Compass },
    { label: 'Practice', href: '/practice', icon: Code2 },
    { label: 'Coding Lab', href: '/coding', icon: Terminal },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Community', href: '/community', icon: Users2 },
    { label: 'Documentation', href: '/learning-paths', icon: FileText },
  ];

  // Select current navigation set based on role context
  const navItems = isSuperAdminView
    ? superAdminNavItems
    : isAdminView
    ? adminNavItems
    : isInstructorView
    ? instructorNavItems
    : studentNavItems;

  const brandHomeHref = isSuperAdminView
    ? '/super-admin'
    : isAdminView
    ? '/admin'
    : isInstructorView
    ? '/instructor'
    : '/';

  const isNavActive = (href: string) => {
    if (
      href === '/' ||
      href === '/super-admin' ||
      href === '/admin' ||
      href === '/instructor'
    ) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] mx-auto transition-all duration-300">
      {/* Subdued Elegant Border Frame */}
      <div className="tyc-rainbow-border transition-all duration-300">
        {/* Inner Clean White / Dark Obsidian Container */}
        <div className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl rounded-[32px] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] transition-colors duration-200">
          
          {/* LEFT: TYC Logo & Role Badge */}
          <div className="relative flex items-center gap-2.5 shrink-0">
            <BrandLogo size="md" href={brandHomeHref} />
            
            {/* Dynamic Role Badge next to brand */}
            {isSuperAdminView && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Crown className="w-3 h-3 text-amber-500" />
                <span>Super Admin</span>
              </span>
            )}
            {isAdminView && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                <span>Admin Console</span>
              </span>
            )}
            {isInstructorView && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                <GraduationCap className="w-3 h-3 text-purple-500" />
                <span>Instructor</span>
              </span>
            )}

            <div className="hidden xl:block h-8 w-[1px] bg-slate-200 dark:bg-slate-700 ml-1" />
          </div>

          {/* CENTER: Navigation items tailored to Super Admin / Admin / Student */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex flex-col items-center justify-center px-1.5 py-0.5 group relative transition-all duration-200"
                >
                  {/* Icon with Role Accent */}
                  <div
                    className={clsx(
                      'transition-all duration-200 transform group-hover:scale-110 mb-1',
                      active
                        ? isSuperAdminView
                          ? 'text-amber-500 scale-105'
                          : isAdminView
                          ? 'text-cyan-500 scale-105'
                          : isInstructorView
                          ? 'text-purple-500 scale-105'
                          : 'text-[#10B981] scale-105'
                        : isSuperAdminView
                        ? 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                        : isAdminView
                        ? 'text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                        : isInstructorView
                        ? 'text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-[#047857] dark:group-hover:text-[#10B981]'
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] stroke-[2]" />
                  </div>

                  {/* Nav Label */}
                  <span
                    className={clsx(
                      'text-[11.5px] tracking-tight transition-colors whitespace-nowrap',
                      active
                        ? isSuperAdminView
                          ? 'font-bold text-amber-600 dark:text-amber-400'
                          : isAdminView
                          ? 'font-bold text-cyan-600 dark:text-cyan-400'
                          : isInstructorView
                          ? 'font-bold text-purple-600 dark:text-purple-400'
                          : 'font-bold text-[#10B981]'
                        : isSuperAdminView
                        ? 'text-slate-600 dark:text-slate-300 font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400'
                        : isAdminView
                        ? 'text-slate-600 dark:text-slate-300 font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                        : isInstructorView
                        ? 'text-slate-600 dark:text-slate-300 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400'
                        : 'text-slate-600 dark:text-slate-300 font-medium group-hover:text-[#047857] dark:group-hover:text-[#10B981]'
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator Underline Bar */}
                  {active && (
                    <div
                      className={clsx(
                        'h-[2px] w-6 rounded-full mt-1',
                        isSuperAdminView
                          ? 'bg-amber-500 shadow-[0_1px_4px_rgba(245,158,11,0.5)]'
                          : isAdminView
                          ? 'bg-cyan-500 shadow-[0_1px_4px_rgba(6,182,212,0.5)]'
                          : isInstructorView
                          ? 'bg-purple-500 shadow-[0_1px_4px_rgba(168,85,247,0.5)]'
                          : 'bg-[#10B981] shadow-[0_1px_4px_rgba(16,185,129,0.4)]'
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Search, AI Tutor Button, Notification Bell, Theme Switcher, Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Search Quick Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all shadow-xs hover:scale-105 cursor-pointer"
              title="Search Platform"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* AI Tutor Compact Symbol Button */}
            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all shadow-xs hover:scale-105 active:scale-95 group cursor-pointer"
              title="Open AI Tutor & Copilot"
              aria-label="Open AI Tutor"
            >
              <img src="/ai-copilot-robot.png" alt="TYC AI Tutor" className="w-5 h-5 object-contain rounded-full pointer-events-none" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
            </button>

            {/* Notification Bell with Functional Red Dot */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2.1]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#DC2626]" />
            </button>

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-amber-400 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xs cursor-pointer"
              title={`Switch to ${effectiveTheme === 'dark' ? 'Bright' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Profile Dropdown (Super Admin / Admin / Student Context) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={clsx(
                  'flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-200 group cursor-pointer shadow-sm hover:shadow',
                  isSuperAdminView
                    ? 'border-amber-400/80 bg-amber-500/10 hover:border-amber-500 text-amber-600 dark:text-amber-300'
                    : 'border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#161F30] text-slate-900 dark:text-white'
                )}
              >
                {/* Avatar */}
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={user?.name || "User"}
                  className={clsx(
                    "w-6 h-6 rounded-full object-cover border",
                    isSuperAdminView ? "border-amber-400" : "border-slate-200 dark:border-slate-600"
                  )}
                />
                
                <span className="font-bold text-[12.5px] hidden sm:inline">
                  {user ? (user.role === 'superadmin' || user.role === 'owner' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student') : 'Student'}
                </span>
                
                <ChevronDown className={clsx("w-3.5 h-3.5 text-slate-400 dark:text-slate-400 transition-transform duration-200", profileDropdownOpen && "rotate-180")} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl dark:shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="truncate pr-1">{user?.name || (isSuperAdminView ? 'HCS Kolluru (Super Admin)' : 'Student')}</span>
                      <span
                        className={clsx(
                          'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0',
                          isSuperAdminView
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        )}
                      >
                        {user?.role || (isSuperAdminView ? 'superadmin' : 'student')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user?.email || (isSuperAdminView ? 'hcskolluru@gmail.com' : 'student@trayayukti.com')}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {/* Super Admin Links */}
                    {(user?.role === 'superadmin' || user?.role === 'owner' || isSuperAdminView) && (
                      <>
                        <Link
                          to="/super-admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold transition-colors"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span>Super Admin Terminal</span>
                        </Link>
                        <Link
                          to="/super-admin/audit"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                        >
                          <ScrollText className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Security & Audit Logs</span>
                        </Link>
                      </>
                    )}

                    {/* Admin Link */}
                    {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'owner') && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 font-semibold transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    {/* Instructor Link */}
                    {(user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'owner') && (
                      <Link
                        to="/instructor"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-semibold transition-colors"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                        <span>Instructor Portal</span>
                      </Link>
                    )}

                    {/* Student Dashboard */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      to="/student/portfolio"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-cyan-500" />
                      <span>My Portfolio</span>
                    </Link>

                    <Link
                      to="/certificates"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Certificates</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 dark:bg-[#0D121F]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all',
                    active
                      ? isSuperAdminView
                        ? 'bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400'
                        : isAdminView
                        ? 'bg-cyan-500/10 font-bold text-cyan-600 dark:text-cyan-400'
                        : isInstructorView
                        ? 'bg-purple-500/10 font-bold text-purple-600 dark:text-purple-400'
                        : 'bg-slate-100 dark:bg-slate-800 font-bold text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  )}
                >
                  <Icon
                    className={clsx(
                      'w-5 h-5',
                      active
                        ? isSuperAdminView
                          ? 'text-amber-500'
                          : isAdminView
                          ? 'text-cyan-500'
                          : isInstructorView
                          ? 'text-purple-500'
                          : 'text-emerald-500'
                        : 'text-slate-500'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
