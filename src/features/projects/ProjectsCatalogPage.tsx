import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockProjects } from '../../services/mockData';

export const ProjectsCatalogPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredProjects = mockProjects.filter((p) => {
    return selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Industry Projects' }]} />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-300 mb-2">
            <span>Portfolio Capstone Builder</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#11184A] dark:text-white tracking-tight">
            Industry <span className="text-cyan-purple">Capstone Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6680] dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed font-normal">
            Build and deploy complete production systems with real API webhooks, automated pull request tests, and instructor code evaluations.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Beginner', 'Intermediate', 'Advanced', 'Industry Capstone'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDifficulty === diff
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-[#0D121F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} hoverable className="flex flex-col justify-between overflow-hidden p-0">
            <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="dark" size="sm">{project.difficulty}</Badge>
                <Badge variant="green" size="sm">{project.category}</Badge>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{project.estimatedHours} Hours
                  </span>
                  <Badge variant={project.status === 'in_progress' ? 'orange' : 'gray'} size="sm">
                    {project.status === 'in_progress' ? 'In Progress' : 'Available'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {project.objective}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.slice(0, 3).map((sk) => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-1">
                  <Link to={`/projects/${project.slug || project.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      View Project Specs & Submit
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
