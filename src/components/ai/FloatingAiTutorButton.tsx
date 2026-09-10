import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLMS } from '../../context/LMSContext';
import { X } from 'lucide-react';
import { AITutorSymbol } from '../shared/AITutorSymbol';

export const FloatingAiTutorButton: React.FC = () => {
  const { isAiTutorOpen, setIsAiTutorOpen } = useLMS();
  const [showTooltip, setShowTooltip] = useState(true);

  if (isAiTutorOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Floating Prompt Bubble / Badge */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="relative bg-white/95 dark:bg-[#0D121F]/95 text-slate-900 dark:text-white backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-slate-200/90 dark:border-slate-800 flex items-center gap-2 cursor-pointer group hover:border-emerald-400/60 transition-all max-w-[240px]"
            onClick={() => setIsAiTutorOpen(true)}
          >
            <div className="p-1 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
              <AITutorSymbol size="xs" variant="emerald" animated />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                <span>AI Tutor</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
              </div>
              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
                Ask questions or debug code
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded transition-colors ml-0.5"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Bubble arrow pointing down */}
            <div className="absolute -bottom-1 right-4 w-2.5 h-2.5 bg-white dark:bg-[#0F172A] rotate-45 border-r border-b border-[#E2E8F0] dark:border-[#334155]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Glowing Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsAiTutorOpen(true)}
        className="relative group p-0 rounded-full focus:outline-none cursor-pointer select-none"
        title="Open TYC AI Tutor"
      >
        {/* Outer Continuous Neon Pulse Glow */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#8B5CF6] opacity-60 blur-sm group-hover:opacity-90 transition-opacity animate-pulse" />

        {/* Core Button Face with Glass Effect & Glowing Neural AI Symbol */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#0F172A] to-[#022c22] dark:from-[#0F172A] dark:to-[#022c22] text-white flex items-center justify-center shadow-xl border border-emerald-400/80 overflow-hidden">
          {/* Shimmer Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-cyan-400/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative flex items-center justify-center w-full h-full p-1 rounded-full overflow-hidden">
            <img src="/ai-copilot-robot.png" alt="TYC AI Tutor" className="w-full h-full object-contain rounded-full" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};
