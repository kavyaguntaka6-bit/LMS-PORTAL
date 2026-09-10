import React from 'react';
import { Button } from '../ui/Button';
import { Inbox } from 'lucide-react';
import { clsx } from 'clsx';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#0D121F] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl', className)}>
      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-full mb-3">
        {icon || <Inbox className="w-8 h-8 text-slate-400" />}
      </div>
      <h4 className="text-base font-bold text-[#11184A] dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
