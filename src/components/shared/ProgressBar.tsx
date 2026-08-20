import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: 'green' | 'orange' | 'black';
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
    green: 'bg-tyc-green',
    orange: 'bg-tyc-orange',
    black: 'bg-tyc-black',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-gray-100 rounded-full overflow-hidden border border-tyc-border/40', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] font-medium text-tyc-muted mt-1">
          <span>Progress</span>
          <span className="text-tyc-text font-semibold">{Math.round(clamped)}%</span>
        </div>
      )}
    </div>
  );
};
