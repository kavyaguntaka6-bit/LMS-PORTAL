import React from 'react';
import { clsx } from 'clsx';

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading TYC ecosystem...',
  className
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center p-12 text-center min-h-[300px]', className)}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-tyc-border border-t-tyc-green animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-tyc-orange animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-xs font-medium text-tyc-muted mt-4 animate-pulse">{message}</p>
    </div>
  );
};
