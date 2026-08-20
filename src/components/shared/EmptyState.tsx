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
    <div className={clsx('flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-tyc-border rounded-xl', className)}>
      <div className="p-3 bg-tyc-bg text-tyc-muted rounded-full mb-3">
        {icon || <Inbox className="w-8 h-8 text-tyc-muted" />}
      </div>
      <h4 className="text-base font-semibold text-tyc-text">{title}</h4>
      <p className="text-xs text-tyc-muted max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
