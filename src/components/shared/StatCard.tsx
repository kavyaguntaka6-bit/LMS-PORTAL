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
  iconBgColor?: 'green' | 'orange' | 'gray';
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
  const bgStyles = {
    green: 'bg-tyc-green-soft text-tyc-green',
    orange: 'bg-tyc-orange-soft text-tyc-orange',
    gray: 'bg-gray-100 text-tyc-text',
  };

  return (
    <Card className={clsx('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-tyc-muted uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-tyc-text mt-1.5">{value}</h4>
          {subtitle && <p className="text-xs text-tyc-muted mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={clsx(
                  'text-xs font-semibold px-1.5 py-0.5 rounded',
                  trend.isPositive ? 'bg-tyc-green-soft text-tyc-green' : 'bg-red-50 text-red-600'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-[11px] text-tyc-muted">vs last week</span>
            </div>
          )}
        </div>
        <div className={clsx('p-2.5 rounded-xl shrink-0', bgStyles[iconBgColor])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
