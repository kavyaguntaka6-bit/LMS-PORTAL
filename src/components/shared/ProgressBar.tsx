import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: 'green' | 'orange' | 'purple' | 'cyan' | 'rainbow' | 'black';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'green',
  size = 'sm',
  showLabel = false,
  className
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    green: 'bg-[#10B981]',
    orange: 'bg-[#FF8A1F]',
    purple: 'bg-[#6366F1]',
    cyan: 'bg-[#22D3EE]',
    rainbow: 'bg-gradient-to-r from-[#10B981] to-[#FF8A1F]',
    black: 'bg-[#0F172A] dark:bg-white',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorClasses[color] || colorClasses.green)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
          <span>Progress</span>
          <span className="text-[#11184A] dark:text-white font-bold">{Math.round(clamped)}%</span>
        </div>
      )}
    </div>
  );
};
