import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, ChevronDown, User as UserIcon, GraduationCap, Settings2 } from 'lucide-react';
import { clsx } from 'clsx';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { key: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'student',
      label: 'Student',
      icon: <UserIcon className="w-3.5 h-3.5 text-tyc-green" />,
      desc: 'Learning, Practice & Portfolio'
    },
    {
      key: 'instructor',
      label: 'Instructor',
      icon: <GraduationCap className="w-3.5 h-3.5 text-tyc-orange" />,
      desc: 'Course authoring & review'
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />,
      desc: 'Platform & CMS management'
    },
    {
      key: 'superadmin',
      label: 'Super Admin',
      icon: <Settings2 className="w-3.5 h-3.5 text-purple-600" />,
      desc: 'Full platform governance'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 border border-tyc-border rounded-lg hover:bg-gray-100 transition-colors"
        title="Switch Demo Role"
      >
        <span className="text-tyc-muted text-[11px]">Role:</span>
        <span className="font-semibold text-tyc-text capitalize">{role}</span>
        <ChevronDown className="w-3 h-3 text-tyc-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 bg-white border border-tyc-border rounded-xl shadow-modal z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider border-b border-tyc-border/60 mb-1">
            Demo Persona Switcher
          </div>
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => {
                switchRole(r.key);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs',
                role === r.key
                  ? 'bg-tyc-green-soft text-tyc-green font-medium'
                  : 'hover:bg-tyc-bg text-tyc-text'
              )}
            >
              <div className="mt-0.5 shrink-0">{r.icon}</div>
              <div>
                <div className="font-semibold capitalize">{r.label}</div>
                <div className="text-[11px] text-tyc-muted">{r.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
