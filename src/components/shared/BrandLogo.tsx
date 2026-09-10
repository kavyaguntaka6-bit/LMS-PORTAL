import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  href = '/',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-[15px]',
    lg: 'text-lg',
  };

  const content = (
    <>
      {/* TYC Circular Badge with Theme-Aware Logo */}
      <div
        className={`relative ${iconSizes[size]} rounded-full bg-black dark:bg-white border border-slate-200 dark:border-slate-800 shadow-md group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-all duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center overflow-hidden`}
      >
        {/* First Logo in Bright Mode */}
        <img
          src="/tyc-logo-first.png"
          alt="Traya Yukti TYC Logo Bright Mode"
          className="w-full h-full object-cover dark:hidden"
        />
        {/* Second Logo in Dark Mode */}
        <img
          src="/tyc-logo-second.png"
          alt="Traya Yukti TYC Logo Dark Mode"
          className="w-full h-full object-cover hidden dark:block"
        />
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col justify-center text-left">
        <div
          className={`font-black ${titleSizes[size]} tracking-wide uppercase leading-none text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors duration-200`}
        >
          <span>TRATA YUKTHI CORE</span>
        </div>
        {showSubtitle && (
          <div className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 flex items-center gap-1.5 transition-colors duration-200">
            <span>AI LMS ECOSYSTEM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_#10B981]" />
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Open TYC Access Portal"
        className={`flex items-center gap-3 group select-none cursor-pointer focus:outline-none bg-transparent border-0 p-0 ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={href}
      title="Trata Yukthi Core Platform"
      className={`flex items-center gap-3 group select-none ${className}`}
    >
      {content}
    </Link>
  );
};
