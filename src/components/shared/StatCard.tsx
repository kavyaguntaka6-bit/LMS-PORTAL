import React from 'react';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: 'green' | 'orange' | 'yellow' | 'purple' | 'gray' | 'blue' | 'cyan';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'green',
  className
}) => {
  const iconBgStyles = {
    green: 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] dark:bg-[#10B981]/15 dark:text-[#34D399] dark:border-[#10B981]/30',
    orange: 'bg-[#FFF7ED] text-[#FF8A1F] border border-[#FED7AA] dark:bg-[#FF8A1F]/15 dark:text-[#FB923C] dark:border-[#FF8A1F]/30',
    yellow: 'bg-[#FFF7ED] text-[#FF8A1F] border border-[#FED7AA] dark:bg-[#FF8A1F]/15 dark:text-[#FB923C] dark:border-[#FF8A1F]/30',
    purple: 'bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE] dark:bg-[#6366F1]/15 dark:text-[#818CF8] dark:border-[#6366F1]/30',
    blue: 'bg-[#EEF2FF] text-[#6366F1] border border-[#C7D2FE] dark:bg-[#6366F1]/15 dark:text-[#818CF8] dark:border-[#6366F1]/30',
    cyan: 'bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] dark:border-[#22D3EE]/30',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const cardThemeStyles = {
    green: 'bg-gradient-to-br from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-emerald-200/80 dark:border-emerald-800/40 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.06)]',
    orange: 'bg-gradient-to-br from-amber-50/60 via-white to-white dark:from-amber-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.06)]',
    yellow: 'bg-gradient-to-br from-amber-50/60 via-white to-white dark:from-amber-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.06)]',
    purple: 'bg-gradient-to-br from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-purple-200/80 dark:border-purple-800/40 hover:border-purple-400 dark:hover:border-purple-500 shadow-[0_4px_20px_rgba(168,85,247,0.06)]',
    blue: 'bg-gradient-to-br from-blue-50/60 via-white to-white dark:from-blue-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-blue-200/80 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.06)]',
    cyan: 'bg-gradient-to-br from-cyan-50/60 via-white to-white dark:from-cyan-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-cyan-200/80 dark:border-cyan-800/40 hover:border-cyan-400 dark:hover:border-cyan-500 shadow-[0_4px_20px_rgba(6,182,212,0.06)]',
    gray: 'bg-white dark:bg-[#0F172A] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm',
  };

  return (
    <Card className={clsx('relative overflow-hidden transition-all duration-200 border rounded-2xl p-5', cardThemeStyles[iconBgColor] || cardThemeStyles.green, className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{value}</h4>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2.5">
              <span
                className={clsx(
                  'text-xs font-bold px-2 py-0.5 rounded-full',
                  trend.isPositive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">vs last week</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-2xl shrink-0 transition-transform hover:scale-105 shadow-xs', iconBgStyles[iconBgColor])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
