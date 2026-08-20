import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
    }, 500);
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
            Reset Your Password
          </h2>
          <p className="text-xs text-tyc-muted">
            Enter your registered email to receive recovery instructions
          </p>
        </div>

        <Card className="shadow-modal">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-tyc-green-soft text-tyc-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-tyc-text">Email Sent Successfully</h3>
              <p className="text-xs text-tyc-muted max-w-xs mx-auto">
                We have dispatched password recovery instructions to <strong className="text-tyc-text">{email}</strong>.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@tyc.dev"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
                Send Recovery Link
              </Button>

              <div className="pt-2 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-tyc-muted hover:text-tyc-text">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to login</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
