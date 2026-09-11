import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export type CharacterPhase =
  | 'idle'
  | 'email-focus'
  | 'email-typing'
  | 'email-valid'
  | 'email-invalid'
  | 'password-focus'
  | 'password-typing'
  | 'password-valid'
  | 'login-success';

interface TYCCharacterProps {
  phase: CharacterPhase;
  emailLength?: number;
  className?: string;
  onLogoClick?: () => void;
}

// Map phase directly to the boy images, defaulting to the new artwork
const phaseImageMap: Record<CharacterPhase, string> = {
  idle: '/signin/tyc-boy-scene.jpg',
  'email-focus': '/signin/tyc-boy-scene.jpg',
  'email-typing': '/signin/tyc-boy-scene.jpg',
  'email-valid': '/signin/tyc-boy-scene.jpg',
  'email-invalid': '/signin/tyc-boy-scene.jpg',
  'password-focus': '/signin/tyc-boy-scene.jpg',
  'password-typing': '/signin/tyc-boy-scene.jpg',
  'password-valid': '/signin/tyc-boy-scene.jpg',
  'login-success': '/signin/tyc-boy-scene.jpg',
};

export const TYCCharacter: React.FC<TYCCharacterProps> = ({
  phase,
  emailLength = 0,
  className = '',
  onLogoClick,
}) => {
  const currentImage = phaseImageMap[phase] || phaseImageMap.idle;
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth 3D Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 200, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D Spatial Angles
  const baseRotateX = useTransform(smoothMouseY, [-180, 180], [7, -7]);
  const baseRotateY = useTransform(smoothMouseX, [-180, 180], [-8, 8]);

  // Preload all original images for zero-latency instant transitions
  useEffect(() => {
    const urls = Object.values(phaseImageMap);
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isEmailActive = phase === 'email-focus' || phase === 'email-typing';
  const isEmailValid = phase === 'email-valid';
  const isEmailInvalid = phase === 'email-invalid';
  const isPasswordTyping = phase === 'password-typing' || phase === 'password-focus';
  const isSuccess = phase === 'login-success';

  // Dynamic eye gaze tracking across text length
  const gazeXOffset = Math.min(emailLength * 1.5, 30);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] rounded-[26px] overflow-hidden flex flex-col justify-between select-none ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* 3D Floating Stage with Full Uncropped Character Artwork */}
      <motion.div
        animate={{
          y: isSuccess ? [-6, 2, -6] : isEmailValid ? [-4, 1, -4] : [-2, 2, -2],
          rotateZ: isEmailInvalid ? -1.5 : isEmailValid ? 1 : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: isSuccess ? 1.4 : isEmailValid ? 2.5 : 4,
          ease: 'easeInOut',
        }}
        style={{
          rotateX: baseRotateX,
          rotateY: baseRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full min-h-[460px] sm:min-h-[520px] rounded-[26px] overflow-hidden shadow-2xl bg-[#090d16]"
      >
        {/* Full Image of the Boy (Full Scene with Hoodie, Laptop, Coffee Mug & Desk) */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="TYC Student Character"
            initial={{ opacity: 0.8, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full h-full object-cover object-top rounded-[26px]"
          />
        </AnimatePresence>

        {/* Top-Left Brand Logo (Clickable for Staff / Admin Portal) */}
        <button
          type="button"
          onClick={onLogoClick}
          title={onLogoClick ? "Click for Staff / Admin Sign In" : undefined}
          className={`absolute top-5 left-5 z-20 flex flex-col items-start gap-0.5 bg-black/35 hover:bg-black/50 backdrop-blur-[4px] p-2 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-200 text-left ${
            onLogoClick ? 'cursor-pointer hover:scale-105 active:scale-95 group' : ''
          }`}
        >
          <div className="flex items-center font-black text-3xl tracking-tight text-white font-sans">
            <span>TY</span>
            <span className="relative inline-flex items-center text-white">
              C
              <svg
                className="w-4 h-4 text-amber-500 inline-block -mt-3 ml-0.5 group-hover:rotate-12 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </div>
          <div className="text-[10.5px] font-bold tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className="text-[#22c55e]">Learn</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#f59e0b]">Build</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#ef4444]">Grow</span>
          </div>
          {onLogoClick && (
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-400 mt-1 flex items-center gap-1 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Staff Portal</span>
            </span>
          )}
        </button>

        {/* Dynamic Gaze Focus Vector on Email Input */}
        <AnimatePresence>
          {isEmailActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: gazeXOffset,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[32%] right-4 z-30 flex items-center pointer-events-none"
            >
              {/* Glowing Green Eye Badge */}
              <div className="w-11 h-11 rounded-full bg-[#0a1811]/90 border-2 border-[#22c55e] shadow-[0_0_25px_rgba(34,197,94,0.7)] flex items-center justify-center text-[#22c55e] text-lg animate-pulse backdrop-blur-md">
                👀
              </div>

              {/* Dashed trajectory line pointing to the email input on the right */}
              <div className="hidden sm:block absolute left-full top-1/2 -translate-y-1/2 w-10 border-t-2 border-dashed border-[#22c55e] opacity-80" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
