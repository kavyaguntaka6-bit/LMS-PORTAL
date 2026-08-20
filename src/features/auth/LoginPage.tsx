import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { UserRole } from '../../types';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.rivera@tyc.dev');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, 'student');
      toast('Welcome back!', 'Signed into TYC Learning Ecosystem.', 'system');
      navigate('/dashboard');
    } catch {
      toast('Sign In Error', 'Invalid credentials.', 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const emailMap = {
        student: 'alex.rivera@tyc.dev',
        instructor: 'sarah.chen@tyc.dev',
        admin: 'admin@tyc.dev',
        superadmin: 'root@tyc.dev'
      };
      await login(emailMap[role], 'password123', role);
      toast(`Logged in as ${role}`, 'Demo session activated.', 'system');
      if (role === 'admin' || role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-tyc-bg">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-tyc-green text-white font-black text-base flex items-center justify-center shadow-sm">
              TYC
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-tyc-text tracking-tight">
            Sign in to Traya Yukti Core
          </h2>
          <p className="text-xs text-tyc-muted">
            Access your courses, projects, AI Tutor, and career roadmap
          </p>
        </div>

        <Card className="shadow-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@tyc.dev"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-tyc-text">Password</label>
                <Link to="/forgot-password" className="text-xs text-tyc-green hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Personas */}
          <div className="mt-6 pt-5 border-t border-tyc-border">
            <div className="text-[11px] font-semibold text-tyc-muted uppercase tracking-wider text-center mb-3">
              One-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickDemoLogin('student')}
              >
                Student Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickDemoLogin('admin')}
              >
                Admin Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-tyc-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-tyc-green hover:underline">
              Create account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
