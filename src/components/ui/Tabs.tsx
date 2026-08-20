import React from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className
}) => {
  if (variant === 'pills') {
    return (
      <div className={clsx('flex items-center gap-1.5 p-1 bg-tyc-bg rounded-lg border border-tyc-border', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                isActive
                  ? 'bg-white text-tyc-text shadow-subtle border border-tyc-border/60'
                  : 'text-tyc-muted hover:text-tyc-text hover:bg-white/50'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full',
                    isActive ? 'bg-tyc-green-soft text-tyc-green font-semibold' : 'bg-gray-200 text-tyc-muted'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-6 border-b border-tyc-border overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all shrink-0 cursor-pointer',
              isActive
                ? 'border-tyc-green text-tyc-green font-semibold'
                : 'border-transparent text-tyc-muted hover:text-tyc-text hover:border-gray-300'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  isActive ? 'bg-tyc-green-soft text-tyc-green' : 'bg-gray-100 text-tyc-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
