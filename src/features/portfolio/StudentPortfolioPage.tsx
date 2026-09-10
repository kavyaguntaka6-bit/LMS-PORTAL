import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Globe,
  Award,
  Code2,
  Share2,
  ExternalLink,
  Flame,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/shared/SocialIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockCertificates, mockProjects, mockCurrentUser } from '../../services/mockData';

export const StudentPortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useNotifications();

  const profileUser = user || mockCurrentUser;

  const handleShare = () => {
    navigator.clipboard.writeText(`https://tyc.dev/portfolio/${profileUser.id}`);
    toast('Portfolio Link Copied!', 'Public portfolio link copied to clipboard.', 'system');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Share Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb items={[{ label: 'Public Student Portfolio' }]} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 shadow-sm dark:shadow-xl bg-white dark:bg-[#0D121F] border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{profileUser.name}</h1>
                <Badge variant="green" size="sm" dot>TYC Verified Developer</Badge>
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Target Role: {profileUser.careerGoal}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {profileUser.bio}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{profileUser.college || 'Stanford Institute of Technology'}</span>
                <span>&bull;</span>
                <span>{profileUser.branch || 'Computer Science'} ({profileUser.year || '3rd Year'})</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-2 shrink-0">
            {profileUser.githubUrl && (
              <a href={profileUser.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {profileUser.linkedinUrl && (
              <a href={profileUser.linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {profileUser.portfolioUrl && (
              <a href={profileUser.portfolioUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-600 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xl font-black text-slate-900 dark:text-white">{profileUser.completedCourseIds?.length || 2}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Courses Mastered</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xl font-black text-slate-900 dark:text-white">{mockProjects.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Projects Built</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xl font-black text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              {profileUser.streakDays || 14}d
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active Streak</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{mockCertificates.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verified Certs</div>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Verified Projects Showcase */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Completed Capstones & Source Repos</h2>
            </div>
            <Badge variant="green" size="sm">Passing Test Suites</Badge>
          </div>

          <div className="space-y-4">
            {mockProjects.map((prj) => (
              <Card key={prj.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="green" size="sm" className="mb-1">{prj.category}</Badge>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{prj.title}</h3>
                  </div>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>View Code</span>
                  </a>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {prj.problemStatement}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                  {prj.skills.map((sk) => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Verified Skills & Certifications */}
        <div className="space-y-6">
          {/* Verified Skills */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Benchmarked Skills</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">TYC Tested</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'React 19 & TypeScript', score: 92 },
                { name: 'FastAPI & Python 3.12', score: 86 },
                { name: 'PostgreSQL & SQL Performance', score: 84 },
                { name: 'Docker & Containerization', score: 78 }
              ].map((sk) => (
                <div key={sk.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{sk.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{sk.score}%</span>
                  </div>
                  <ProgressBar progress={sk.score} color="green" size="xs" />
                </div>
              ))}
            </div>
          </Card>

          {/* Verified Certificates */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Verified Certificates</span>
              </div>
            </div>

            <div className="space-y-3">
              {mockCertificates.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-[#161F30] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <Badge variant="green" size="sm">Issued {c.issuedDate}</Badge>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-1">{c.courseTitle}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: {c.certificateId}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
