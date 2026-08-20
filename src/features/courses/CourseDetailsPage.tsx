import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Play,
  FileCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RatingStars } from '../../components/shared/RatingStars';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { LoadingState } from '../../components/shared/LoadingState';
import { courseService } from '../../services/api';
import { Course } from '../../types';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { enrollCourse, setIsAiTutorOpen, setAiContext } = useLMS();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({ mod_1: true });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      courseService.getCourseById(id)
        .then((c) => {
          setCourse(c);
          if (c) {
            setAiContext({ courseTitle: c.title });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, setAiContext]);

  if (isLoading) {
    return <LoadingState message="Loading syllabus and course specifications..." />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-tyc-text">Course Not Found</h2>
        <p className="text-xs text-tyc-muted">The requested curriculum does not exist or has been relocated.</p>
        <Link to="/courses">
          <Button variant="primary" size="sm">Browse Course Catalog</Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourseIds.includes(course.id);

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollAction = async () => {
    if (isEnrolled) {
      navigate(`/learn/${course.slug || course.id}/les_1_1`);
    } else {
      const success = await enrollCourse(course.id);
      if (success) {
        navigate(`/learn/${course.slug || course.id}/les_1_1`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Courses', href: '/courses' },
          { label: course.title }
        ]}
      />

      {/* Hero Header Card */}
      <div className="bg-white border border-tyc-border rounded-2xl p-6 sm:p-8 shadow-subtle grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="green" size="sm">{course.category}</Badge>
            <Badge variant="dark" size="sm">{course.difficulty}</Badge>
            <Badge variant="orange" size="sm">Industry Capstone Included</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-tyc-muted leading-relaxed">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-tyc-muted pt-2 border-t border-tyc-border">
            <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
            <span>&bull;</span>
            <span>{course.studentsCount.toLocaleString()} Students Enrolled</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {course.durationHours} Hours Total
            </span>
          </div>

          {/* Instructor Pill */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-10 h-10 rounded-full object-cover border border-tyc-border shadow-subtle"
            />
            <div>
              <div className="text-xs font-bold text-tyc-text">{course.instructor.name}</div>
              <div className="text-[11px] text-tyc-muted">{course.instructor.role} &bull; {course.instructor.company}</div>
            </div>
          </div>
        </div>

        {/* Right Col: Course Card & Direct CTA */}
        <div className="bg-tyc-bg border border-tyc-border rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="aspect-[16/9] rounded-lg overflow-hidden border border-tyc-border relative group">
            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white text-tyc-green flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 ml-0.5 fill-tyc-green" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-tyc-text">Free</span>
              <span className="text-xs text-tyc-green font-semibold">Full Ecosystem Access</span>
            </div>
            <p className="text-[11px] text-tyc-muted">Includes 24/7 Socratic AI Tutor, test benches, and verified certificate.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-md"
            onClick={handleEnrollAction}
          >
            {isEnrolled ? 'Resume Learning' : 'Enroll in Course'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Syllabus & Objectives */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Learning Objectives */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-tyc-text flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-tyc-green" />
              What You Will Master
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-tyc-text leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-tyc-green shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Section: Interactive Curriculum Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-tyc-text">Course Curriculum</h3>
                <p className="text-xs text-tyc-muted mt-0.5">
                  {course.modules.length} Modules &bull; {course.lessonsCount} Practical Lessons
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const allOpen = Object.keys(openModules).length === course.modules.length;
                  if (allOpen) setOpenModules({});
                  else {
                    const next: Record<string, boolean> = {};
                    course.modules.forEach(m => { next[m.id] = true; });
                    setOpenModules(next);
                  }
                }}
              >
                Expand / Collapse All
              </Button>
            </div>

            <div className="space-y-3">
              {course.modules.map((mod) => {
                const isOpen = !!openModules[mod.id];
                return (
                  <div key={mod.id} className="bg-white border border-tyc-border rounded-xl overflow-hidden shadow-subtle">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-tyc-bg/50 transition-colors"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-tyc-text">{mod.title}</h4>
                        <span className="text-[11px] text-tyc-muted">
                          {mod.lessons.length} Lessons &bull; ~{Math.round(mod.durationMinutes / 60)} hrs
                        </span>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-tyc-muted" /> : <ChevronDown className="w-4 h-4 text-tyc-muted" />}
                    </button>

                    {isOpen && (
                      <div className="border-t border-tyc-border divide-y divide-tyc-border/60 bg-[#FAFAFA]">
                        {mod.lessons.map((lesson) => {
                          const isCompleted = user?.completedLessonIds.includes(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              to={`/learn/${course.slug || course.id}/${lesson.id}`}
                              className="px-5 py-3 flex items-center justify-between hover:bg-white transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-tyc-green shrink-0" />
                                ) : lesson.type === 'video' ? (
                                  <Play className="w-4 h-4 text-tyc-muted shrink-0" />
                                ) : lesson.type === 'quiz' ? (
                                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                                ) : (
                                  <FileCode className="w-4 h-4 text-tyc-orange shrink-0" />
                                )}
                                <span className="font-medium text-tyc-text">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-tyc-muted text-[11px]">
                                <Badge variant={lesson.type === 'quiz' ? 'orange' : 'gray'} size="sm">
                                  {lesson.type}
                                </Badge>
                                <span>{lesson.durationMinutes}m</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Capstone Project Preview */}
          <Card className="space-y-3 border-tyc-green/40">
            <div className="flex items-center justify-between">
              <Badge variant="green" size="sm">Included Capstone Project</Badge>
              <span className="text-xs text-tyc-muted">Graded by Automated Test Bench</span>
            </div>
            <h4 className="text-sm font-bold text-tyc-text">
              Production SaaS Analytics & Telemetry Engine
            </h4>
            <p className="text-xs text-tyc-muted leading-relaxed">
              Upon finishing all modules, you will build an end-to-end telemetry system supporting time-series querying, role-based dashboards, and automated PR review checks.
            </p>
          </Card>
        </div>

        {/* Right Col: Prerequisites, Skills, Certificate */}
        <div className="space-y-6">
          {/* Prerequisites */}
          <Card className="space-y-3">
            <h4 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
              Prerequisites
            </h4>
            <ul className="space-y-2 text-xs text-tyc-muted">
              {course.prerequisites.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tyc-green" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Skills Acquired */}
          <Card className="space-y-3">
            <h4 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
              Skills You Will Gain
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map((sk) => (
                <Badge key={sk} variant="outline" size="sm">
                  {sk}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Verified Certificate Note */}
          <Card className="space-y-3 bg-tyc-green-soft/30 border-tyc-green/30">
            <div className="flex items-center gap-2 text-tyc-green font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Verifiable Credential</span>
            </div>
            <p className="text-xs text-tyc-muted leading-relaxed">
              Earn an official certificate with cryptographic verification ID upon passing all module quizzes and capstone code reviews.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
