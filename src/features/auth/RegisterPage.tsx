import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { SignUpButton, useSignUp, useClerk } from '@clerk/react';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TYCCharacter } from './components/TYCCharacter';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  // Clerk Registration Hooks
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp() as any;
  const clerk = useClerk() as any;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast('Terms Required', 'Please accept the Terms of Service.', 'system');
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUpLoaded && signUp) {
        try {
          const result = await signUp.create({
            emailAddress: email.trim(),
            password: password,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || undefined,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            toast('Welcome to TYC!', 'Account created with Clerk. Personalizing your portal...', 'system');
            navigate('/onboarding');
            return;
          }
        } catch (clerkErr: any) {
          console.warn('Clerk signup fallback to local DB:', clerkErr);
          await register(name, email, password);
          toast('Welcome to TYC!', 'Account created successfully. Personalizing your portal...', 'system');
          navigate('/onboarding');
          return;
        }
      } else {
        await register(name, email, password);
        toast('Welcome to TYC!', 'Account created successfully. Personalizing your portal...', 'system');
        navigate('/onboarding');
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Unable to create account.';
      toast('Registration Failed', msg, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-12 selection:bg-emerald-500 selection:text-black">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Header */}
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
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                REGISTER
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
              Learn • Build • Grow
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Already registered?</span>
          <Link
            to="/login"
            className="text-xs font-bold px-4 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 transition-all hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main 2-Column Split Stage */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Mascot */}
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
              <span className="text-emerald-400">Join</span> •{' '}
              <span className="text-cyan-400">50,000+</span> •{' '}
              <span className="text-purple-400">Builders</span>
            </div>
          </div>

          <TYCCharacter phase="idle" className="w-full" />
        </div>

        {/* Right Column: Register Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="relative rounded-[28px] p-[1.5px] bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-xl">
              <div className="bg-[#090D18]/95 rounded-[27px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden space-y-6">
                {/* Ambient Top Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Create Your Account
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Begin your personalized path from beginner to industry-ready engineer.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-10 pr-4 py-3 bg-[#060912] text-sm text-white placeholder-slate-500 rounded-2xl border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@tyc.dev"
                        className="w-full pl-10 pr-4 py-3 bg-[#060912] text-sm text-white placeholder-slate-500 rounded-2xl border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Password (min 8 chars)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-[#060912] text-sm text-white placeholder-slate-500 rounded-2xl border border-slate-800 hover:border-slate-700 focus:border-cyan-500/80 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-md border-slate-700 bg-[#060912] text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer leading-tight select-none">
                      I agree to the <span className="text-emerald-400 font-semibold">TYC Code of Conduct</span> and <span className="text-emerald-400 font-semibold">Privacy Policy</span>.
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Creating Profile...</span>
                      </span>
                    ) : (
                      <>
                        <span>Create Account & Onboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Clerk 1-Click Sign Up */}
                  <div className="pt-2">
                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6C47FF] to-[#3B82F6] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/40 cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                        <span>Sign up with Clerk Authentication</span>
                      </button>
                    </SignUpButton>
                  </div>
                </form>

                <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Already have an account? </span>
                  <Link to="/login" className="font-bold text-emerald-400 hover:underline">
                    Sign in
                  </Link>
                </div>
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
