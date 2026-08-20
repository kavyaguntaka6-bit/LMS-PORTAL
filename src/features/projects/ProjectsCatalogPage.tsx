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
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Industry Projects' }]} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Industry Capstone Projects
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          Build and deploy complete production systems with real API webhooks, automated pull request tests, and instructor code evaluations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced', 'Industry Capstone'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedDifficulty === diff
                ? 'bg-tyc-green text-white shadow-sm'
                : 'bg-white text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg border border-tyc-border'
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
            <div className="relative aspect-[16/9] bg-gray-100 border-b border-tyc-border overflow-hidden">
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
                <div className="flex items-center justify-between text-xs text-tyc-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{project.estimatedHours} Hours
                  </span>
                  <Badge variant={project.status === 'in_progress' ? 'orange' : 'gray'} size="sm">
                    {project.status === 'in_progress' ? 'In Progress' : 'Available'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-tyc-text leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-tyc-muted line-clamp-2 leading-relaxed">
                  {project.objective}
                </p>
              </div>

              <div className="pt-3 border-t border-tyc-border space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.slice(0, 3).map((sk) => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
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
