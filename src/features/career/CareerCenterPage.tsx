import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { careerService } from '../../services/api';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  Building2,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockJobOpportunities } from '../../services/mockData';
import { JobOpportunity } from '../../types';

export const CareerCenterPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Full-time' | 'Internship'>('All');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [jobs, setJobs] = useState<JobOpportunity[]>(mockJobOpportunities);

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === 'All') return true;
    return j.type === activeFilter;
  });

  const handleQuickApply = async (job: JobOpportunity) => {
    setIsApplying(true);
    try {
      await careerService.applyJob(job.id);
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
      toast('Application Submitted!', `Your TYC Verified Profile was sent to ${job.company}.`, 'career');
      setSelectedJob(null);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Career Opportunities' }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Hiring Partner Career Portal
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          Direct recruitment fast-track for TYC certified developers. Apply with your verified portfolio and skill benchmarks.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-tyc-border pb-3">
        {['All', 'Full-time', 'Internship'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === type
                ? 'bg-tyc-green text-white shadow-sm'
                : 'bg-white text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg border border-tyc-border'
            }`}
          >
            {type} Opportunities
          </button>
        ))}
      </div>

      {/* Jobs & Internships List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} hoverable className="p-6 space-y-4 shadow-subtle border-tyc-border">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-tyc-border shadow-subtle"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-tyc-text">{job.title}</h3>
                    <Badge variant={job.type === 'Internship' ? 'orange' : 'green'} size="sm">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-tyc-muted">
                    <span className="font-semibold text-tyc-text">{job.company}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span>&bull;</span>
                    <span className="font-semibold text-tyc-green">{job.salaryOrStipend}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <div className="text-right text-[11px] text-tyc-muted">
                  Deadline: <strong className="text-tyc-text">{job.deadline}</strong>
                </div>
                {job.applied ? (
                  <Badge variant="green" size="md">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Applied
                  </Badge>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => setSelectedJob(job)}>
                    Fast-Track Apply
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-tyc-muted leading-relaxed">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-tyc-border text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-tyc-muted font-medium">Skills:</span>
                {job.skills.map((sk) => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-text">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-tyc-green text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Eligibility: {job.eligibility}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Fast-Track Apply Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Apply to ${selectedJob.company}` : ''}
        description={selectedJob?.title}
        maxWidth="lg"
      >
        {selectedJob && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-tyc-green-soft border border-tyc-green/30 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-tyc-green font-bold">
                <Sparkles className="w-4 h-4" />
                <span>TYC Fast-Track Talent Matching</span>
              </div>
              <p className="text-tyc-text leading-relaxed">
                Your application will automatically bundle your <strong>Verified Portfolio</strong>, <strong>Capstone Scores (98%)</strong>, and <strong>2 Cryptographic Certificates</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-tyc-text">Candidate Profile Attachment:</h4>
              <div className="p-3 bg-tyc-bg rounded-lg border border-tyc-border space-y-1">
                <div><strong>Candidate:</strong> {user?.name || 'Alex Rivera'} ({user?.email || 'alex.rivera@tyc.dev'})</div>
                <div><strong>Target Role:</strong> {user?.careerGoal || 'Full Stack AI Developer'}</div>
                <div><strong>Verified Skills:</strong> React 19, TypeScript, Python FastAPI, PostgreSQL</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border">
              <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={() => handleQuickApply(selectedJob)}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Confirm Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
