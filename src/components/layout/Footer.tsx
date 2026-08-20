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
    'Discover',
    'Learn',
    'Understand',
    'Practice',
    'Assess',
    'Build',
    'Prove',
    'Certify',
    'Showcase',
    'Get Opportunity'
  ];

  return (
    <footer className="bg-white dark:bg-[#0B0F19] border-t border-tyc-border dark:border-[#1E293B] mt-auto transition-colors">
      {/* Learning-to-Career Philosophy Banner */}
      <div className="border-b border-tyc-border dark:border-[#1E293B] bg-slate-50 dark:bg-[#0F172A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                The TYC Learning-to-Career Blueprint
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every course and project is structured to produce verified industry readiness.
            </p>
          </div>

          {/* Journey Pipeline */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
            {journeySteps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap shadow-subtle shrink-0 hover:border-indigo-500/50 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < journeySteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              An advanced AI-powered learning and career platform engineering the next generation of full stack, AI, and cloud technology leaders.
            </p>
            <div className="flex items-center gap-3 text-tyc-muted dark:text-gray-400 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800 hover:text-tyc-text dark:hover:text-white transition-colors">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800 hover:text-tyc-text dark:hover:text-white transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800 hover:text-tyc-text dark:hover:text-white transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-tyc-bg dark:hover:bg-gray-800 hover:text-tyc-text dark:hover:text-white transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-tyc-text dark:text-white mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-tyc-muted dark:text-gray-400">
              <li><Link to="/courses" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/learning-paths" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Career Roadmaps</Link></li>
              <li><Link to="/practice" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Practice Engine</Link></li>
              <li><Link to="/coding" className="hover:text-tyc-orange dark:hover:text-orange-400 transition-colors">Coding Playground</Link></li>
              <li><Link to="/projects" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Industry Projects</Link></li>
              <li><Link to="/certificates" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Certificate Verification</Link></li>
            </ul>
          </div>

          {/* Col 3: Career & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-tyc-text dark:text-white mb-3">
              Opportunities
            </h4>
            <ul className="space-y-2 text-xs text-tyc-muted dark:text-gray-400">
              <li><Link to="/career" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Internships & Jobs</Link></li>
              <li><Link to="/workshops" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Live Masterclasses</Link></li>
              <li><Link to="/hackathons" className="hover:text-tyc-orange dark:hover:text-orange-400 transition-colors">Global Hackathons</Link></li>
              <li><Link to="/community" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Developer Forum</Link></li>
              <li><Link to="/portfolio" className="hover:text-tyc-green dark:hover:text-green-400 transition-colors">Student Showcase</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-tyc-text dark:text-white mb-3">
              Weekly Tech Dispatch
            </h4>
            <p className="text-xs text-tyc-muted dark:text-gray-400 mb-3 leading-relaxed">
              Curated tech blueprints, system architecture breakdowns, and career alerts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-tyc-bg dark:bg-[#1A211D] border border-tyc-border dark:border-[#222E26] rounded-xl text-tyc-text dark:text-white placeholder-tyc-muted/60 focus:outline-none focus:border-tyc-green"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-tyc-border dark:border-[#222E26] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-tyc-muted dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-tyc-green" />
            <span>&copy; {new Date().getFullYear()} Traya Yukti Core. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-tyc-text dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-tyc-text dark:hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-tyc-text dark:hover:text-white cursor-pointer">Security & Compliance</span>
            <span className="hover:text-tyc-text dark:hover:text-white cursor-pointer">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
