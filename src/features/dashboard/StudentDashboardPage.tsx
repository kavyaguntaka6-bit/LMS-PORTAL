import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Zap,
  Code2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Target,
  FileCode,
  Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { StatCard } from '../../components/shared/StatCard';
import { mockProjects, mockWorkshops, mockHackathons } from '../../services/mockData';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, setIsAiTutorOpen, triggerCelebration } = useLMS();

  const enrolled = (courses || []).filter(c => user?.enrolledCourseIds.includes(c.id));
  const fallbackEnrolled = enrolled.length > 0 ? enrolled : (courses || []).slice(0, 2);

  // 7-day streak activity mock
  const weekDays = [
    { day: 'Mon', active: true, hours: 2.5 },
    { day: 'Tue', active: true, hours: 3.0 },
    { day: 'Wed', active: true, hours: 1.5 },
    { day: 'Thu', active: true, hours: 4.0 },
    { day: 'Fri', active: true, hours: 2.5 },
    { day: 'Sat', active: true, hours: 3.5 },
    { day: 'Sun', active: true, hours: 1.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Section: Greeting & Goal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-tyc-border p-6 rounded-2xl shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
              Good morning, {user?.name || 'Alex'}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-tyc-muted">
            Continue your journey toward{' '}
            <strong className="text-tyc-green font-semibold">{user?.careerGoal || 'Full Stack AI Developer'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAiTutorOpen(true)}
            className="text-xs font-semibold text-tyc-green border-tyc-green/30 bg-tyc-green-soft hover:bg-tyc-green/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Learning Copilot
          </Button>
          <Link to="/practice">
            <Button variant="primary" size="sm" className="text-xs">
              <Code2 className="w-3.5 h-3.5 mr-1" />
              Daily Practice
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= HIGH IMPORTANCE: NEXT BEST ACTION CARD ================= */}
      <div className="p-5 bg-gradient-to-r from-tyc-green-soft/80 via-white to-tyc-orange-soft/50 border border-tyc-green/30 rounded-2xl shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-tyc-green text-white shadow-sm shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="green" size="sm">High Priority Recommendation</Badge>
              <span className="text-[11px] text-tyc-muted font-medium">Estimated 25 mins</span>
            </div>
            <h3 className="text-base font-bold text-tyc-text">
              Complete Lesson 1.2: React 19 useActionState & useOptimistic
            </h3>
            <p className="text-xs text-tyc-muted max-w-2xl mt-0.5">
              You are 2 lessons away from completing Module 1 and unlocking the Milestone 1 Assessment badge.
            </p>
          </div>
        </div>

        <Link to="/courses/fullstack-react-typescript-mastery" className="shrink-0 w-full md:w-auto">
          <Button variant="primary" size="md" className="w-full md:w-auto shadow-sm">
            Continue Lesson
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* ================= LEARNING STATS & STREAK ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Learning Streak"
          value={`${user?.streakDays || 14} Days`}
          subtitle={`Personal Best: ${user?.longestStreak || 28} Days`}
          icon={<Flame className="w-5 h-5 text-tyc-orange fill-tyc-orange" />}
          iconBgColor="orange"
        />

        <StatCard
          title="Weekly Learning"
          value={`${user?.weeklyHoursSpent || 18.5} hrs`}
          subtitle="Target: 15 hrs / week"
          trend={{ value: '3.5 hrs', isPositive: true }}
          icon={<Clock className="w-5 h-5 text-tyc-green" />}
          iconBgColor="green"
        />

        <StatCard
          title="Completed Lessons"
          value={`${user?.completedLessonIds.length || 14} / 48`}
          subtitle="Across 3 active courses"
          icon={<CheckCircle2 className="w-5 h-5 text-tyc-green" />}
          iconBgColor="green"
        />

        <StatCard
          title="Verified Certificates"
          value={`${user?.certificatesEarned || 2}`}
          subtitle="Verifiable on profile"
          icon={<Award className="w-5 h-5 text-purple-600" />}
          iconBgColor="gray"
        />
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Continue Learning & Skill Matrix */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Continue Learning */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-tyc-green" />
                <h2 className="text-base font-bold text-tyc-text">Continue Learning</h2>
              </div>
              <Link to="/courses" className="text-xs text-tyc-green font-semibold hover:underline">
                View All Courses
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackEnrolled.map((course, idx) => {
                const progress = idx === 0 ? 68 : 34;
                return (
                  <Card key={course.id} className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-tyc-border overflow-hidden shrink-0">
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Badge variant="green" size="sm" className="mb-1">{course.category}</Badge>
                          <h3 className="text-sm font-bold text-tyc-text">{course.title}</h3>
                          <p className="text-xs text-tyc-muted mt-0.5">
                            Next: {idx === 0 ? 'Lesson 1.2 useActionState' : 'Lesson 2.1 Vector Indexing'}
                          </p>
                        </div>
                      </div>

                      <Link to={`/courses/${course.slug || course.id}`} className="shrink-0">
                        <Button variant="primary" size="sm">
                          Continue
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-tyc-border/60">
                      <div className="flex justify-between text-xs">
                        <span className="text-tyc-muted font-medium">Course Progress</span>
                        <span className="font-bold text-tyc-text">{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} color={progress > 50 ? 'green' : 'orange'} size="sm" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section: 7-Day Activity Matrix */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-tyc-text">Weekly Activity Heatmap</h3>
                <p className="text-xs text-tyc-muted">Consistent daily coding builds long-term retention</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-tyc-orange bg-tyc-orange-soft px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5 fill-tyc-orange" />
                <span>14 Day Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {weekDays.map((w) => (
                <div
                  key={w.day}
                  className="p-3 rounded-xl bg-tyc-green-soft border border-tyc-green/20 text-center space-y-1"
                >
                  <span className="text-[11px] font-semibold text-tyc-muted block">{w.day}</span>
                  <div className="w-6 h-6 rounded-full bg-tyc-green text-white text-xs font-bold flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <span className="text-[10px] text-tyc-green font-bold block">{w.hours}h</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Section: Skill Proficiency Matrix */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-tyc-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-tyc-text">Skill Proficiency & Verification</h3>
                <p className="text-xs text-tyc-muted">Calculated from problem solving, quizzes & code reviews</p>
              </div>
              <Link to="/portfolio" className="text-xs text-tyc-green font-semibold hover:underline">
                Public Profile
              </Link>
            </div>

            <div className="space-y-4">
              {(user?.skills || []).map((sk) => (
                <div key={sk.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-tyc-text">{sk.name}</span>
                      {sk.verified && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-tyc-green-soft text-tyc-green rounded font-semibold border border-tyc-green/20">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-tyc-text">{sk.level}%</span>
                  </div>
                  <ProgressBar progress={sk.level} color={sk.level >= 75 ? 'green' : 'orange'} size="xs" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Upcoming Deadlines, Workshops & Capstones */}
        <div className="space-y-6">
          {/* Active Capstones */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-tyc-text flex items-center gap-2">
                <FileCode className="w-4 h-4 text-tyc-green" />
                Active Capstones
              </h3>
              <Link to="/projects" className="text-xs text-tyc-green font-semibold hover:underline">
                Explore
              </Link>
            </div>

            <div className="p-3.5 bg-tyc-bg border border-tyc-border rounded-xl space-y-2">
              <Badge variant="orange" size="sm">Milestone 2 In Review</Badge>
              <h4 className="text-xs font-bold text-tyc-text">{mockProjects[0].title}</h4>
              <p className="text-[11px] text-tyc-muted line-clamp-2">
                {mockProjects[0].objective}
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-tyc-muted font-medium">Milestones: 2 / 4</span>
                <Link to={`/projects/${mockProjects[0].id}`}>
                  <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                    View Specs
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Upcoming Schedule / Deadlines */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-tyc-border pb-3">
              <h3 className="text-sm font-bold text-tyc-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-tyc-orange" />
                Upcoming Schedule
              </h3>
              <span className="text-[11px] text-tyc-muted">Next 7 days</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-tyc-border bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-tyc-text">Live Masterclass: Multi-Agents</span>
                  <Badge variant="green" size="sm">RSVP&apos;d</Badge>
                </div>
                <p className="text-tyc-muted text-[11px]">Saturday, Feb 28 &bull; 6:00 PM IST</p>
              </div>

              <div className="p-3 rounded-lg border border-tyc-border bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-tyc-text">Assignment 1.3 Quiz Due</span>
                  <span className="text-[10px] text-red-600 font-semibold">In 2 Days</span>
                </div>
                <p className="text-tyc-muted text-[11px]">TypeScript Generics & React 19 State</p>
              </div>

              <div className="p-3 rounded-lg border border-tyc-border bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-tyc-text">Global AI Hackathon 2026</span>
                  <Badge variant="orange" size="sm">$25k Pool</Badge>
                </div>
                <p className="text-tyc-muted text-[11px]">Starts March 14 &bull; 48hr Sprint</p>
              </div>
            </div>
          </Card>

          {/* Career Opportunity Alert */}
          <div className="p-4 bg-white border border-tyc-border rounded-xl shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
              <Briefcase className="w-4 h-4" />
              <span>Career Fast-Track Match</span>
            </div>
            <p className="text-xs text-tyc-muted leading-relaxed">
              Your profile matches 92% of the requirements for <strong>Junior Full Stack AI Engineer</strong> at Anthropic Partner Studio.
            </p>
            <Link to="/career">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Inspect Match & Apply
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
