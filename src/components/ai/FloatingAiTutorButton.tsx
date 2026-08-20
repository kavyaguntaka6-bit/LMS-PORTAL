import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLMS } from '../../context/LMSContext';
import { Sparkles, Bot, MessageSquare, Zap, X } from 'lucide-react';

export const FloatingAiTutorButton: React.FC = () => {
  const { isAiTutorOpen, setIsAiTutorOpen } = useLMS();
  const [showTooltip, setShowTooltip] = useState(true);

  if (isAiTutorOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Floating Prompt Bubble / Badge */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-indigo-500/30 flex items-center gap-3 cursor-pointer group hover:border-indigo-400/60 transition-all max-w-xs"
            onClick={() => setIsAiTutorOpen(true)}
          >
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>AI Tutor Online</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Ask questions, debug code or quiz anytime!
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded-md transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Bubble arrow pointing down */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 dark:bg-slate-800 rotate-45 border-r border-b border-indigo-500/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Glowing Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsAiTutorOpen(true)}
        className="relative group p-0 rounded-full focus:outline-none"
        title="Open Socratic AI Tutor"
      >
        {/* Outer Continuous Pulse Wave Rings */}
        <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
        <span className="absolute -inset-1 rounded-full bg-indigo-600 animate-ping opacity-25 pointer-events-none" />

        {/* Core Button Face */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-2xl border-2 border-white/40 overflow-hidden">
          {/* Shimmer Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};
