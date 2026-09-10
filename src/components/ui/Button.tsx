import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange' | 'green' | 'danger' | 'ai' | 'rainbow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer active:scale-95';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5 shadow-sm',
  };

  const variantStyles = {
    // Primary CTA: Master TYC Action Orange
    primary: 'bg-[#FF8A1F] hover:bg-[#EA760B] active:bg-[#D96B07] text-white font-bold shadow-sm',
    orange: 'bg-[#FF8A1F] hover:bg-[#EA760B] active:bg-[#D96B07] text-white font-bold shadow-sm',
    
    // Secondary CTA: Clean Surface + Brand Green Border & Text
    secondary: 'bg-white dark:bg-[#0F172A] hover:bg-[#ECFDF5] dark:hover:bg-[#10B981]/10 text-[#047857] dark:text-[#10B981] border border-[#10B981] shadow-xs',
    green: 'bg-[#10B981] hover:bg-[#047857] text-white font-bold shadow-sm',

    // Dedicated AI Action: Indigo to Cyan Gradient
    ai: 'bg-gradient-to-r from-[#6366F1] to-[#22D3EE] text-white font-bold shadow-sm hover:opacity-95',
    rainbow: 'bg-[#FF8A1F] hover:bg-[#EA760B] text-white font-bold shadow-sm',

    // Outline: Clean Neutral Slate
    outline: 'bg-white hover:bg-slate-50 dark:bg-[#0F172A] dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-[#E2E8F0] dark:border-[#334155] shadow-xs',
    
    // Ghost: Subtle Clean
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
    
    // Functional Danger
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
