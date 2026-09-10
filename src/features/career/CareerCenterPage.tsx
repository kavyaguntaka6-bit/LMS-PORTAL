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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Hiring Partner Career Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Direct recruitment fast-track for TYC certified developers. Apply with your verified portfolio and skill benchmarks.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        {['All', 'Full-time', 'Internship'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeFilter === type
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#0D121F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {type} Opportunities
          </button>
        ))}
      </div>

      {/* Jobs & Internships List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            hoverable
            className={`p-6 space-y-4 shadow-sm dark:shadow-xl dark:bg-[#0D121F] dark:border-slate-800 ${
              job.type === 'Internship'
                ? 'bg-amber-50/60 hover:bg-amber-50/90 border-amber-200/90'
                : 'bg-emerald-50/60 hover:bg-emerald-50/90 border-emerald-200/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <Badge variant={job.type === 'Internship' ? 'orange' : 'green'} size="sm">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salaryOrStipend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-start">
                <Button
                  variant={job.applied ? "outline" : "primary"}
                  size="sm"
                  onClick={() => setSelectedJob(job)}
                  disabled={job.applied}
                  className="text-xs"
                >
                  {job.applied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      Applied
                    </>
                  ) : (
                    <>
                      Apply with TYC Profile
                      <Send className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {job.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Deadline: {job.deadline}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJob(null)}
          title={`Apply: ${selectedJob.title}`}
          size="md"
        >
          <div className="space-y-4 p-1">
            <div className="p-4 bg-slate-50 dark:bg-[#161F30] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedJob.company}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{selectedJob.salaryOrStipend}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{selectedJob.description}</p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Candidate Dossier Attached</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Your application automatically includes your completed project repo links, algorithmic streak, and verified certificates.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleQuickApply(selectedJob)}
                isLoading={isApplying}
              >
                Submit Fast-Track Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
