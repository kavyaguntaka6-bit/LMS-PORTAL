import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { RoleSwitcher } from '../navigation/RoleSwitcher';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Award,
  Sun,
  Moon
} from 'lucide-react';
import { BrandLogo } from '../shared/BrandLogo';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { setIsSearchOpen, setIsAiTutorOpen } = useLMS();
  const { unreadCount, setIsOpen: setNotifOpen } = useNotifications();
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/courses' },
    { label: 'Learning Paths', href: '/learning-paths' },
    { label: 'Practice', href: '/practice' },
    { label: 'Coding Lab', href: '/coding' },
    { label: 'Projects', href: '/projects' },
    { label: 'Career', href: '/career' },
    { label: 'Community', href: '/community' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-tyc-border dark:border-[#1E293B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo size="md" />
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive(link.href)
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions, AI, Role, Profile */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-tyc-muted dark:text-gray-300 bg-tyc-bg dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 border border-tyc-border dark:border-gray-700 rounded-lg transition-colors"
              title="Search everything (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="text-[10px] text-tyc-muted dark:text-gray-400 font-semibold bg-white dark:bg-gray-900 border border-tyc-border dark:border-gray-700 px-1.5 py-0.2 rounded">
                ⌘K
              </kbd>
            </button>

            {/* AI Tutor Copilot Button */}
            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 group border border-indigo-400/30"
              title="Open AI Tutor Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:scale-110 transition-transform" />
              <span>AI Tutor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-tyc-border dark:hover:border-slate-700 transition-colors"
              title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-tyc-border dark:hover:border-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Primary CTA / Dashboard Navigation */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-tyc-border dark:border-gray-700 shadow-subtle"
                  />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-tyc-border dark:border-gray-700 rounded-xl shadow-modal z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-tyc-border/60 dark:border-gray-800 mb-1">
                      <div className="text-xs font-bold text-tyc-text dark:text-white">{user.name}</div>
                      <div className="text-[11px] text-tyc-muted dark:text-gray-400 truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-tyc-text dark:text-gray-200 hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-tyc-green" />
                      <span>Student Dashboard</span>
                    </Link>

                    {(role === 'admin' || role === 'superadmin') && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-tyc-text dark:text-gray-200 hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      to="/portfolio"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-tyc-text dark:text-gray-200 hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-tyc-muted dark:text-gray-400" />
                      <span>Public Portfolio</span>
                    </Link>

                    <Link
                      to="/certificates"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-tyc-text dark:text-gray-200 hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-tyc-orange" />
                      <span>My Certificates</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-tyc-text dark:text-gray-200 hover:bg-tyc-bg dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-tyc-muted dark:text-gray-400" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-tyc-border/60 dark:border-gray-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Start Learning
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions Button & Hamburger Button */}
          <div className="flex sm:hidden items-center gap-1.5">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-tyc-muted dark:text-gray-300 hover:text-tyc-text dark:hover:text-white rounded-lg"
              title="Toggle Theme"
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* AI Tutor (Mobile) */}
            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="p-2 text-tyc-green dark:text-green-300 bg-tyc-green-soft dark:bg-green-950/60 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-tyc-muted dark:text-gray-300 hover:text-tyc-text dark:hover:text-white rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-tyc-border dark:border-gray-800 bg-white dark:bg-[#151916] px-4 pt-2 pb-6 space-y-3">
          <div className="pt-2 pb-1 border-b border-tyc-border dark:border-gray-800">
            <RoleSwitcher />
          </div>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-tyc-green-soft dark:bg-tyc-green/20 text-tyc-green dark:text-green-400 font-semibold'
                    : 'text-tyc-muted dark:text-gray-300 hover:text-tyc-text dark:hover:text-white hover:bg-tyc-bg dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-tyc-border dark:border-gray-800 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-tyc-green dark:text-green-400"
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-tyc-muted dark:text-gray-300"
                >
                  Public Portfolio
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Start Learning
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
