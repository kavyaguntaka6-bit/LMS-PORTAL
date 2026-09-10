import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center text-xs text-slate-500 dark:text-slate-400', className)}>
      <Link to="/" className="hover:text-[#11184A] dark:hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600 shrink-0" />
            {item.href && !isLast ? (
              <Link to={item.href} className="hover:text-[#11184A] dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-[#11184A] dark:text-white truncate max-w-[200px] sm:max-w-md">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
