import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Code2,
  Bug,
  Database,
  HelpCircle,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockPracticeProblems } from '../../services/mockData';

export const PracticePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories: { label: string; count: number; icon: React.ReactNode }[] = [
    { label: 'All', count: 180, icon: <Terminal className="w-4 h-4" /> },
    { label: 'Coding', count: 64, icon: <Code2 className="w-4 h-4" /> },
    { label: 'SQL', count: 32, icon: <Database className="w-4 h-4" /> },
    { label: 'Debugging', count: 28, icon: <Bug className="w-4 h-4" /> },
    { label: 'Output Prediction', count: 30, icon: <BrainCircuit className="w-4 h-4" /> },
    { label: 'MCQs', count: 26, icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredProblems = mockPracticeProblems.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesCat && matchesDiff;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Practice Engine' }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Algorithm & Systems Practice Engine
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          Sharpen your technical interview readiness with bite-sized algorithmic puzzles, SQL window functions, and code debugging tests.
        </p>
      </div>

      {/* Top Performance Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-tyc-muted uppercase">Solved Problems</span>
            <div className="text-2xl font-extrabold text-tyc-text mt-0.5">42 / 180</div>
          </div>
          <div className="p-2.5 rounded-xl bg-tyc-green-soft text-tyc-green">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-tyc-muted uppercase">Global Accuracy</span>
            <div className="text-2xl font-extrabold text-tyc-green mt-0.5">84.6%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-tyc-green-soft text-tyc-green">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-tyc-muted uppercase">Practice Streak</span>
            <div className="text-2xl font-extrabold text-tyc-orange mt-0.5">14 Days</div>
          </div>
          <div className="p-2.5 rounded-xl bg-tyc-orange-soft text-tyc-orange">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Category Tabs & Difficulty Sub-filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setSelectedCategory(c.label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === c.label
                  ? 'bg-tyc-green text-white shadow-sm'
                  : 'bg-white text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg border border-tyc-border'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === c.label ? 'bg-white/20 text-white' : 'bg-gray-100 text-tyc-muted'
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-tyc-muted">
          <span className="font-semibold">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-tyc-text text-white'
                  : 'text-tyc-muted hover:text-tyc-text hover:bg-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem List */}
      <div className="space-y-4">
        {filteredProblems.map((prob) => (
          <Card key={prob.id} hoverable className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={prob.difficulty === 'Beginner' ? 'green' : 'orange'} size="sm">
                  {prob.difficulty}
                </Badge>
                <Badge variant="gray" size="sm">{prob.category}</Badge>
                <span className="text-xs text-tyc-muted">&bull; {prob.topic}</span>
              </div>

              <h3 className="text-base font-bold text-tyc-text">{prob.title}</h3>
              <p className="text-xs text-tyc-muted line-clamp-2 max-w-2xl">{prob.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {prob.skills.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-tyc-border">
              <div className="text-left sm:text-right text-xs text-tyc-muted">
                <span className="font-bold text-tyc-green">{prob.accuracyRate}%</span> accuracy
                <div className="text-[10px] text-tyc-muted">{prob.attemptsCount.toLocaleString()} submissions</div>
              </div>

              <Link to="/coding">
                <Button variant="primary" size="sm" className="text-xs">
                  Solve Challenge
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
