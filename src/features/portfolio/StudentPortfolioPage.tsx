import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Globe,
  Award,
  Code2,
  Share2,
  Edit3,
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
          <Button variant="primary" size="sm" className="text-xs">
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 shadow-subtle bg-white border border-tyc-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-tyc-green shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-tyc-text">{profileUser.name}</h1>
                <Badge variant="green" size="sm" dot>TYC Verified Developer</Badge>
              </div>
              <p className="text-xs font-semibold text-tyc-green">
                Target Role: {profileUser.careerGoal}
              </p>
              <p className="text-xs text-tyc-muted max-w-xl leading-relaxed">
                {profileUser.bio}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-tyc-muted">
                <span>{profileUser.educationLevel}</span>
                <span>&bull;</span>
                <span>Member since {profileUser.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-2 shrink-0">
            {profileUser.githubUrl && (
              <a href={profileUser.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-tyc-border hover:bg-tyc-bg text-tyc-text transition-colors">
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {profileUser.linkedinUrl && (
              <a href={profileUser.linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-tyc-border hover:bg-tyc-bg text-blue-600 transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {profileUser.portfolioUrl && (
              <a href={profileUser.portfolioUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-tyc-border hover:bg-tyc-bg text-tyc-green transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-tyc-border text-center">
          <div className="p-3 bg-tyc-bg rounded-xl">
            <div className="text-xl font-bold text-tyc-text">{profileUser.certificatesEarned}</div>
            <div className="text-[11px] text-tyc-muted">Verified Certifications</div>
          </div>
          <div className="p-3 bg-tyc-bg rounded-xl">
            <div className="text-xl font-bold text-tyc-green">3</div>
            <div className="text-[11px] text-tyc-muted">Production Capstones</div>
          </div>
          <div className="p-3 bg-tyc-bg rounded-xl">
            <div className="text-xl font-bold text-tyc-orange">{profileUser.streakDays} Days</div>
            <div className="text-[11px] text-tyc-muted">Daily Active Streak</div>
          </div>
          <div className="p-3 bg-tyc-bg rounded-xl">
            <div className="text-xl font-bold text-tyc-text">Top 5%</div>
            <div className="text-[11px] text-tyc-muted">Cohort Standing</div>
          </div>
        </div>
      </Card>

      {/* Grid: Skills on Left, Capstone Projects & Certs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Verified Skills */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-tyc-text uppercase tracking-wider">
              Verified Technical Skills
            </h3>
            <div className="space-y-3">
              {profileUser.skills.map((sk) => (
                <div key={sk.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-tyc-text">{sk.name}</span>
                    <span className="font-bold text-tyc-green">{sk.level}%</span>
                  </div>
                  <ProgressBar progress={sk.level} color="green" size="xs" />
                </div>
              ))}
            </div>
          </Card>

          {/* Badges / Hackathon Achievements */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-tyc-text uppercase tracking-wider">
              Achievements & Badges
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-tyc-green-soft border border-tyc-green/20 rounded-lg flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-tyc-green" />
                <div>
                  <div className="font-bold text-tyc-text">Hackathon Finalist 2026</div>
                  <div className="text-[10px] text-tyc-muted">Top 10 out of 380 global teams</div>
                </div>
              </div>
              <div className="p-2.5 bg-tyc-orange-soft border border-tyc-orange/20 rounded-lg flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-tyc-orange" />
                <div>
                  <div className="font-bold text-tyc-text">28-Day Consistency Master</div>
                  <div className="text-[10px] text-tyc-muted">Daily commits for 4 weeks straight</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 8 Cols: Showcase Capstones & Certificates */}
        <div className="lg:col-span-8 space-y-6">
          {/* Showcase Capstone Projects */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-tyc-text flex items-center gap-2">
              <Code2 className="w-4 h-4 text-tyc-green" />
              Verified Production Capstones
            </h3>

            <div className="space-y-4">
              {mockProjects.slice(0, 2).map((prj) => (
                <Card key={prj.id} className="p-5 space-y-3 border-tyc-border hover:border-tyc-green/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-tyc-text">{prj.title}</h4>
                    <Badge variant="green" size="sm">Score: 98/100 &bull; Approved</Badge>
                  </div>
                  <p className="text-xs text-tyc-muted leading-relaxed">
                    {prj.objective}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prj.skills.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
                        {sk}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-tyc-border flex items-center justify-between text-xs">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-tyc-green font-semibold hover:underline">
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>View GitHub Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-[11px] text-tyc-muted">Instructor Verified</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Official Certificates */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-tyc-text flex items-center gap-2">
              <Award className="w-4 h-4 text-tyc-green" />
              Verified Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockCertificates.map((cert) => (
                <Card key={cert.id} className="p-4 space-y-2 border-tyc-green/30 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-tyc-muted">{cert.certificateId}</span>
                    <Badge variant="green" size="sm">Score: {cert.credentialScore}%</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-tyc-text line-clamp-1">{cert.courseTitle}</h5>
                  <div className="text-[11px] text-tyc-muted">Issued: {cert.issuedDate}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
