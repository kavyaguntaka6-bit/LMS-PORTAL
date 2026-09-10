import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface AITutorSymbolProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'gradient' | 'emerald' | 'amber' | 'cyan' | 'white' | 'rainbow';
  animated?: boolean;
  withGlow?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { box: 'w-4 h-4', img: 'w-4 h-4' },
  sm: { box: 'w-5 h-5', img: 'w-5 h-5' },
  md: { box: 'w-6 h-6', img: 'w-6 h-6' },
  lg: { box: 'w-8 h-8', img: 'w-8 h-8' },
  xl: { box: 'w-10 h-10', img: 'w-10 h-10' },
  '2xl': { box: 'w-14 h-14', img: 'w-14 h-14' },
};

/**
 * TYC AI Tutor & Copilot Symbol
 * Powered by the 3D Thinking AI Robot
 */
export const AITutorSymbol: React.FC<AITutorSymbolProps> = ({
  size = 'md',
  animated = false,
  withGlow = false,
  className = '',
}) => {
  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={clsx('relative inline-flex items-center justify-center shrink-0 select-none', currentSize.box, className)}>
      {withGlow && (
        <motion.div
          animate={
            animated
              ? {
                  scale: [1, 1.18, 1],
                  opacity: [0.35, 0.7, 0.35],
                }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'easeInOut',
          }}
          className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400/50 via-emerald-400/40 to-blue-500/50 blur-[3px] pointer-events-none"
        />
      )}
      <motion.img
        src="/ai-copilot-robot.png"
        alt="TYC AI Copilot & Tutor"
        animate={
          animated
            ? {
                y: [-1, 1, -1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className={clsx('w-full h-full object-contain pointer-events-none drop-shadow-sm', currentSize.img)}
      />
    </div>
  );
};
