import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  BookOpen,
  Filter,
  Star,
  Clock,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RatingStars } from '../../components/shared/RatingStars';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { EmptyState } from '../../components/shared/EmptyState';

export const CourseCatalogPage: React.FC = () => {
  const { courses } = useLMS();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const categories = [
    'All',
    'Frontend & Full Stack',
    'Artificial Intelligence',
    'Backend & Systems',
    'Computer Science',
    'Cloud & DevOps',
    'Data Science & ML'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    return (courses || []).filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.studentsCount - a.studentsCount;
      return 0;
    });
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Explore Courses' }]} />
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/15 border border-[#A7F3D0] dark:border-[#10B981]/30 text-xs font-bold text-[#047857] dark:text-[#34D399] mb-2 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Curated Engineering Tracks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore <span className="text-rainbow">Engineering Masterclasses</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-normal">
            Explore industry-calibrated courses built around real codebases, practical test suites, and 24/7 AI Tutor assistance.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-6 rounded-2xl shadow-xs space-y-4">
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, skill (e.g. React, FastAPI, RAG, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm bg-slate-50 dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none cursor-pointer font-medium"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Published</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-[#334155]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Difficulty:</span>
          <div className="flex gap-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-slate-400" />}
          title="No masterclasses matched your filter"
          description="Try broadening your search term or clearing the active category filters."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedDifficulty('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = user?.enrolledCourseIds?.includes(course.id);

            return (
              <Card key={course.id} hoverable className="flex flex-col justify-between overflow-hidden p-0">
                {/* Thumbnail Header */}
                <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="dark" size="sm">{course.difficulty}</Badge>
                    <Badge variant="green" size="sm">{course.category}</Badge>
                  </div>
                  {isEnrolled && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationHours} hours
                      </span>
                      <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Instructor & Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                          {sk}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">+{course.skills.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{course.instructor.name}</span>
                      </div>
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <Button variant={isEnrolled ? "secondary" : "primary"} size="sm">
                          {isEnrolled ? "Resume Course" : "Explore"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
