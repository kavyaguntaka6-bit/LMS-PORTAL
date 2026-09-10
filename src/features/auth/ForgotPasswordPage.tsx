import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { TYCCharacter } from './components/TYCCharacter';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useNotifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast('Reset Link Sent', 'Check your inbox for password recovery instructions.', 'system');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-12 selection:bg-emerald-500 selection:text-black">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800/60">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg group-hover:border-emerald-500/50 transition-all duration-200">
            <svg viewBox="0 0 100 100" className="w-7 h-7 p-0.5" fill="none">
              <path d="M 18 36 L 40 36 M 29 36 L 29 68" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <path d="M 40 36 L 50 50 L 60 36 M 50 50 L 50 68" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <path d="M 82 42 C 77 34 65 34 62 45 C 59 55 62 65 74 67 C 80 67 83 63 85 59" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <path d="M 28 72 L 74 26" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
              <path d="M 60 25 L 77 24 L 76 41" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>TYC</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                RECOVERY
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
              Learn • Build • Grow
            </p>
          </div>
        </Link>

        <Link
          to="/login"
          className="text-xs font-bold px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main 2-Column Split Stage */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start justify-center space-y-4">
          <div className="w-full max-w-[460px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-white">TYC</span>
              <div className="w-5 h-5 flex items-center justify-center text-orange-500">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-400 tracking-wider">
              <span className="text-cyan-400">Account</span> •{' '}
              <span className="text-emerald-400">Security</span>
            </div>
          </div>

          <TYCCharacter phase={isSubmitted ? 'email-valid' : 'email-focus'} className="w-full" />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="relative rounded-[28px] p-[1.5px] bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-xl">
              <div className="bg-[#090D18]/95 rounded-[27px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden space-y-6">
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Reset Your Password
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Enter your registered email address to receive password recovery instructions.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white">Reset Link Dispatched</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Instructions have been sent to <strong className="text-emerald-400">{email}</strong>.
                      </p>
                    </div>
                    <div className="pt-4">
                      <Link
                        to="/login"
                        className="w-full block py-3 rounded-2xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-center"
                      >
                        Return to Sign In
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Registered Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-[#060912] text-sm text-white placeholder-slate-500 rounded-2xl border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Sending Link...</span>
                        </span>
                      ) : (
                        <span>Send Password Reset Link</span>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to login</span>
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>&copy; 2026 Traya Yukti (TYC) AI LMS. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <Link to="/login" className="hover:text-slate-300">Sign In</Link>
          <span>•</span>
          <Link to="/dashboard" className="hover:text-slate-300">Courses</Link>
        </div>
      </footer>
    </div>
  );
};
