import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import {
  Search,
  BookOpen,
  Layers,
  Code2,
  Terminal,
  Briefcase,
  Award,
  Calendar,
  X,
  ArrowRight
} from 'lucide-react';
import { mockPracticeProblems, mockProjects, mockJobOpportunities, mockWorkshops, mockHackathons } from '../../services/mockData';
import { Badge } from '../ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, courses, learningPaths } = useLMS();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto bg-black/40 backdrop-blur-[2px]">
      <div className="relative w-full max-w-2xl bg-white border border-tyc-border rounded-xl shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-tyc-border gap-3">
          <Search className="w-5 h-5 text-tyc-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, learning paths, practice, projects, career..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-tyc-text placeholder-tyc-muted/60 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-tyc-muted hover:text-tyc-text p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-semibold text-tyc-muted bg-tyc-bg border border-tyc-border px-2 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {totalResultsCount === 0 && query ? (
            <div className="py-12 text-center text-xs text-tyc-muted">
              No results found for &ldquo;<span className="font-semibold text-tyc-text">{query}</span>&rdquo;. Try searching for &ldquo;React&rdquo;, &ldquo;Python&rdquo;, &ldquo;AI&rdquo;, or &ldquo;SQL&rdquo;.
            </div>
          ) : null}

          {/* Quick Suggestions if query is empty */}
          {!query && (
            <div className="space-y-3 p-2">
              <div className="text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Generative AI', 'Python FastAPI', 'Kubernetes', 'DSA Blueprint', 'Remote Internships'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-2.5 py-1 bg-tyc-bg hover:bg-gray-200 border border-tyc-border rounded-lg text-tyc-text transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-tyc-green" />
                <span>Courses</span>
              </div>
              <div className="space-y-1">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/courses/${c.slug || c.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-tyc-bg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 border border-tyc-border overflow-hidden shrink-0">
                        <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-tyc-text">{c.title}</div>
                        <div className="text-[11px] text-tyc-muted">{c.instructor.name} • {c.durationHours}h • {c.difficulty}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-tyc-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Paths */}
          {filteredPaths.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-tyc-orange" />
                <span>Career Learning Paths</span>
              </div>
              <div className="space-y-1">
                {filteredPaths.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/learning-paths`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-tyc-bg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-tyc-text">{p.title}</div>
                      <div className="text-[11px] text-tyc-muted">{p.role} • {p.durationMonths} months • {p.coursesCount} courses</div>
                    </div>
                    <Badge variant="orange" size="sm">Roadmap</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-tyc-green" />
                <span>Industry Projects</span>
              </div>
              <div className="space-y-1">
                {filteredProjects.map((prj) => (
                  <div
                    key={prj.id}
                    onClick={() => handleSelect(`/projects/${prj.slug || prj.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-tyc-bg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-tyc-text">{prj.title}</div>
                      <div className="text-[11px] text-tyc-muted">{prj.difficulty} • ~{prj.estimatedHours} hrs • {prj.skills.slice(0, 3).join(', ')}</div>
                    </div>
                    <Badge variant="green" size="sm">Project</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice */}
          {filteredProblems.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                <span>Practice Engine</span>
              </div>
              <div className="space-y-1">
                {filteredProblems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => handleSelect(`/coding`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-tyc-bg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-tyc-text">{prob.title}</div>
                      <div className="text-[11px] text-tyc-muted">{prob.category} • {prob.difficulty} • {prob.accuracyRate}% accuracy</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-tyc-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs & Internships */}
          {filteredJobs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-tyc-muted uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Career Opportunities</span>
              </div>
              <div className="space-y-1">
                {filteredJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => handleSelect(`/career`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-tyc-bg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-tyc-text">{j.title}</div>
                      <div className="text-[11px] text-tyc-muted">{j.company} • {j.salaryOrStipend} • {j.type}</div>
                    </div>
                    <Badge variant="gray" size="sm">Apply</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-tyc-bg border-t border-tyc-border flex items-center justify-between text-[11px] text-tyc-muted">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-semibold text-tyc-text">ESC</kbd> to exit</span>
            <span>Click any item to navigate</span>
          </div>
          <span className="font-medium text-tyc-green">TYC Search Index v2.4</span>
        </div>
      </div>
    </div>
  );
};
