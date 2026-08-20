import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useNotifications();
  const navigate = useNavigate();

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
      await register(name, email, password);
      toast('Welcome to TYC!', 'Account created successfully. Let us personalize your roadmap.', 'system');
      navigate('/onboarding');
    } catch {
      toast('Error', 'Unable to create account.', 'system');
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
            Create Your TYC Account
          </h2>
          <p className="text-xs text-tyc-muted">
            Start your journey from beginner concepts to verified industry readiness
          </p>
        </div>

        <Card className="shadow-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@tyc.dev"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password (min 8 chars)"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-tyc-border text-tyc-green focus:ring-tyc-green cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-tyc-muted cursor-pointer leading-tight">
                I agree to the TYC Code of Conduct, Academic Honor Code, and Privacy Policy.
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              Create Account & Onboard
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-tyc-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-tyc-green hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
