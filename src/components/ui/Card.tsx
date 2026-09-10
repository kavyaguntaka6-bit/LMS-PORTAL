import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  rainbowBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  rainbowBorder = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#0D121F] border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-sm dark:shadow-md transition-all duration-200',
          padded && 'p-5 md:p-6',
          hoverable && 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
          rainbowBorder && 'border-transparent tyc-rainbow-border',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
