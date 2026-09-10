import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  ChevronRight,
  Layers,
  Flame,
  Clock,
  Code2,
  Award,
  Users,
  Briefcase,
  Rocket,
  ShieldCheck,
  Check,
  FolderGit2,
  Calendar,
  PlayCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { RatingStars } from '../../components/shared/RatingStars';
import { AITutorSymbol } from '../../components/shared/AITutorSymbol';
import {
  mockCourses,
  mockLearningPaths,
  mockProjects,
  mockWorkshops,
  mockHackathons
} from '../../services/mockData';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, setIsAiTutorOpen } = useLMS();

  // 10-Step Philosophy Matrix (Clean Surface Cards + Subtle Brand Badges)
  const philosophySteps = [
    {
      title: '1. Discover',
      desc: 'Explore high-demand tech stacks and discover your ideal career path.',
    },
    {
      title: '2. Learn',
      desc: 'Master core concepts through interactive lessons and visual guides.',
    },
    {
      title: '3. Understand',
      desc: 'Deepen knowledge with AI-driven Socratic tutor explanations.',
    },
    {
      title: '4. Practice',
      desc: 'Solve bite-sized algorithmic, SQL, and debugging challenges.',
    },
    {
      title: '5. Assess',
      desc: 'Pass rigorous module benchmarks and knowledge evaluations.',
    },
    {
      title: '6. Build',
      desc: 'Construct full-stack, AI-integrated capstones from Figma to deploy.',
    },
    {
      title: '7. Review',
      desc: 'Submit code with automated linting & instructor PR reviews.',
    },
    {
      title: '8. Certify',
      desc: 'Earn verifiable, cryptographically-backed skill credentials.',
    },
    {
      title: '9. Showcase',
      desc: 'Publish an interactive recruiter-ready developer portfolio.',
    },
    {
      title: '10. Get Opportunity',
      desc: 'Unlock fast-track interviews, fellowships, and internships.',
    }
  ];

  return (
    <div className="bg-white dark:bg-[#05070A] text-slate-900 dark:text-slate-100 transition-colors duration-250 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (PIXEL-PERFECT RECREATION OF REFERENCE DESIGN)            */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100vh-100px)] flex flex-col justify-center items-center overflow-hidden select-none px-4 sm:px-6 lg:px-8 py-8 lg:py-14 border-b border-slate-100 dark:border-slate-800/80">
        
        {/* Subtle Ambient Background Light */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200/15 dark:bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        {/* Hero 2-Column Grid */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 pb-8">
          
          {/* LEFT COLUMN: Announcement, Dominant Typography, Subtitle & 2 CTA Buttons */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsAiTutorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#0D121F] border border-amber-300/80 dark:border-amber-500/40 shadow-[0_2px_10px_rgba(245,158,11,0.08)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group"
            >
              <AITutorSymbol size="xs" variant="amber" animated />
              <span className="text-[13px] sm:text-[13.5px] font-bold text-amber-800 dark:text-amber-300 tracking-tight">
                TYC 2026 AI Learning & Career Ecosystem is Live
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>

            {/* Main Dominant Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-[64px] font-black text-[#0F172A] dark:text-white tracking-[-0.03em] leading-[1.12]"
            >
              <span className="block">Learn Skills.</span>
              <span className="block">Build Projects.</span>
              <span className="text-rainbow block mt-1">
                Become Industry Ready.
              </span>
            </motion.h1>

            {/* Description Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-sm sm:text-base md:text-[16.5px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl"
            >
              The modern LMS built by Trata Yukthi Core. Master full-stack architectures, algorithms, and AI engineering through structured masterclasses, live sandboxes, and portfolio capstones.
            </motion.p>

            {/* 2 CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="pt-2 flex flex-wrap items-center gap-4 w-full"
            >
              <Link to="/courses">
                <button className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full btn-primary-cta text-white font-bold text-sm sm:text-[15px] shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>

              <Link to="/practice">
                <button className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full btn-secondary-cta font-bold text-sm sm:text-[15px] shadow-xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
                  <span>Start Practicing</span>
                  <span className="font-mono font-bold text-xs">&lt;/&gt;</span>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Enhanced Gyroscopic Orbit Stage Around TYC Core */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative min-h-[440px] sm:min-h-[500px]">
            
            {/* Ambient Radial Core Lighting */}
            <div className="absolute w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-amber-500/10 blur-3xl pointer-events-none" />

            {/* Main Orbit Stage */}
            <div className="relative w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] flex items-center justify-center select-none">
              
              {/* Outer Static Track Ring */}
              <div className="absolute w-[340px] sm:w-[430px] h-[340px] sm:h-[430px] rounded-full border border-slate-200/80 dark:border-slate-800 shadow-inner pointer-events-none" />
              
              {/* Middle Dashed Guide Track */}
              <div className="absolute w-[260px] sm:w-[330px] h-[260px] sm:h-[330px] rounded-full border border-dashed border-emerald-400/30 dark:border-emerald-500/30 pointer-events-none animate-pulse" />

              {/* Fast Inner Cyan Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute z-10 w-44 sm:w-56 h-44 sm:h-56 rounded-full border border-dashed border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] pointer-events-none flex items-center justify-center"
              >
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </motion.div>

              {/* Counter-Rotating Amber Orbit Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="absolute z-10 w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-dashed border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] pointer-events-none flex items-center justify-center"
              >
                <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]" />
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              </motion.div>

              {/* Central TYC Emblem with Holographic Aura & Floating Physics */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  scale: [1, 1.025, 1],
                  boxShadow: [
                    "0 10px 40px rgba(16,185,129,0.25)",
                    "0 15px 50px rgba(245,158,11,0.3)",
                    "0 10px 40px rgba(16,185,129,0.25)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                whileHover={{ scale: 1.09, rotate: 2 }}
                className="relative z-20 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-white dark:bg-[#0A0E17] border-4 border-white/90 dark:border-slate-700/80 flex items-center justify-center p-1 cursor-pointer group shadow-2xl overflow-hidden backdrop-blur-xl"
              >
                {/* Holographic Glowing Ring Border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-amber-500/20 to-cyan-500/20 pointer-events-none animate-spin" style={{ animationDuration: '8s' }} />

                {/* First Logo in Bright Mode */}
                <img
                  src="/tyc-logo-first.png"
                  alt="Trata Yukthi Core TYC Logo Bright Mode"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300 dark:hidden relative z-10"
                />
                {/* Second Logo in Dark Mode */}
                <img
                  src="/tyc-logo-second.png"
                  alt="Trata Yukthi Core TYC Logo Dark Mode"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300 hidden dark:block relative z-10"
                />
              </motion.div>

              {/* CONTINUOUS 360-DEGREE REVOLVING ORBIT CONTAINER */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 26,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                {/* Orbit Satellite Nodes */}
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
                <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FF8A1F] shadow-[0_0_12px_#FF8A1F]" />
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#6366F1] shadow-[0_0_12px_#6366F1]" />
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#06B6D4] shadow-[0_0_12px_#06B6D4]" />

                {/* Card 1: AI Copilot (0° - Top Position) */}
                <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                    whileHover={{ scale: 1.12, y: -4 }}
                  >
                    <button
                      onClick={() => setIsAiTutorOpen(true)}
                      className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-emerald-400 hover:shadow-emerald-500/20 transition-all whitespace-nowrap block"
                    >
                      <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
                        <AITutorSymbol size="sm" variant="gradient" animated />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[11.5px] font-bold text-[#0F172A] dark:text-white leading-tight flex items-center gap-1">
                          <span>AI Copilot</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </h4>
                        <p className="text-[9.5px] text-[#64748B] dark:text-slate-400 font-medium">24/7 Socratic Tutor</p>
                      </div>
                    </button>
                  </motion.div>
                </div>

                {/* Card 2: Coding Practice (90° - Right Position) */}
                <div className="absolute top-1/2 -right-5 sm:-right-9 -translate-y-1/2 pointer-events-auto">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                    whileHover={{ scale: 1.12, y: -4 }}
                  >
                    <Link
                      to="/practice"
                      className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-amber-400 hover:shadow-amber-500/20 transition-all whitespace-nowrap block"
                    >
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 shadow-xs">
                        <Code2 className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">Coding Practice</h4>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium">1000+ Problems</p>
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Card 3: Live Projects (180° - Bottom Position) */}
                <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                    whileHover={{ scale: 1.12, y: -4 }}
                  >
                    <Link
                      to="/projects"
                      className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-emerald-400 hover:shadow-emerald-500/20 transition-all whitespace-nowrap block"
                    >
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
                        <FolderGit2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">Live Projects</h4>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium">Real-world Impact</p>
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Card 4: Career Boost (270° - Left Position) */}
                <div className="absolute top-1/2 -left-5 sm:-left-9 -translate-y-1/2 pointer-events-auto">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                    whileHover={{ scale: 1.12, y: -4 }}
                  >
                    <Link
                      to="/career"
                      className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-cyan-400 hover:shadow-cyan-500/20 transition-all whitespace-nowrap block"
                    >
                      <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/80 shadow-xs">
                        <Briefcase className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">Career Boost</h4>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium">Be Industry Ready</p>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BOTTOM HORIZONTAL STATS CARD (MATCHING REFERENCE DESIGN) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 w-full max-w-5xl mx-auto mt-6 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-[#E2E8F0] dark:border-[#334155] rounded-[28px] p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-6 items-center"
        >
          {/* Stat 1: 25K+ Active Learners */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] dark:bg-[#10B981]/15 border border-[#A7F3D0] dark:border-[#10B981]/30 text-[#10B981] flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-mono">25K+</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Active Learners</div>
            </div>
          </div>

          {/* Stat 2: 1500+ Practice Problems */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-[#FF8A1F]/15 border border-[#FED7AA] dark:border-[#FF8A1F]/30 text-[#FF8A1F] flex items-center justify-center shrink-0 shadow-xs">
              <Code2 className="w-6 h-6 text-[#FF8A1F]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-mono">1500+</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Practice Problems</div>
            </div>
          </div>

          {/* Stat 3: 300+ Live Projects */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-[#6366F1]/15 border border-[#C7D2FE] dark:border-[#6366F1]/30 text-[#6366F1] flex items-center justify-center shrink-0 shadow-xs">
              <FolderGit2 className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-mono">300+</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Live Projects</div>
            </div>
          </div>

          {/* Stat 4: 50+ Expert Mentors */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] dark:bg-[#22D3EE]/15 border border-[#CCFBF1] dark:border-[#22D3EE]/30 text-[#0F766E] flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-6 h-6 text-[#0F766E]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-mono">50+</div>
              <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">Expert Mentors</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 10-STEP LEARNING PHILOSOPHY MATRIX                             */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white dark:bg-[#05070A] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              The Traya Yukti Core Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              10-Step Journey: From Novice to <span className="text-rainbow">Industry Engineer</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our structured step-by-step framework ensures practical retention, verifiable portfolio code, and job-readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {philosophySteps.map((step, idx) => {
              const stepColorStyles = [
                { bg: 'bg-gradient-to-br from-emerald-50/90 via-white to-white dark:from-emerald-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400', badge: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-[#10B981]/20 dark:text-[#34D399]', dot: 'bg-emerald-500' },
                { bg: 'bg-gradient-to-br from-cyan-50/90 via-white to-white dark:from-cyan-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-cyan-300 dark:border-cyan-800/60 hover:border-cyan-400', badge: 'bg-cyan-100/80 text-cyan-800 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300', dot: 'bg-cyan-500' },
                { bg: 'bg-gradient-to-br from-purple-50/90 via-white to-white dark:from-purple-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-purple-300 dark:border-purple-800/60 hover:border-purple-400', badge: 'bg-purple-100/80 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300', dot: 'bg-purple-500' },
                { bg: 'bg-gradient-to-br from-amber-50/90 via-white to-white dark:from-amber-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-amber-300 dark:border-amber-800/60 hover:border-amber-400', badge: 'bg-amber-100/80 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300', dot: 'bg-amber-500' },
                { bg: 'bg-gradient-to-br from-blue-50/90 via-white to-white dark:from-blue-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-blue-300 dark:border-blue-800/60 hover:border-blue-400', badge: 'bg-blue-100/80 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300', dot: 'bg-blue-500' },
                { bg: 'bg-gradient-to-br from-indigo-50/90 via-white to-white dark:from-indigo-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-indigo-300 dark:border-indigo-800/60 hover:border-indigo-400', badge: 'bg-indigo-100/80 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300', dot: 'bg-indigo-500' },
                { bg: 'bg-gradient-to-br from-teal-50/90 via-white to-white dark:from-teal-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-teal-300 dark:border-teal-800/60 hover:border-teal-400', badge: 'bg-teal-100/80 text-teal-800 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300', dot: 'bg-teal-500' },
                { bg: 'bg-gradient-to-br from-rose-50/90 via-white to-white dark:from-rose-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-rose-300 dark:border-rose-800/60 hover:border-rose-400', badge: 'bg-rose-100/80 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300', dot: 'bg-rose-500' },
                { bg: 'bg-gradient-to-br from-emerald-50/90 via-white to-white dark:from-emerald-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400', badge: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-[#10B981]/20 dark:text-[#34D399]', dot: 'bg-emerald-500' },
                { bg: 'bg-gradient-to-br from-orange-50/90 via-white to-white dark:from-orange-950/25 dark:via-[#0F172A] dark:to-[#0F172A]', border: 'border-orange-300 dark:border-orange-800/60 hover:border-orange-400', badge: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] dark:bg-[#FF8A1F]/20 dark:text-[#FB923C]', dot: 'bg-orange-500' },
              ];
              const cur = stepColorStyles[idx % stepColorStyles.length];

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`border rounded-2xl p-5 space-y-3 transition-all duration-200 cursor-default shadow-xs hover:shadow-md ${cur.bg} ${cur.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${cur.badge}`}>
                      {idx + 1}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${cur.dot}`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{step.title}</h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: FEATURED MASTERCLASSES                                         */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-[#080B12] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                Curated Engineering Masterclasses
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Master Real <span className="text-rainbow">Production Codebases</span>
              </h2>
            </div>
            <Link to="/courses">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Courses
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses || mockCourses).slice(0, 3).map((course, idx) => {
              const borderAccents = [
                'border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400',
                'border-purple-300 dark:border-purple-800/60 hover:border-purple-400',
                'border-amber-300 dark:border-amber-800/60 hover:border-amber-400',
              ];

              return (
                <Card key={course.id} hoverable className={`flex flex-col justify-between overflow-hidden p-0 rounded-2xl bg-white dark:bg-[#0F172A] border shadow-xs hover:shadow-md transition-all ${borderAccents[idx % borderAccents.length]}`}>
                  <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="dark" size="sm">{course.difficulty}</Badge>
                      <Badge variant="green" size="sm">{course.category}</Badge>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {course.durationHours} hours
                        </span>
                        <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {course.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full object-cover border" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{course.instructor.name}</span>
                      </div>
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <Button variant="primary" size="sm">Explore</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: STRUCTURED ROLE-BASED LEARNING PATHS                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white dark:bg-[#05070A] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Career Roadmaps
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Structured Paths for <span className="text-rainbow">High-Demand Roles</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Follow end-to-end verified curriculum designed by senior software architects and AI researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockLearningPaths.slice(0, 4).map((path, idx) => {
              const roadmaps = [
                {
                  cardBg: 'bg-gradient-to-br from-indigo-50/80 via-white to-white dark:from-indigo-950/25 dark:via-[#0F172A] dark:to-[#0F172A]',
                  border: 'border-indigo-300 dark:border-indigo-800/60 hover:border-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.08)]',
                  box: 'bg-[#EEF2FF] text-[#6366F1] border-[#C7D2FE] dark:bg-[#6366F1]/15 dark:text-[#818CF8] dark:border-[#6366F1]/30',
                  badge: 'bg-indigo-100/90 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300',
                  icon: <Rocket className="w-6 h-6" />
                },
                {
                  cardBg: 'bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-950/25 dark:via-[#0F172A] dark:to-[#0F172A]',
                  border: 'border-amber-300 dark:border-amber-800/60 hover:border-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.08)]',
                  box: 'bg-[#FFF7ED] text-[#FF8A1F] border-[#FED7AA] dark:bg-[#FF8A1F]/15 dark:text-[#FB923C] dark:border-[#FF8A1F]/30',
                  badge: 'bg-amber-100/90 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300',
                  icon: <Layers className="w-6 h-6" />
                },
                {
                  cardBg: 'bg-gradient-to-br from-emerald-50/80 via-white to-white dark:from-emerald-950/25 dark:via-[#0F172A] dark:to-[#0F172A]',
                  border: 'border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.08)]',
                  box: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0] dark:bg-[#10B981]/15 dark:text-[#34D399] dark:border-[#10B981]/30',
                  badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300',
                  icon: <Flame className="w-6 h-6" />
                },
                {
                  cardBg: 'bg-gradient-to-br from-cyan-50/80 via-white to-white dark:from-cyan-950/25 dark:via-[#0F172A] dark:to-[#0F172A]',
                  border: 'border-cyan-300 dark:border-cyan-800/60 hover:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.08)]',
                  box: 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] dark:border-[#22D3EE]/30',
                  badge: 'bg-cyan-100/90 text-cyan-800 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300',
                  icon: <ShieldCheck className="w-6 h-6" />
                },
              ];
              const currentRoadmap = roadmaps[idx % roadmaps.length];

              return (
                <motion.div
                  key={path.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all duration-200 ${currentRoadmap.cardBg} ${currentRoadmap.border}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs ${currentRoadmap.box}`}>
                        {currentRoadmap.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentRoadmap.badge}`}>
                        {path.role || 'Career Track'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{path.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-normal">{path.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">{path.coursesCount} Courses</span>
                    <Link to={`/learning-paths`} className="font-bold text-[#10B981] hover:text-[#047857] flex items-center gap-1">
                      <span>View Path</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: STATS & TESTIMONIALS                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50/50 dark:bg-[#080B12] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
            <div className="bg-gradient-to-br from-emerald-50/80 via-white to-white dark:from-emerald-950/25 dark:via-[#0F172A] dark:to-[#0F172A] border border-emerald-300 dark:border-emerald-800/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono">24,800+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">Active Students</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-950/25 dark:via-[#0F172A] dark:to-[#0F172A] border border-amber-300 dark:border-amber-800/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(245,158,11,0.06)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#FF8A1F] font-mono">14,800+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">Capstones Built</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50/80 via-white to-white dark:from-cyan-950/25 dark:via-[#0F172A] dark:to-[#0F172A] border border-cyan-300 dark:border-cyan-800/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(6,182,212,0.06)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#0891B2] dark:text-[#22D3EE] font-mono">94.2%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">Course Completion</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50/80 via-white to-white dark:from-purple-950/25 dark:via-[#0F172A] dark:to-[#0F172A] border border-purple-300 dark:border-purple-800/60 rounded-2xl p-6 shadow-[0_4px_20px_rgba(168,85,247,0.06)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#7C3AED] dark:text-[#A78BFA] font-mono">890+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">Hired Candidates</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ankit Sharma',
                role: 'Full Stack Engineer @ Razorpay',
                text: 'The emphasis on automated testing and real git diffs in TYC projects gave me the confidence to ace my system design and coding rounds.',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
                theme: 'bg-gradient-to-br from-emerald-50/70 via-white to-white dark:from-emerald-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-emerald-200/90 dark:border-emerald-800/50'
              },
              {
                name: 'Kavita Iyer',
                role: 'AI Engineer @ Cohere Partner',
                text: 'The Socratic AI Tutor helped me understand vector embeddings and RAG pipelines far faster than reading documentation alone.',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
                theme: 'bg-gradient-to-br from-purple-50/70 via-white to-white dark:from-purple-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-purple-200/90 dark:border-purple-800/50'
              },
              {
                name: 'Daniel Brooks',
                role: 'Cloud Developer @ scale.io',
                text: 'The verifiable certificate link on my portfolio made recruiter outreach instant. Best practical tech education platform in 2026.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
                theme: 'bg-gradient-to-br from-blue-50/70 via-white to-white dark:from-blue-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-blue-200/90 dark:border-blue-800/50'
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`border rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all duration-150 ${t.theme}`}
              >
                <div className="flex items-center gap-1 text-[#FF8A1F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF8A1F]" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: FINAL CALL TO ACTION                                           */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white dark:bg-[#05070A] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-14 h-14 rounded-2xl bg-[#FFF7ED] dark:bg-[#FF8A1F]/15 border border-[#FED7AA] dark:border-[#FF8A1F]/30 text-[#FF8A1F] flex items-center justify-center mx-auto shadow-xs"
          >
            <Rocket className="w-7 h-7" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Your Journey From Learning to <span className="text-rainbow">Career Starts Here.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Join thousands of developers leveling up their full-stack, AI, and cloud systems engineering skills with Traya Yukti Core.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" className="shadow-sm hover:scale-105 transition-transform">
                Get Started Free Today
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                Explore Course Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
