import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-tyc-border rounded-xl shadow-subtle',
          padded && 'p-5 md:p-6',
          hoverable && 'hover:shadow-card hover:border-gray-300 transition-all duration-200 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
