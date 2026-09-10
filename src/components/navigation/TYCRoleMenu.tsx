import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  ShieldCheck,
  Crown,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface TYCRoleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLDivElement>;
}

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  targetPath: string;
  minAllowedRoles: UserRole[];
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  accentGlow: string;
  description: string;
}

export const TYC_ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'instructor',
    title: 'Instructor Portal',
    subtitle: 'Course Management & Grading',
    targetPath: '/instructor',
    minAllowedRoles: ['instructor', 'admin', 'superadmin', 'owner'],
    icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
    badge: 'Faculty Tier',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    accentGlow: 'hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/25',
    description: 'Syllabus authoring, live classroom orchestration & student assignment grading.'
  },
  {
    id: 'admin',
    title: 'Admin Console',
    subtitle: 'Platform Operations & CMS',
    targetPath: '/admin',
    minAllowedRoles: ['admin', 'superadmin', 'owner'],
    icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
    badge: 'Operations Tier',
    badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    accentGlow: 'hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/25',
    description: 'Student admissions, instructor rosters, course publishing & revenue analytics.'
  },
  {
    id: 'superadmin',
    title: 'Super Admin Terminal',
    subtitle: 'Highest Security Clearance',
    targetPath: '/super-admin',
    minAllowedRoles: ['superadmin', 'owner'],
    icon: <Crown className="w-5 h-5 text-amber-500" />,
    badge: 'Level 1 Executive',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    accentGlow: 'hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/25',
    description: 'Full infrastructure control, database orchestration, RBAC security audit logs.'
  }
];

export const TYCRoleMenu: React.FC<TYCRoleMenuProps> = ({ isOpen, onClose }) => {
  const { user, role, hasRole } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleRoleSelect = (option: RoleOption) => {
    onClose();

    // 1. If user is not logged in, redirect to login with target role intent
    if (!user) {
      navigate('/login', {
        state: { from: { pathname: option.targetPath }, targetRole: option.id }
      });
      return;
    }

    // 2. If user is logged in, navigate directly.
    // The ProtectedRoute guard & backend will strictly enforce security clearance.
    navigate(option.targetPath);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute left-0 top-full mt-3 w-80 sm:w-96 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-500/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-50 p-3 sm:p-4 text-slate-900 dark:text-white select-none overflow-hidden"
        >
          {/* Subtle Ambient Top Border Sheen */}
          <div className="absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/40 to-amber-500/20" />

          {/* Header */}
          <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Access Portal
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  RBAC SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Select your authorized workspace terminal
              </p>
            </div>

            {user && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Logged in as</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {role}
                </span>
              </div>
            )}
          </div>

          {/* Role Selection Options */}
          <div className="space-y-1.5">
            {TYC_ROLE_OPTIONS.map((option) => {
              const isAuthorized = user ? hasRole(option.minAllowedRoles) : false;
              const isCurrentRole = user && (user.role === option.id || (option.id === 'superadmin' && user.role === 'owner'));

              return (
                <button
                  key={option.id}
                  onClick={() => handleRoleSelect(option)}
                  className={`w-full text-left p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 transition-all duration-200 flex flex-col gap-2 group cursor-pointer ${option.accentGlow} ${
                    isCurrentRole
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-500/40 shadow-xs'
                      : 'bg-white/60 dark:bg-[#0f1523]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-105 transition-transform shrink-0">
                        {option.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {option.title}
                          </h4>
                          {isCurrentRole && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${option.badgeColor}`}>
                        {option.badge}
                      </span>
                    </div>
                  </div>

                  {/* Security Clearance Badge */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                    <span className="text-slate-400 truncate max-w-[210px] sm:max-w-[260px]">
                      {option.description}
                    </span>

                    <div className="flex items-center gap-1 shrink-0 font-bold">
                      {user ? (
                        isAuthorized ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Granted</span>
                          </span>
                        ) : (
                          <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Requires Clearance</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 group-hover:text-emerald-500 flex items-center gap-1">
                          <span>Enter</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Security Note */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 px-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Hierarchical Server-Enforced RBAC</span>
            </span>
            <span>TYC v2.4</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
