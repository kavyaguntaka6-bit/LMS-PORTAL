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
      <div className="space-y-3">
        <Breadcrumb items={[{ label: 'Course Catalog' }]} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
            Production Engineering Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-tyc-muted mt-1 max-w-2xl">
            Explore industry-calibrated courses built around real codebases, practical test suites, and 24/7 AI Tutor assistance.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-tyc-border p-4 rounded-xl shadow-subtle space-y-4">
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-tyc-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, skill (e.g. React, FastAPI, RAG, Docker)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-tyc-bg border border-tyc-border rounded-lg text-tyc-text placeholder-tyc-muted/60 focus:outline-none focus:border-tyc-green"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-tyc-muted font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-tyc-bg border border-tyc-border rounded-lg px-2.5 py-2 text-tyc-text focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Updated</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-tyc-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-tyc-green text-white shadow-sm'
                  : 'bg-tyc-bg text-tyc-muted hover:text-tyc-text hover:bg-gray-200 border border-tyc-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Sub-filters */}
        <div className="flex items-center gap-2 pt-1 text-xs text-tyc-muted">
          <span className="font-semibold">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-gray-900 text-white'
                  : 'text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses match your filter"
          description="Try broadening your search query or switching categories."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedDifficulty('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = user?.enrolledCourseIds.includes(course.id);
            return (
              <Card key={course.id} hoverable className="flex flex-col justify-between overflow-hidden p-0">
                <div className="relative aspect-[16/9] bg-gray-100 border-b border-tyc-border overflow-hidden">
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
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 bg-tyc-green text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-tyc-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.durationHours} hrs
                      </span>
                      <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
                    </div>

                    <h3 className="text-base font-bold text-tyc-text line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-tyc-muted line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>

                    {course.whyThisCourse && (
                      <div className="p-2 bg-tyc-green-soft/50 border border-tyc-green/20 rounded-lg text-[11px] text-tyc-text font-medium flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-tyc-green shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{course.whyThisCourse}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-tyc-border space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 bg-tyc-bg border border-tyc-border rounded text-tyc-muted">
                          {sk}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="text-[11px] text-tyc-muted">+{course.skills.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover border border-tyc-border"
                        />
                        <span className="text-xs font-medium text-tyc-text truncate max-w-[110px]">
                          {course.instructor.name}
                        </span>
                      </div>
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <Button variant={isEnrolled ? "outline" : "primary"} size="sm">
                          {isEnrolled ? 'Resume' : 'Explore'}
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
