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
import { FlashcardDeck } from '../../components/shared/FlashcardDeck';

export const PracticePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories: { label: string; count: number; icon: React.ReactNode }[] = [
    { label: 'All', count: 216, icon: <Terminal className="w-4 h-4" /> },
    { label: 'Flashcards', count: 36, icon: <Sparkles className="w-4 h-4" /> },
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
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Practice Engine' }]} />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/15 border border-[#A7F3D0] dark:border-[#10B981]/30 text-[11px] font-bold text-[#047857] dark:text-[#34D399] mb-2">
            <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Interactive Code Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Algorithm & Systems <span className="text-rainbow">Practice Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed font-normal">
            Sharpen your technical interview readiness with bite-sized algorithmic puzzles, SQL window functions, and code debugging tests.
          </p>
        </div>
      </div>

      {/* Top Performance Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155]">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solved Problems</span>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white mt-0.5">42 / 180</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#ECFDF5] dark:bg-[#10B981]/15 text-[#10B981] border border-[#A7F3D0] dark:border-[#10B981]/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155]">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Global Accuracy</span>
            <div className="text-2xl font-black text-[#10B981] mt-0.5">84.6%</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#ECFDF5] dark:bg-[#10B981]/15 text-[#10B981] border border-[#A7F3D0] dark:border-[#10B981]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155]">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Practice Streak</span>
            <div className="text-2xl font-black text-[#FF8A1F] mt-0.5">14 Days</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF7ED] dark:bg-[#FF8A1F]/15 text-[#FF8A1F] border border-[#FED7AA] dark:border-[#FF8A1F]/30">
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === c.label
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#334155]'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
              <span className="text-[10px] opacity-80">({c.count})</span>
            </button>
          ))}
        </div>

        {/* Difficulty Sub-filter */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Difficulty:</span>
          <div className="flex gap-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcards View or Problems List */}
      {selectedCategory === 'Flashcards' ? (
        <div className="py-2">
          <FlashcardDeck />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((prob) => (
            <Card
              key={prob.id}
              hoverable
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  {prob.category === 'SQL' ? <Database className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{prob.title}</h3>
                    <Badge variant={prob.difficulty === 'Beginner' ? 'green' : prob.difficulty === 'Intermediate' ? 'orange' : 'gray'} size="sm">
                      {prob.difficulty}
                    </Badge>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Topic: {prob.topic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{prob.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{prob.accuracyRate}%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Pass Rate</div>
                </div>

                <Link to="/coding">
                  <Button variant="primary" size="sm">
                    Solve in IDE
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
