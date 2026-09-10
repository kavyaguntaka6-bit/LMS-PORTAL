import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import {
  Search,
  BookOpen,
  Layers,
  Code2,
  Briefcase,
  Calendar,
  X
} from 'lucide-react';
import { mockPracticeProblems, mockProjects, mockJobOpportunities, mockWorkshops, mockHackathons } from '../../services/mockData';
import { Badge } from '../ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, courses, learningPaths } = useLMS();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter across all types
  const lower = query.toLowerCase().trim();

  const filteredCourses = (courses || []).filter(c =>
    c.title.toLowerCase().includes(lower) || c.skills.some(s => s.toLowerCase().includes(lower))
  ).slice(0, 3);

  const filteredPaths = (learningPaths || []).filter(p =>
    p.title.toLowerCase().includes(lower) || p.skills.some(s => s.toLowerCase().includes(lower))
  ).slice(0, 2);

  const filteredProjects = mockProjects.filter(p =>
    p.title.toLowerCase().includes(lower) || p.skills.some(s => s.toLowerCase().includes(lower))
  ).slice(0, 2);

  const filteredProblems = mockPracticeProblems.filter(p =>
    p.title.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)
  ).slice(0, 2);

  const filteredJobs = mockJobOpportunities.filter(j =>
    j.title.toLowerCase().includes(lower) || j.company.toLowerCase().includes(lower)
  ).slice(0, 2);

  const filteredWorkshops = mockWorkshops.filter(w =>
    w.title.toLowerCase().includes(lower)
  ).slice(0, 2);

  const totalResultsCount =
    filteredCourses.length +
    filteredPaths.length +
    filteredProjects.length +
    filteredProblems.length +
    filteredJobs.length +
    filteredWorkshops.length;

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
        {/* Search input header */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, learning paths, practice, projects, career..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResultsCount === 0 && query ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No results found for &ldquo;<span className="font-semibold text-slate-900 dark:text-white">{query}</span>&rdquo;. Try searching for &ldquo;React&rdquo;, &ldquo;Python&rdquo;, &ldquo;AI&rdquo;, or &ldquo;SQL&rdquo;.
            </div>
          ) : null}

          {/* Quick Suggestions if query is empty */}
          {!query && (
            <div className="space-y-3 p-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Generative AI', 'Python FastAPI', 'Kubernetes', 'DSA Blueprint', 'Remote Internships'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-[#161F30] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
                Courses
              </div>
              <div className="space-y-1">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/courses/${c.slug || c.id}`)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.category} &bull; {c.durationHours}h</span>
                      </div>
                    </div>
                    <Badge variant="green" size="sm">Course</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice */}
          {filteredProblems.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
                Practice Problems
              </div>
              <div className="space-y-1">
                {filteredProblems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('/practice')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{p.category} &bull; Verified Problem</span>
                      </div>
                    </div>
                    <Badge variant="green" size="sm">{p.difficulty}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
