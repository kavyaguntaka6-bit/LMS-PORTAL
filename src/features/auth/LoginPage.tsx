import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Crown,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSignIn, useClerk } from '@clerk/react';
import { TYCCharacter, CharacterPhase } from './components/TYCCharacter';
import { UserRole } from '../../types';

// Practical RFC email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'user' for normal students, 'staff' for Staff / Admin access
  const [authMode, setAuthMode] = useState<'user' | 'staff'>('user');
  const [selectedStaffRole, setSelectedStaffRole] = useState<'instructor' | 'admin' | 'superadmin'>('instructor');

  // Clerk Authentication Hooks
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn() as any;
  const clerk = useClerk() as any;

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Validation States
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Pre-fill helper if redirected from protected role intent
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const targetRole = (location.state as any)?.targetRole || searchParams.get('role') || searchParams.get('targetRole');
    if (targetRole === 'superadmin' || targetRole === 'owner') {
      setAuthMode('staff');
      setSelectedStaffRole('superadmin');
      setEmail('hcskolluru@gmail.com');
      setPassword('tyc@2021');
      setIsEmailValid(true);
      setIsPasswordValid(true);
    } else if (targetRole === 'admin') {
      setAuthMode('staff');
      setSelectedStaffRole('admin');
      setEmail('admin@tyc.dev');
      setPassword('admin@123');
      setIsEmailValid(true);
      setIsPasswordValid(true);
    } else if (targetRole === 'instructor') {
      setAuthMode('staff');
      setSelectedStaffRole('instructor');
      setEmail('instructor@tyc.dev');
      setPassword('instructor@123');
      setIsEmailValid(true);
      setIsPasswordValid(true);
    }
  }, [location]);

  // Character State
  const [characterPhase, setCharacterPhase] = useState<CharacterPhase>('email-focus');
  const passwordDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger celebration confetti on success
  const triggerCelebrationConfetti = useCallback(() => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Email Input Handlers
  const handleEmailFocus = () => {
    if (isEmailValid) {
      setCharacterPhase('email-valid');
    } else {
      setCharacterPhase('email-focus');
    }
  };

  const handleEmailBlur = () => {
    if (email.trim().length > 0) {
      if (EMAIL_REGEX.test(email.trim())) {
        setIsEmailValid(true);
        setEmailError(null);
        setCharacterPhase('email-valid');
      } else {
        setIsEmailValid(false);
        setEmailError('Please enter a valid email address');
        setCharacterPhase('email-invalid');
      }
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setCharacterPhase('email-typing');

    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    emailDebounceRef.current = setTimeout(() => {
      if (val.trim().length === 0) {
        setIsEmailValid(false);
        setEmailError(null);
        setCharacterPhase('email-focus');
      } else if (EMAIL_REGEX.test(val.trim())) {
        setIsEmailValid(true);
        setEmailError(null);
        setCharacterPhase('email-valid');
      } else {
        setIsEmailValid(false);
        setCharacterPhase('email-typing');
      }
    }, 400);
  };

  // Password Input Handlers
  const handlePasswordFocus = () => {
    if (password.length >= 6) {
      setCharacterPhase('password-valid');
    } else {
      setCharacterPhase('password-focus');
    }
  };

  const handlePasswordBlur = () => {
    if (password.length >= 6) {
      setIsPasswordValid(true);
      setCharacterPhase('password-valid');
    } else if (password.length > 0) {
      setIsPasswordValid(false);
      setCharacterPhase('email-invalid');
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setCharacterPhase('password-typing');

    if (passwordDebounceRef.current) clearTimeout(passwordDebounceRef.current);
    passwordDebounceRef.current = setTimeout(() => {
      if (val.length >= 6) {
        setIsPasswordValid(true);
        setCharacterPhase('password-valid');
      } else {
        setIsPasswordValid(false);
        if (val.length > 0) {
          setCharacterPhase('password-typing');
        } else {
          setCharacterPhase('email-focus');
        }
      }
    }, 350);
  };

  const switchMode = (newMode: 'user' | 'staff') => {
    setAuthMode(newMode);
    if (newMode === 'staff') {
      setSelectedStaffRole('superadmin');
      setEmailError(null);
      setEmail('hcskolluru@gmail.com');
      setPassword('tyc@2021');
      setIsEmailValid(true);
      setIsPasswordValid(true);
    } else {
      // Student / User mode
      setEmailError(null);
      setEmail('');
      setPassword('');
      setIsEmailValid(false);
      setIsPasswordValid(false);
    }
  };

  const handleLogoClick = async () => {
    // Instant Super Admin Authentication on TYC Logo Click
    setIsLoading(true);
    try {
      const loggedIn = await login('hcskolluru@gmail.com', 'tyc@2021', 'superadmin');
      setCharacterPhase('login-success');
      setIsSuccess(true);
      triggerCelebrationConfetti();
      toast(`Welcome back, ${loggedIn?.name || 'Super Admin'}!`, 'Super Administrator root clearance activated.', 'system');

      const interval = setInterval(() => {
        setRedirectProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 100);

      setTimeout(() => {
        navigate('/super-admin');
      }, 1200);
    } catch {
      switchMode('staff');
      setSelectedStaffRole('superadmin');
      setIsLoading(false);
    }
  };

  const handleStaffRoleSelect = (role: 'instructor' | 'admin' | 'superadmin') => {
    setSelectedStaffRole(role);
    if (role === 'superadmin') {
      setEmail('hcskolluru@gmail.com');
      setPassword('tyc@2021');
    } else if (role === 'admin') {
      setEmail('admin@tyc.dev');
      setPassword('admin@123');
    } else {
      setEmail('instructor@tyc.dev');
      setPassword('instructor@123');
    }
    setIsEmailValid(true);
    setIsPasswordValid(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
      setCharacterPhase('email-invalid');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      setCharacterPhase('email-invalid');
      return;
    }

    setIsLoading(true);

    try {
      let authSuccess = false;
      let displayName = email.split('@')[0];
      let authenticatedUser: any = null;

      const requestedRole: UserRole | undefined = authMode === 'staff' ? selectedStaffRole : undefined;

      if (isSignInLoaded && signIn) {
        try {
          const result = await signIn.create({
            identifier: email.trim(),
            password: password,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            authSuccess = true;
          }
        } catch (clerkErr: any) {
          console.warn('Clerk direct signIn response, falling back to secure local RBAC auth:', clerkErr);
          const loggedIn = await login(email.trim(), password, requestedRole);
          if (loggedIn) {
            displayName = loggedIn.name;
            authenticatedUser = loggedIn;
            authSuccess = true;
          } else {
            throw clerkErr;
          }
        }
      } else {
        const loggedIn = await login(email.trim(), password, requestedRole);
        displayName = loggedIn.name;
        authenticatedUser = loggedIn;
        authSuccess = true;
      }

      if (authSuccess) {
        setCharacterPhase('login-success');
        setIsSuccess(true);
        triggerCelebrationConfetti();
        toast(`Welcome back, ${displayName}!`, 'Authentication verified. Access granted.', 'system');

        const interval = setInterval(() => {
          setRedirectProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 14;
          });
        }, 120);

        setTimeout(() => {
          const fromPath = (location.state as any)?.from?.pathname;
          if (fromPath && fromPath !== '/login' && fromPath !== '/unauthorized') {
            navigate(fromPath);
          } else if (authenticatedUser?.role === 'superadmin' || authenticatedUser?.role === 'owner') {
            navigate('/super-admin');
          } else if (authenticatedUser?.role === 'admin') {
            navigate('/admin');
          } else if (authenticatedUser?.role === 'instructor') {
            navigate('/instructor');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err: any) {
      setIsLoading(false);
      setCharacterPhase('email-invalid');
      const errorMsg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Invalid email/username or password.';
      toast('Authentication Failed', errorMsg, 'system');
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    if (isSignInLoaded && signIn) {
      try {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard',
        });
      } catch {
        clerk.openSignIn();
      }
    } else {
      clerk.openSignIn();
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#22c55e] selection:text-black">
      {/* Master Card Frame */}
      <div className="w-full max-w-[880px] bg-[#0a0e17] border border-[#161f33] rounded-[32px] p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        {/* Main 2-Column Grid: Left Full Boy Scene + Right Login Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* LEFT COLUMN: Full Image of Boy with Clickable TYC Brand Logo */}
          <div className="md:col-span-6 flex flex-col justify-center w-full min-h-[460px] sm:min-h-[520px]">
            <TYCCharacter
              phase={characterPhase}
              emailLength={email.length}
              className="w-full h-full"
              onLogoClick={handleLogoClick}
            />
          </div>

          {/* RIGHT COLUMN: Sign In Form Card (User vs Staff Mode) */}
          <div className="md:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-[390px] h-full bg-[#0f1523]/95 border border-[#1a253a] rounded-[26px] p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-center relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  authMode === 'user' ? (
                    /* ================= NORMAL USER / STUDENT LOGIN ================= */
                    <motion.div
                      key="user-login-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Header */}
                      <div className="text-center space-y-1 mb-4">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <button
                            type="button"
                            onClick={() => switchMode('staff')}
                            title="Click for Staff / Admin Portal"
                            className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3 text-emerald-400" />
                            <span>Staff Portal</span>
                          </button>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
                          Welcome back!
                        </h1>
                        <p className="text-xs text-slate-400">
                          Login to continue your learning journey.
                        </p>
                      </div>

                      {/* Sign In Form */}
                      <form onSubmit={handleSubmit} className="space-y-3.5">
                        
                        {/* Email Field */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-semibold text-slate-300 block">
                            Email
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={email}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              onFocus={handleEmailFocus}
                              onBlur={handleEmailBlur}
                              placeholder="user@example.com"
                              className={`w-full pl-10 pr-4 py-2.5 bg-[#090d16] text-xs sm:text-sm text-white placeholder:text-slate-500 rounded-xl border transition-all duration-150 outline-none ${
                                emailError
                                  ? 'border-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                                  : isEmailValid
                                  ? 'border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                                  : 'border-[#22c55e]/60 focus:border-[#22c55e] focus:shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                              }`}
                            />
                          </div>
                          {emailError && (
                            <p className="text-[11px] text-[#ef4444] font-medium pl-1">
                              {emailError}
                            </p>
                          )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300">
                              Password
                            </label>
                            <Link
                              to="/forgot-password"
                              className="text-[11px] font-medium text-slate-400 hover:text-[#22c55e] transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => handlePasswordChange(e.target.value)}
                              onFocus={handlePasswordFocus}
                              onBlur={handlePasswordBlur}
                              placeholder="••••••••••••"
                              className={`w-full pl-10 pr-10 py-2.5 bg-[#090d16] text-xs sm:text-sm text-white placeholder:text-slate-500 rounded-xl border transition-all duration-150 outline-none ${
                                isPasswordValid
                                  ? 'border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                                  : 'border-[#22c55e]/60 focus:border-[#22c55e] focus:shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 rounded bg-[#090d16] border border-slate-700 text-[#22c55e] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#22c55e]"
                            />
                            <span className="text-xs text-slate-400 font-medium">
                              Remember me
                            </span>
                          </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#C084FC] hover:opacity-95 shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {isLoading ? (
                            <span>Signing in...</span>
                          ) : (
                            <>
                              <span>Login</span>
                              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </>
                          )}
                        </button>
                      </form>

                      {/* Divider: or continue with */}
                      <div className="relative flex items-center justify-center py-2">
                        <div className="border-t border-slate-800 w-full" />
                        <span className="bg-[#0f1523] px-3 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          or continue with
                        </span>
                      </div>

                      {/* Continue with Google */}
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#131A2A] hover:bg-[#182236] text-white border border-[#232F46] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer hover:border-slate-600"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span className="font-semibold text-slate-200">
                          Continue with Google
                        </span>
                      </button>

                      {/* Don't have an account? Sign up */}
                      <div className="text-center text-xs text-slate-400 pt-2">
                        <span>Don't have an account? </span>
                        <Link
                          to="/register"
                          className="font-bold text-[#22c55e] hover:underline"
                        >
                          Sign up
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    /* ================= TYC STAFF SIGN IN INTERFACE ================= */
                    <motion.div
                      key="staff-login-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5 text-left"
                    >
                      {/* Header */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <KeyRound className="w-3 h-3 text-amber-400" />
                            <span>Staff Sign In</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => switchMode('user')}
                            className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>User Login</span>
                          </button>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight font-sans">
                          TYC Staff Sign In
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          Authenticate with your assigned workspace tier.
                        </p>
                      </div>

                      {/* Role Options UI Selector */}
                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] font-semibold text-slate-300 block">
                          Select Target Terminal
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStaffRoleSelect('instructor')}
                            className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              selectedStaffRole === 'instructor'
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <GraduationCap className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-bold">Instructor</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStaffRoleSelect('admin')}
                            className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              selectedStaffRole === 'admin'
                                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <span className="text-[10px] font-bold">Admin</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStaffRoleSelect('superadmin')}
                            className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                              selectedStaffRole === 'superadmin'
                                ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-bold">Super Admin</span>
                          </button>
                        </div>
                      </div>

                      {/* Staff Sign In Form */}
                      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                        {/* Email / Username Field */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-semibold text-slate-300 block">
                            Staff Email / Username
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 text-slate-400 pointer-events-none">
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="text"
                              required
                              value={email}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              onFocus={handleEmailFocus}
                              onBlur={handleEmailBlur}
                              placeholder="staff@tyc.dev"
                              className={`w-full pl-9 pr-3 py-2 bg-[#090d16] text-xs text-white placeholder:text-slate-500 rounded-xl border transition-all duration-150 outline-none ${
                                emailError
                                  ? 'border-[#ef4444]'
                                  : isEmailValid
                                  ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                                  : 'border-slate-800 focus:border-emerald-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-semibold text-slate-300 block">
                            Password
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 text-slate-400 pointer-events-none">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => handlePasswordChange(e.target.value)}
                              onFocus={handlePasswordFocus}
                              onBlur={handlePasswordBlur}
                              placeholder="••••••••••••"
                              className="w-full pl-9 pr-9 py-2 bg-[#090d16] text-xs text-white placeholder:text-slate-500 rounded-xl border border-slate-800 focus:border-emerald-500 outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Security Disclaimer */}
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Role clearance is validated by the server database.</span>
                        </div>

                        {/* Staff Sign In Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-95 shadow-[0_4px_15px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                        >
                          {isLoading ? (
                            <span>Verifying Credentials...</span>
                          ) : (
                            <>
                              <span>Sign In to {selectedStaffRole === 'superadmin' ? 'Super Admin' : selectedStaffRole === 'admin' ? 'Admin' : 'Instructor'}</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </>
                          )}
                        </button>

                        {/* Back to User Sign In */}
                        <button
                          type="button"
                          onClick={() => switchMode('user')}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to User Sign In</span>
                        </button>
                      </form>
                    </motion.div>
                  )
                ) : (
                  /* Login Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-[#22c55e] bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Login Successful!
                      </h2>
                      <p className="text-xs text-slate-400">
                        Redirecting to authorized dashboard...
                      </p>
                    </div>
                    <div className="w-full max-w-[220px] mx-auto h-2 bg-[#090d16] rounded-full overflow-hidden border border-[#1b2336]">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${redirectProgress}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2dd4bf] via-[#38bdf8] to-[#c084fc]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
