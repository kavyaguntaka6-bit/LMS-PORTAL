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
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Learning Paths' }]} />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/15 border border-[#A7F3D0] dark:border-[#10B981]/30 text-[11px] font-bold text-[#047857] dark:text-[#34D399] mb-2">
            <Layers className="w-3.5 h-3.5 text-[#10B981]" />
            <span>End-to-End Skill Roadmaps</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Visual Career <span className="text-rainbow">Roadmaps</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed font-normal">
            Comprehensive multi-phase pipelines taking you from foundational programming to portfolio-ready capstones and job placement.
          </p>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paths.map((path, idx) => {
          const isSelected = path.id === activePath.id;
          const pathThemes = [
            {
              card: 'bg-gradient-to-br from-indigo-50/70 via-white to-white dark:from-indigo-950/20 dark:via-[#0F172A] dark:to-[#0F172A]',
              border: 'border-indigo-300 dark:border-indigo-800/60 hover:border-indigo-400',
              selected: 'border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-50/90 dark:bg-indigo-950/40 shadow-md',
              iconBox: 'bg-[#EEF2FF] text-[#6366F1] border-[#C7D2FE] dark:bg-[#6366F1]/20 dark:text-[#818CF8]',
              roleText: 'text-indigo-700 dark:text-indigo-300',
              badge: 'ai' as const
            },
            {
              card: 'bg-gradient-to-br from-amber-50/70 via-white to-white dark:from-amber-950/20 dark:via-[#0F172A] dark:to-[#0F172A]',
              border: 'border-amber-300 dark:border-amber-800/60 hover:border-amber-400',
              selected: 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/90 dark:bg-amber-950/40 shadow-md',
              iconBox: 'bg-[#FFF7ED] text-[#FF8A1F] border-[#FED7AA] dark:bg-[#FF8A1F]/20 dark:text-[#FB923C]',
              roleText: 'text-amber-700 dark:text-amber-300',
              badge: 'orange' as const
            },
            {
              card: 'bg-gradient-to-br from-emerald-50/70 via-white to-white dark:from-emerald-950/20 dark:via-[#0F172A] dark:to-[#0F172A]',
              border: 'border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400',
              selected: 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-md',
              iconBox: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0] dark:bg-[#10B981]/20 dark:text-[#34D399]',
              roleText: 'text-emerald-700 dark:text-emerald-300',
              badge: 'green' as const
            },
            {
              card: 'bg-gradient-to-br from-cyan-50/70 via-white to-white dark:from-cyan-950/20 dark:via-[#0F172A] dark:to-[#0F172A]',
              border: 'border-cyan-300 dark:border-cyan-800/60 hover:border-cyan-400',
              selected: 'border-cyan-500 ring-2 ring-cyan-500/25 bg-cyan-50/90 dark:bg-cyan-950/40 shadow-md',
              iconBox: 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1] dark:bg-[#22D3EE]/20 dark:text-[#22D3EE]',
              roleText: 'text-cyan-700 dark:text-cyan-300',
              badge: 'cyan' as const
            }
          ];
          const curTheme = pathThemes[idx % pathThemes.length];

          return (
            <div
              key={path.id}
              onClick={() => setSelectedPathId(path.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${curTheme.card} ${
                isSelected
                  ? curTheme.selected
                  : `${curTheme.border} shadow-xs hover:shadow-md`
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border shadow-xs ${curTheme.iconBox}`}>
                  <Layers className="w-5 h-5" />
                </div>
                {isSelected && <Badge variant={curTheme.badge} size="sm">Active View</Badge>}
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{path.title}</h3>
              <p className={`text-xs font-bold mt-1 ${curTheme.roleText}`}>{path.role}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-3 mt-3 border-t border-slate-200/70 dark:border-slate-800 font-medium">
                <span>{path.durationMonths} Months</span>
                <span>{path.coursesCount} Courses</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Roadmap Detailed Pipeline */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-sm dark:shadow-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
        {/* Path Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="green" size="sm">Career Track</Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">{activePath.level}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activePath.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{activePath.description}</p>
          </div>

          <Link to="/courses">
            <Button variant="primary" size="md" className="shadow-sm">
              Start This Career Track
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#161F30] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 1: Foundations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 2: Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 3: Production Capstone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Phase 4: Industry Certification</span>
          </div>
        </div>

        {/* Step-by-Step Curriculum Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Roadmap Milestones & Projects
          </h3>

          <div className="space-y-4">
            {activePath.milestones.map((step, idx) => {
              const phaseCardStyles = [
                { bg: 'bg-gradient-to-br from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-[#161F30] dark:to-[#161F30]', border: 'border-emerald-200 dark:border-emerald-800/60', badge: 'bg-[#10B981] text-white', statusVariant: 'green' as const },
                { bg: 'bg-gradient-to-br from-amber-50/60 via-white to-white dark:from-amber-950/20 dark:via-[#161F30] dark:to-[#161F30]', border: 'border-amber-200 dark:border-amber-800/60', badge: 'bg-[#FF8A1F] text-white', statusVariant: 'orange' as const },
                { bg: 'bg-gradient-to-br from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-[#161F30] dark:to-[#161F30]', border: 'border-purple-200 dark:border-purple-800/60', badge: 'bg-[#6366F1] text-white', statusVariant: 'ai' as const },
                { bg: 'bg-gradient-to-br from-cyan-50/60 via-white to-white dark:from-cyan-950/20 dark:via-[#161F30] dark:to-[#161F30]', border: 'border-cyan-200 dark:border-cyan-800/60', badge: 'bg-[#0891B2] text-white', statusVariant: 'cyan' as const },
              ];
              const pStyle = phaseCardStyles[idx % phaseCardStyles.length];

              return (
                <div
                  key={step.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-xs hover:shadow-md ${pStyle.bg} ${pStyle.border}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${pStyle.badge}`}>
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                        <Badge variant={pStyle.statusVariant} size="sm">{step.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{step.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {step.skills.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-white/90 dark:bg-[#0D121F] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end md:self-center">
                    <Link to="/courses">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Module
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
