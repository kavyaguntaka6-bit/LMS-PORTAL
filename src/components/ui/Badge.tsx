import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'orange' | 'ai' | 'indigo' | 'gray' | 'outline' | 'dark' | 'yellow' | 'purple' | 'rainbow' | 'cyan' | 'rose';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold rounded-full transition-all duration-150';

  const sizeStyles = {
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  const variantStyles = {
    // Primary Brand Green
    green: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-[#10B981]/15 dark:text-[#34D399] dark:border-[#10B981]/30',
    
    // Action Orange
    orange: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] dark:bg-[#FF8A1F]/15 dark:text-[#FB923C] dark:border-[#FF8A1F]/30',
    
    // AI Dedicated Badge
    ai: 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] dark:bg-[#6366F1]/15 dark:text-[#818CF8] dark:border-[#6366F1]/30',
    indigo: 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] dark:bg-[#6366F1]/15 dark:text-[#818CF8] dark:border-[#6366F1]/30',
    
    // Topic Colors
    cyan: 'bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80',
    rose: 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80',

    // Clean Slate Neutral
    gray: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#1E293B] dark:text-slate-300 dark:border-slate-700',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
    dark: 'bg-[#0F172A] text-white border border-slate-800 shadow-xs',
    
    // Legacy mapping aliases
    yellow: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    rainbow: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] dark:bg-[#FF8A1F]/15 dark:text-[#FB923C] dark:border-[#FF8A1F]/30',
  };

  const dotColors = {
    green: 'bg-[#10B981]',
    orange: 'bg-[#FF8A1F]',
    ai: 'bg-[#6366F1]',
    indigo: 'bg-[#6366F1]',
    cyan: 'bg-cyan-500',
    rose: 'bg-rose-500',
    gray: 'bg-slate-400',
    outline: 'bg-[#10B981]',
    dark: 'bg-[#10B981]',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500',
    rainbow: 'bg-[#FF8A1F]',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))} {...props}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
