import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Home,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Crown,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface UnauthorizedPageProps {
  requiredRole?: string;
  requiredPermission?: string;
  customMessage?: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  requiredRole,
  requiredPermission,
  customMessage
}) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutAndSwitch = async () => {
    await logout();
    navigate('/login', { state: { from: location } });
  };

  const getTargetDashboardLink = () => {
    if (role === 'owner' || role === 'superadmin') return '/super-admin';
    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (role === 'owner' || role === 'superadmin') return 'Super Admin Terminal';
    if (role === 'admin') return 'Admin Console';
    if (role === 'instructor') return 'Instructor Portal';
    return 'Student Dashboard';
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-tyc-bg dark:bg-[#070b14] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#0c121e] border border-rose-500/30 dark:border-rose-500/40 rounded-[32px] p-6 sm:p-8 text-center space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Ambient security glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Glowing Security Shield Badge */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-600/60 text-rose-500 dark:text-rose-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.25)]">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>403 Access Denied</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Restricted Clearance
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {customMessage ? (
              customMessage
            ) : user ? (
              <>
                Your active session (<strong className="text-slate-900 dark:text-white">{user.email}</strong>) possesses the{' '}
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px]">
                  {role}
                </span>{' '}
                tier, which is not authorized to access this restricted workspace terminal.
                {requiredRole && (
                  <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Required Clearance: <strong className="text-rose-500 uppercase">{requiredRole}</strong>
                  </span>
                )}
                {requiredPermission && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                    {requiredPermission}
                  </span>
                )}
              </>
            ) : (
              'You do not possess the required credentials to access this protected terminal.'
            )}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5 pt-2">
          {user ? (
            <Link to={getTargetDashboardLink()} className="block w-full">
              <Button variant="primary" size="md" className="w-full shadow-md flex items-center justify-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to {getDashboardLabel()}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full shadow-md flex items-center justify-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Sign In with Authorized Account</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Home className="w-3.5 h-3.5 mr-1" />
                Home
              </Button>
            </Link>
            <button
              type="button"
              onClick={handleLogoutAndSwitch}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Switch User</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
          Security Incident Log ID: <span className="font-mono text-slate-500 dark:text-slate-400">SEC-{(Date.now() % 1000000).toString(16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
