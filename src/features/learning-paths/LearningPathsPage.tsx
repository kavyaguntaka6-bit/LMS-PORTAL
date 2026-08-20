import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import {
  Layers,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Code2,
  Cpu,
  Cloud,
  BarChart3
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { mockLearningPaths } from '../../services/mockData';

export const LearningPathsPage: React.FC = () => {
  const { learningPaths } = useLMS();
  const [selectedPathId, setSelectedPathId] = useState(mockLearningPaths[0].id);

  const paths = learningPaths.length > 0 ? learningPaths : mockLearningPaths;
  const activePath = paths.find(p => p.id === selectedPathId) || paths[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Learning Paths' }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Visual Career Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          Comprehensive multi-phase pipelines taking you from foundational programming to portfolio-ready capstones and job placement.
        </p>
      </div>

      {/* Path Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paths.map((path) => {
          const isSelected = path.id === activePath.id;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-tyc-green bg-white shadow-card ring-1 ring-tyc-green'
                  : 'border-tyc-border bg-white hover:bg-tyc-bg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-tyc-green-soft text-tyc-green">
                  <Layers className="w-5 h-5" />
                </div>
                {isSelected && <Badge variant="green" size="sm">Active View</Badge>}
              </div>

              <h3 className="text-sm font-bold text-tyc-text">{path.title}</h3>
              <p className="text-xs text-tyc-green font-semibold mt-0.5">{path.role}</p>

              <div className="flex items-center justify-between text-[11px] text-tyc-muted pt-3 mt-3 border-t border-tyc-border">
                <span>{path.durationMonths} Months</span>
                <span>{path.coursesCount} Courses</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Roadmap Detailed Pipeline */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-subtle">
        {/* Path Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-tyc-border pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="green" size="sm">Career Track</Badge>
              <span className="text-xs text-tyc-muted">{activePath.level}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-tyc-text">{activePath.title}</h2>
            <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">{activePath.description}</p>
          </div>

          <Link to="/courses">
            <Button variant="primary" size="md" className="shadow-sm">
              Start This Career Track
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-tyc-muted bg-tyc-bg p-3.5 rounded-xl border border-tyc-border">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-tyc-green" />
            <span className="font-medium text-tyc-text">Completed Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-tyc-orange" />
            <span className="font-medium text-tyc-text">Current Active Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="font-medium text-tyc-text">Upcoming Phase</span>
          </div>
        </div>

        {/* Vertical Pipeline Steps */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-tyc-border">
          {(activePath.milestones.length > 0 ? activePath.milestones : [
            { id: 'm1', title: 'Phase 1: Foundational Core & Syntax', description: 'Master language mechanics, memory model, and unit testing.', skills: ['Core CS'], status: 'completed', order: 1 },
            { id: 'm2', title: 'Phase 2: Modern Application Architecture', description: 'Component lifecycles, state stores, and asynchronous REST APIs.', skills: ['Architecture'], status: 'in_progress', order: 2 },
            { id: 'm3', title: 'Phase 3: Production Capstone & Portfolio', description: 'Publish verified full-stack project with automated test runner.', skills: ['Production'], status: 'upcoming', isCapstone: true, order: 3 },
          ]).map((milestone, idx) => {
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';

            return (
              <div key={milestone.id} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform ${
                    isCompleted
                      ? 'bg-tyc-green'
                      : isInProgress
                      ? 'bg-tyc-orange animate-pulse ring-4 ring-tyc-orange/20'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                {/* Milestone Content Card */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    isInProgress
                      ? 'border-tyc-orange/50 bg-tyc-orange-soft/20 shadow-subtle'
                      : isCompleted
                      ? 'border-tyc-green/40 bg-tyc-green-soft/20'
                      : 'border-tyc-border bg-white opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-tyc-text">{milestone.title}</h4>
                      {milestone.isCapstone && (
                        <Badge variant="orange" size="sm">Capstone Milestone</Badge>
                      )}
                    </div>
                    <Badge variant={isCompleted ? 'green' : isInProgress ? 'orange' : 'gray'} size="sm">
                      {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Upcoming'}
                    </Badge>
                  </div>

                  <p className="text-xs text-tyc-muted leading-relaxed mb-3">
                    {milestone.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-tyc-border/60">
                    <span className="text-[11px] font-semibold text-tyc-muted">Key Skills:</span>
                    {milestone.skills.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 bg-white border border-tyc-border rounded text-tyc-text">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
