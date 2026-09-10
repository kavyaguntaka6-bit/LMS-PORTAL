import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from '../shared/SocialIcons';
import { Button } from '../ui/Button';
import { BrandLogo } from '../shared/BrandLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useNotifications();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast('Subscribed!', 'You are now subscribed to TYC Engineering & Career dispatches.', 'system');
    setEmail('');
  };

  const journeySteps = [
    '1. Discover',
    '2. Learn',
    '3. Understand',
    '4. Practice',
    '5. Assess',
    '6. Build',
    '7. Prove',
    '8. Certify',
    '9. Showcase',
    '10. Get Opportunity'
  ];

  return (
    <footer className="bg-[#F8FAFC] dark:bg-[#020617] border-t border-[#E2E8F0] dark:border-[#334155] mt-auto transition-colors duration-200 relative overflow-hidden">
      {/* Learning-to-Career Philosophy Banner */}
      <div className="border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                The TYC Learning-to-Career Blueprint
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Every course and project is engineered to produce verified industry readiness.
            </p>
          </div>

          {/* Journey Pipeline */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {journeySteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap shadow-xs shrink-0 hover:border-[#10B981]/50 transition-all duration-150">
                  <span className="w-4 h-4 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/20 text-[#047857] dark:text-[#34D399] text-[10px] font-bold flex items-center justify-center border border-[#A7F3D0] dark:border-[#10B981]/30">
                    {idx + 1}
                  </span>
                  <span>{step.split('. ')[1]}</span>
                </div>
                {idx < journeySteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              An advanced AI-powered learning ecosystem engineering the next generation of full stack, AI, and cloud technology leaders.
            </p>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#10B981] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#10B981] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#10B981] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#10B981] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/courses" className="hover:text-[#10B981] transition-colors font-medium">Course Catalog</Link></li>
              <li><Link to="/learning-paths" className="hover:text-[#10B981] transition-colors font-medium">Career Roadmaps</Link></li>
              <li><Link to="/practice" className="hover:text-[#10B981] transition-colors font-medium">Practice Engine</Link></li>
              <li><Link to="/coding" className="hover:text-[#10B981] transition-colors font-medium">Coding Playground</Link></li>
              <li><Link to="/projects" className="hover:text-[#10B981] transition-colors font-medium">Industry Projects</Link></li>
              <li><Link to="/certificates" className="hover:text-[#10B981] transition-colors font-medium">Certificate Verification</Link></li>
            </ul>
          </div>

          {/* Col 3: Career & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Opportunities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/career" className="hover:text-[#10B981] transition-colors font-medium">Internships & Jobs</Link></li>
              <li><Link to="/workshops" className="hover:text-[#10B981] transition-colors font-medium">Live Masterclasses</Link></li>
              <li><Link to="/hackathons" className="hover:text-[#10B981] transition-colors font-medium">Global Hackathons</Link></li>
              <li><Link to="/community" className="hover:text-[#10B981] transition-colors font-medium">Developer Forum</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#10B981] transition-colors font-medium">Student Showcase</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Weekly Tech Dispatch
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Curated tech blueprints, system architecture breakdowns, and career alerts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] shadow-xs"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs py-2">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>&copy; {new Date().getFullYear()} Trata Yukthi Core. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Security & Compliance</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
