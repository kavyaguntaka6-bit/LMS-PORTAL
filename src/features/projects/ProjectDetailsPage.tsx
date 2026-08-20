import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import { Project } from '../../types';
import {
  CheckCircle2,
  Globe,
  Video,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon } from '../../components/shared/SocialIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { LoadingState } from '../../components/shared/LoadingState';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { triggerCelebration } = useLMS();
  const { toast } = useNotifications();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form inputs for submission
  const [githubUrl, setGithubUrl] = useState('https://github.com/alexrivera-tyc/ai-code-reviewer');
  const [liveUrl, setLiveUrl] = useState('https://ai-reviewer-bot.vercel.app');
  const [demoVideoUrl, setDemoVideoUrl] = useState('https://loom.com/share/demo123');
  const [notes, setNotes] = useState('Implemented FastAPI webhook verification with HMAC-SHA256, chunking git diffs for GPT-4o-mini code recommendations.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'submitted' | 'under_review' | 'approved'>('submitted');

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      projectService.getProjectById(id)
        .then((p) => {
          setProject(p);
          if (p?.submission) {
            setSubmissionStatus(p.submission.status as any);
            setGithubUrl(p.submission.githubUrl);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading capstone specifications and starter kit..." />;
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-tyc-text">Project Not Found</h2>
        <Link to="/projects">
          <Button variant="primary" size="sm">Browse Projects</Button>
        </Link>
      </div>
    );
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      toast('GitHub URL Required', 'Please provide your project repository link.', 'system');
      return;
    }
    setIsSubmitting(true);
    try {
      await projectService.submitProject(project.id, {
        githubUrl,
        liveUrl,
        demoVideoUrl,
        notes
      });
      setSubmissionStatus('submitted');
      triggerCelebration();
      toast('Project Submitted!', 'Your capstone has entered the instructor review queue.', 'assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/projects' },
          { label: project.title }
        ]}
      />

      {/* Header Banner */}
      <div className="bg-white border border-tyc-border rounded-2xl p-6 sm:p-8 shadow-subtle grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="green" size="sm">{project.category}</Badge>
            <Badge variant="dark" size="sm">{project.difficulty}</Badge>
            <Badge variant="orange" size="sm">~{project.estimatedHours} Hours Required</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-tyc-muted leading-relaxed">
            {project.objective}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-tyc-text">Required Stack:</span>
            {project.skills.map((sk) => (
              <span key={sk} className="text-xs px-2.5 py-1 bg-tyc-bg border border-tyc-border rounded-lg text-tyc-text font-medium">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Status Tracker Widget */}
        <div className="bg-tyc-bg border border-tyc-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-tyc-muted uppercase">Lifecycle Status</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={submissionStatus === 'approved' ? 'green' : 'orange'} size="md" dot>
                {submissionStatus === 'submitted' ? 'Submitted & In Queue' : submissionStatus === 'approved' ? 'Approved (Score: 98%)' : 'Draft'}
              </Badge>
            </div>
          </div>

          {/* 4-Step Status Bar */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
              <span className="text-tyc-green">Draft</span>
              <span className="text-tyc-green">Submitted</span>
              <span className="text-tyc-orange">Review</span>
              <span className="text-gray-400">Approved</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
              <div className="bg-tyc-green h-full" />
              <div className="bg-tyc-green h-full" />
              <div className="bg-tyc-orange h-full animate-pulse" />
              <div className="bg-gray-200 h-full" />
            </div>
          </div>

          {project.starterKitUrl && (
            <a href={project.starterKitUrl} target="_blank" rel="noreferrer" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <GithubIcon className="w-3.5 h-3.5 mr-1" />
                Download Starter Repository
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Specs on Left, Submission Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Requirements & Milestones */}
        <div className="lg:col-span-7 space-y-6">
          {/* Problem Statement */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-tyc-text uppercase tracking-wider">
              Problem Statement
            </h3>
            <p className="text-xs text-tyc-muted leading-relaxed">
              {project.problemStatement}
            </p>
          </Card>

          {/* Key Architectural Requirements */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-tyc-text uppercase tracking-wider">
              Functional & Technical Requirements
            </h3>
            <div className="space-y-2.5">
              {project.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-tyc-text leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-tyc-green shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Milestones */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-tyc-text uppercase tracking-wider">
              Project Milestones
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    m.completed ? 'bg-tyc-green-soft/40 border-tyc-green/30' : 'bg-white border-tyc-border'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-tyc-text">{m.title}</span>
                      {m.completed && <Badge variant="green" size="sm">Passed</Badge>}
                    </div>
                    <p className="text-[11px] text-tyc-muted">{m.description}</p>
                  </div>
                  {m.completed && <CheckCircle2 className="w-4 h-4 text-tyc-green shrink-0 mt-0.5" />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Submission Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-modal space-y-5">
            <div className="flex items-center justify-between border-b border-tyc-border pb-3">
              <div>
                <h3 className="text-base font-bold text-tyc-text">Submit Your Solution</h3>
                <p className="text-xs text-tyc-muted">Provide your source code & live URL for instructor review</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-tyc-green" />
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <Input
                label="GitHub Repository URL (Public / Shared)"
                required
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                leftIcon={<GithubIcon className="w-4 h-4" />}
              />

              <Input
                label="Live Deployment URL (Vercel, Render, AWS)"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://my-app.vercel.app"
                leftIcon={<Globe className="w-4 h-4" />}
              />

              <Input
                label="Demo Video / Loom Walkthrough URL"
                type="url"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                placeholder="https://loom.com/share/..."
                leftIcon={<Video className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-medium text-tyc-text mb-1.5">
                  Architecture Notes & Trade-offs
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-white border border-tyc-border rounded-lg p-3 text-tyc-text focus:outline-none focus:border-tyc-green"
                  placeholder="Describe your design decisions, rate-limiting approach, or testing coverage..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
              >
                Submit for Instructor Code Review
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            {/* Instructor Review Preview Feedback */}
            <div className="p-3.5 bg-tyc-green-soft border border-tyc-green/30 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-tyc-green">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instructor Review: Dr. Sarah Chen</span>
              </div>
              <p className="text-[11px] text-tyc-text leading-relaxed">
                &ldquo;Exceptional error boundaries on the GitHub webhook handlers! Clean AST diff chunking prevents prompt token overflow. Approved for Verified Developer Showcase.&rdquo;
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
