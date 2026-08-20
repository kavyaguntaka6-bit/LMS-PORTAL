import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Modern Gradient Hexagon Core Emblem */}
      <div className={`relative ${iconSizes[size]} bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-[2px] shadow-md group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full bg-slate-950 dark:bg-slate-900 rounded-[inherit] flex items-center justify-center relative overflow-hidden">
          {/* Subtle inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-emerald-400/20 pointer-events-none" />
          
          <svg className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" className="text-indigo-400 fill-indigo-500/30" />
            <polyline points="2 17 12 22 22 17" className="text-emerald-400" />
            <polyline points="2 12 12 17 22 12" className="text-violet-400" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className={`font-black ${titleSizes[size]} tracking-tight leading-none text-slate-900 dark:text-white flex items-center gap-1.5`}>
          <span>TRAYA YUKTI</span>
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
            CORE
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 flex items-center gap-1">
            <span>AI LMS Ecosystem</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
          </span>
        )}
      </div>
    </Link>
  );
};
