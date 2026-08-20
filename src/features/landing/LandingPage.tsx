import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Code2,
  Award,
  Briefcase,
  Users,
  Terminal,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
  ChevronRight,
  BookOpen,
  Layers,
  Flame,
  Clock,
  Compass,
  Cpu,
  BrainCircuit,
  MessageSquare,
  Check,
  Rocket
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { RatingStars } from '../../components/shared/RatingStars';
import { ProgressBar } from '../../components/shared/ProgressBar';
import {
  mockCourses,
  mockLearningPaths,
  mockProjects,
  mockWorkshops,
  mockHackathons
} from '../../services/mockData';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, setIsAiTutorOpen } = useLMS();
  const navigate = useNavigate();

  const [interactiveTab, setInteractiveTab] = useState<'progress' | 'tutor' | 'project'>('progress');

  const philosophySteps = [
    { title: '1. Discover', desc: 'Identify your target high-demand career role & skill gap.', color: 'green' },
    { title: '2. Learn', desc: 'Master production concepts through structured video & reading modules.', color: 'green' },
    { title: '3. Understand', desc: 'Deepen intuition with 24/7 Socratic AI Tutor explanations.', color: 'orange' },
    { title: '4. Practice', desc: 'Solve bite-sized algorithmic, SQL, and debugging challenges.', color: 'orange' },
    { title: '5. Assess', desc: 'Pass rigorous module benchmarks and knowledge evaluations.', color: 'green' },
    { title: '6. Build', desc: 'Develop real-world industry capstone applications from scratch.', color: 'orange' },
    { title: '7. Prove', desc: 'Submit code with automated linting & instructor PR reviews.', color: 'green' },
    { title: '8. Certify', desc: 'Earn verifiable, cryptographically-backed skill credentials.', color: 'green' },
    { title: '9. Showcase', desc: 'Publish an interactive recruiter-ready developer portfolio.', color: 'orange' },
    { title: '10. Get Opportunity', desc: 'Unlock fast-track interviews, fellowships, and internships.', color: 'green' }
  ];

  return (
    <div className="bg-tyc-bg dark:bg-[#0B0F19] text-tyc-text dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* ================= SECTION 1: HERO ================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white dark:bg-[#0B0F19] border-b border-tyc-border dark:border-[#1E293B] bg-lms-mesh">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-500/15 dark:bg-violet-500/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            {/* Top Announcement Badge */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm cursor-pointer"
              onClick={() => setIsAiTutorOpen(true)}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>TYC 2026 AI Learning & Career Ecosystem is Live</span>
              <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Learn Skills. Build Projects.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
                Become Industry Ready.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              The modern LMS built by Traya Yukti Core. Master full-stack architectures, algorithms, and AI engineering through structured masterclasses, live sandboxes, and portfolio capstones.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link to="/courses">
                <Button variant="primary" size="lg" className="shadow-md hover:scale-105 transition-transform">
                  Explore Masterclasses
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/coding">
                <Button variant="green" size="lg" className="shadow-md hover:scale-105 transition-transform">
                  <Terminal className="w-4 h-4 mr-1.5" />
                  Coding Sandbox Lab
                </Button>
              </Link>
              <Link to={user ? "/dashboard" : "/register"}>
                <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                  {user ? "Student Portal" : "Start Learning Free"}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual: Realistic LMS Dashboard Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-modal overflow-hidden tyc-glow-indigo">
              {/* Product Window Header */}
              <div className="bg-slate-50 dark:bg-[#0F172A] px-4 py-3 border-b border-slate-200 dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium ml-2 hidden sm:inline">
                    tyc.lms.app/student/dashboard/alex-rivera
                  </span>
                </div>

                {/* Tabs inside preview */}
                <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => setInteractiveTab('progress')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      interactiveTab === 'progress'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Active Progress
                  </button>
                  <button
                    onClick={() => setInteractiveTab('tutor')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      interactiveTab === 'tutor'
                        ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 font-bold shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    AI Copilot Live
                  </button>
                  <button
                    onClick={() => setInteractiveTab('project')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      interactiveTab === 'project'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 font-bold shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Capstone Pipeline
                  </button>
                </div>
              </div>

              {/* Product Window Body */}
              <div className="p-6 bg-white dark:bg-[#111827] min-h-[380px]">
                {interactiveTab === 'progress' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Active Course */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="green" size="sm" dot>In Progress</Badge>
                        <span className="text-xs text-tyc-muted dark:text-gray-400 font-mono">Sprint Target: 4 days remaining</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-tyc-text dark:text-white">
                          Full Stack React 19 & TypeScript Architecture
                        </h3>
                        <p className="text-xs text-tyc-muted dark:text-gray-400 mt-1">
                          Module 2: Advanced State & Network Architecture • Lesson 2.2 Zustand Store
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-tyc-text dark:text-gray-200">Overall Course Progress</span>
                          <span className="text-tyc-green dark:text-green-400 font-mono">68%</span>
                        </div>
                        <ProgressBar progress={68} color="green" size="md" />
                      </div>

                      {/* Next Best Action Banner */}
                      <div className="p-3.5 bg-tyc-orange-50/70 dark:bg-tyc-orange-950/30 border border-tyc-orange-200 dark:border-orange-900/50 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-tyc-orange text-white shadow-sm animate-pulse-glow">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-tyc-text dark:text-white">Next Best Learning Action</div>
                            <div className="text-[11px] text-tyc-muted dark:text-gray-400">Complete Lesson 2.2 practice exercise to unlock Module 3 Capstone</div>
                          </div>
                        </div>
                        <Link to="/courses/fullstack-react-typescript-mastery">
                          <Button variant="orange" size="sm">
                            Resume
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Real-time Skill Stats */}
                    <div className="bg-tyc-bg dark:bg-[#18201B] p-4 rounded-xl border border-tyc-border dark:border-[#222E26] space-y-4">
                      <div className="flex items-center justify-between border-b border-tyc-border dark:border-gray-800 pb-2">
                        <span className="text-xs font-bold text-tyc-text dark:text-white">Skill Proficiency</span>
                        <span className="text-[11px] text-tyc-green dark:text-green-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-tyc-text dark:text-gray-200">React 19 & TypeScript</span>
                            <span className="font-semibold text-tyc-green dark:text-green-400 font-mono">84%</span>
                          </div>
                          <ProgressBar progress={84} color="green" size="xs" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-tyc-text dark:text-gray-200">Python FastAPI</span>
                            <span className="font-semibold text-tyc-green dark:text-green-400 font-mono">78%</span>
                          </div>
                          <ProgressBar progress={78} color="green" size="xs" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-tyc-text dark:text-gray-200">PostgreSQL & SQL</span>
                            <span className="font-semibold text-tyc-orange dark:text-orange-400 font-mono">64%</span>
                          </div>
                          <ProgressBar progress={64} color="orange" size="xs" />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-tyc-border dark:border-gray-800 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-tyc-orange font-bold">
                          <Flame className="w-3.5 h-3.5 fill-tyc-orange animate-bounce" /> 14-Day Streak
                        </span>
                        <span className="text-tyc-muted dark:text-gray-400 font-mono">18.5 hrs this week</span>
                      </div>
                    </div>
                  </div>
                )}

                {interactiveTab === 'tutor' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-tyc-border dark:border-gray-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-tyc-green animate-pulse" />
                        <span className="text-xs font-bold text-tyc-text dark:text-white">TYC AI Copilot (Socratic Mode)</span>
                      </div>
                      <Badge variant="green" size="sm">Context: React 19 Generics</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-tyc-bg dark:bg-gray-800/60 rounded-xl text-xs text-tyc-text dark:text-gray-200 border border-tyc-border dark:border-gray-700">
                        <strong className="text-tyc-green">Student:</strong> How do I ensure my generic Select component infers the correct return type without casting with <code>as</code>?
                      </div>

                      <div className="p-3 bg-tyc-green-50/70 dark:bg-tyc-green-950/40 rounded-xl text-xs text-tyc-text dark:text-gray-200 border border-tyc-green-200 dark:border-green-800/60 space-y-2">
                        <p className="font-medium">
                          <strong className="text-tyc-green dark:text-green-400">TYC AI Tutor:</strong> By binding the generic parameter <code>&lt;T&gt;</code> to both the items list and the selection handler:
                        </p>
                        <pre className="p-2.5 bg-black/80 text-green-400 rounded-lg text-[11px] font-mono border border-gray-800">
                          <code>{`interface SelectProps<T> {\n  items: T[];\n  onSelect: (item: T) => void;\n}`}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button size="sm" variant="primary" onClick={() => setIsAiTutorOpen(true)}>
                        Launch Full AI Copilot
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {interactiveTab === 'project' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-tyc-border dark:border-gray-800 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-tyc-text dark:text-white">Active Capstone: AI Automated Code Reviewer</h4>
                        <span className="text-[11px] text-tyc-muted dark:text-gray-400">4 Milestones • Industry Verified</span>
                      </div>
                      <Badge variant="orange" size="sm">Under Review (Milestone 2)</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 bg-tyc-green-50 dark:bg-tyc-green-950/50 border border-tyc-green-200 dark:border-green-800 rounded-xl text-xs">
                        <div className="flex items-center gap-1.5 text-tyc-green dark:text-green-400 font-bold mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> M1: Webhooks
                        </div>
                        <p className="text-[11px] text-tyc-muted dark:text-gray-400 font-mono">Approved (100%)</p>
                      </div>
                      <div className="p-3 bg-tyc-orange-50 dark:bg-tyc-orange-950/50 border border-tyc-orange-200 dark:border-orange-800 rounded-xl text-xs">
                        <div className="flex items-center gap-1.5 text-tyc-orange dark:text-orange-400 font-bold mb-1">
                          <Clock className="w-3.5 h-3.5" /> M2: Diff Parser
                        </div>
                        <p className="text-[11px] text-tyc-muted dark:text-gray-400 font-mono">In Peer Review</p>
                      </div>
                      <div className="p-3 bg-tyc-bg dark:bg-gray-800/40 border border-tyc-border dark:border-gray-800 rounded-xl text-xs opacity-60">
                        <div className="font-semibold text-tyc-text dark:text-gray-300 mb-1">M3: LLM Engine</div>
                        <p className="text-[11px] text-tyc-muted dark:text-gray-500 font-mono">Locked</p>
                      </div>
                      <div className="p-3 bg-tyc-bg dark:bg-gray-800/40 border border-tyc-border dark:border-gray-800 rounded-xl text-xs opacity-60">
                        <div className="font-semibold text-tyc-text dark:text-gray-300 mb-1">M4: Deployment</div>
                        <p className="text-[11px] text-tyc-muted dark:text-gray-500 font-mono">Locked</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 2: LEARNING PHILOSOPHY ================= */}
      <section className="py-20 bg-white dark:bg-[#0E1210] border-b border-tyc-border dark:border-[#222E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-tyc-green dark:text-green-400">
              Proven Learning Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tyc-text dark:text-white mt-1">
              The 10-Step Journey From Beginner to Hired Engineer
            </h2>
            <p className="text-xs sm:text-sm text-tyc-muted dark:text-gray-400 mt-2">
              We eliminated passive video watching. Every concept is tested, coded, and built into a real production project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {philosophySteps.map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-tyc-bg dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-5 hover:border-tyc-green/60 dark:hover:border-tyc-green/60 hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-extrabold ${step.color === 'orange' ? 'text-tyc-orange dark:text-orange-400' : 'text-tyc-green dark:text-green-400'}`}>
                    {step.title}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${step.color === 'orange' ? 'bg-tyc-orange' : 'bg-tyc-green'}`} />
                </div>
                <p className="text-xs text-tyc-muted dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: FEATURED COURSES ================= */}
      <section className="py-20 bg-tyc-bg border-b border-tyc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tyc-green">
                Production-Grade Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-tyc-text mt-1">
                Featured Engineering Masterclasses
              </h2>
              <p className="text-xs sm:text-sm text-tyc-muted mt-1">
                Taught by principal engineers from Google, Vercel, and Scale Systems.
              </p>
            </div>
            <Link to="/courses">
              <Button variant="outline" size="sm">
                View All {courses?.length || 6} Courses
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses || mockCourses).slice(0, 3).map((course) => (
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
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-tyc-muted">
                      <span>{course.durationHours} hours</span>
                      <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
                    </div>

                    <h3 className="text-base font-bold text-tyc-text line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-tyc-muted line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
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
                        <span className="text-xs font-medium text-tyc-text">{course.instructor.name}</span>
                      </div>
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <Button variant="primary" size="sm">
                          Explore
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: LEARNING PATHS ================= */}
      <section className="py-20 bg-white border-b border-tyc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-tyc-orange">
              Goal-Oriented Career Roadmaps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-tyc-text mt-1">
              Select Your Tech Career Track
            </h2>
            <p className="text-xs sm:text-sm text-tyc-muted mt-2">
              Structured multi-month curriculums taking you from beginner fundamentals to portfolio-ready capstones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} hoverable className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-tyc-green-soft text-tyc-green flex items-center justify-center border border-tyc-green/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-tyc-text">{path.title}</h3>
                    <p className="text-xs text-tyc-green font-semibold mt-0.5">Target: {path.role}</p>
                  </div>
                  <p className="text-xs text-tyc-muted leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-tyc-border space-y-3">
                  <div className="flex items-center justify-between text-xs text-tyc-muted">
                    <span>{path.durationMonths} Months</span>
                    <span>{path.coursesCount} Courses</span>
                    <span>{path.projectsCount} Capstones</span>
                  </div>

                  <Link to="/learning-paths" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Roadmap
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: PROJECT-BASED LEARNING ================= */}
      <section className="py-20 bg-tyc-bg border-b border-tyc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-tyc-green">
                Real-World Portfolio Construction
              </span>
              <h2 className="text-3xl font-bold text-tyc-text leading-tight">
                Build Real Architecture, Not Tutorial Clones
              </h2>
              <p className="text-sm text-tyc-muted leading-relaxed">
                Recruiters do not care about generic todo apps. At TYC, every project has technical constraints, API webhooks, automated linters, and instructor code reviews.
              </p>

              <div className="space-y-3">
                {[
                  'Automated AI Code Reviewer with GitHub Webhooks & AST Parsing',
                  'High-Throughput In-Memory Distributed Cache (Redis Clone in Go/Python)',
                  'Real-time Multiplayer Collaborative Whiteboard with WebSockets & CRDTs'
                ].map((prj, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white border border-tyc-border rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-tyc-green shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-tyc-text">{prj}</span>
                  </div>
                ))}
              </div>

              <Link to="/projects">
                <Button variant="primary" size="md">
                  Browse Industry Projects
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Right: Project Card Preview */}
            <div className="space-y-4">
              <Card className="border-tyc-green/40 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="green" size="sm">Production Capstone</Badge>
                  <span className="text-xs text-tyc-muted">~20 Estimated Hours</span>
                </div>
                <h3 className="text-lg font-bold text-tyc-text">
                  Automated AI Code Reviewer & PR Bot
                </h3>
                <p className="text-xs text-tyc-muted mt-1 leading-relaxed">
                  Listen to GitHub PR webhooks, parse unified git diffs, evaluate security anti-patterns with LLMs, and post automated line comments.
                </p>

                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-tyc-border text-center">
                  <div className="p-2 bg-tyc-bg rounded-lg">
                    <div className="text-[11px] text-tyc-muted">Stack</div>
                    <div className="text-xs font-bold text-tyc-text">FastAPI + TS</div>
                  </div>
                  <div className="p-2 bg-tyc-bg rounded-lg">
                    <div className="text-[11px] text-tyc-muted">Evaluation</div>
                    <div className="text-xs font-bold text-tyc-green">Automated Tests</div>
                  </div>
                  <div className="p-2 bg-tyc-bg rounded-lg">
                    <div className="text-[11px] text-tyc-muted">Credential</div>
                    <div className="text-xs font-bold text-tyc-orange">Verified Badge</div>
                  </div>
                </div>

                <Link to="/projects/ai-code-review-bot">
                  <Button variant="outline" size="sm" className="w-full">
                    Inspect Requirements & Starter Kit
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: AI TUTOR SPOTLIGHT ================= */}
      <section className="py-20 bg-white border-b border-tyc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-tyc-bg border border-tyc-border rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-tyc-green-soft text-tyc-green rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>24/7 Context-Aware Copilot</span>
                </div>
                <h2 className="text-3xl font-bold text-tyc-text leading-tight">
                  Never Get Stuck on a Bug or Concept Again
                </h2>
                <p className="text-xs sm:text-sm text-tyc-muted leading-relaxed">
                  Unlike generic ChatGPT prompts, the TYC AI Tutor knows your exact course, module, video timestamp, and practice submission history.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-tyc-border rounded-xl">
                    <strong className="text-tyc-text block mb-0.5">Socratic Mode</strong>
                    <span className="text-tyc-muted text-[11px]">Guides your thinking without giving away code answers.</span>
                  </div>
                  <div className="p-3 bg-white border border-tyc-border rounded-xl">
                    <strong className="text-tyc-text block mb-0.5">Debugger Mode</strong>
                    <span className="text-tyc-muted text-[11px]">Identifies syntax, race conditions & memory leaks.</span>
                  </div>
                  <div className="p-3 bg-white border border-tyc-border rounded-xl">
                    <strong className="text-tyc-text block mb-0.5">Mock Interviewer</strong>
                    <span className="text-tyc-muted text-[11px]">Simulates senior engineering interview rounds.</span>
                  </div>
                  <div className="p-3 bg-white border border-tyc-border rounded-xl">
                    <strong className="text-tyc-text block mb-0.5">Project Mentor</strong>
                    <span className="text-tyc-muted text-[11px]">Reviews software architecture and edge cases.</span>
                  </div>
                </div>

                <Button size="md" variant="primary" onClick={() => setIsAiTutorOpen(true)}>
                  Try Live AI Tutor
                  <Sparkles className="w-4 h-4 ml-1.5" />
                </Button>
              </div>

              <div className="bg-white border border-tyc-border rounded-xl p-5 shadow-modal space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-tyc-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-tyc-green text-white flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                    <span className="text-xs font-bold text-tyc-text">Live Prompt Demonstration</span>
                  </div>
                  <Badge variant="green" size="sm">Active</Badge>
                </div>

                <div className="p-3 bg-tyc-bg rounded-lg text-xs">
                  <strong className="text-tyc-text">Student:</strong> Explain how Python asyncio event loops handle non-blocking I/O compared to Node.js libuv?
                </div>

                <div className="p-3 bg-tyc-green-soft/40 border border-tyc-green/20 rounded-lg text-xs leading-relaxed space-y-1.5">
                  <p>
                    <strong>TYC AI Tutor:</strong> Both rely on single-threaded event demultiplexing via epoll/kqueue. However:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-tyc-text text-[11px]">
                    <li><strong>Node.js</strong>: Offloads file/crypto operations to a C++ threadpool in libuv.</li>
                    <li><strong>Python AsyncIO</strong>: Relies on Python coroutines and cooperative yield points using <code>await</code>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: CAREER ECOSYSTEM ================= */}
      <section className="py-20 bg-tyc-bg dark:bg-[#0B0E0C] border-b border-tyc-border dark:border-[#222E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-tyc-green dark:text-green-400">
              Fast-Track Career Placements
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-tyc-text dark:text-white mt-1">
              From Verified Certificates to Direct Hiring
            </h2>
            <p className="text-xs sm:text-sm text-tyc-muted dark:text-gray-400 mt-2">
              Partner tech companies hire directly through the TYC talent portal based on verified project quality and algorithmic proficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-5 shadow-subtle text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-tyc-green-50 dark:bg-tyc-green-950 text-tyc-green dark:text-green-400 flex items-center justify-center mx-auto">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-tyc-text dark:text-white">1. Build Capstones</h4>
              <p className="text-xs text-tyc-muted dark:text-gray-400">Complete 3+ verified production projects with passing test suites.</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-5 shadow-subtle text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-tyc-green-50 dark:bg-tyc-green-950 text-tyc-green dark:text-green-400 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-tyc-text dark:text-white">2. Get Certified</h4>
              <p className="text-xs text-tyc-muted dark:text-gray-400">Earn verifiable credentials with immutable public verification URLs.</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-5 shadow-subtle text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-tyc-orange-50 dark:bg-tyc-orange-950 text-tyc-orange dark:text-orange-400 flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-tyc-text dark:text-white">3. Public Portfolio</h4>
              <p className="text-xs text-tyc-muted dark:text-gray-400">Auto-generate your recruiter-friendly developer profile.</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-5 shadow-subtle text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-tyc-green-50 dark:bg-tyc-green-950 text-tyc-green dark:text-green-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-tyc-text dark:text-white">4. Apply & Interview</h4>
              <p className="text-xs text-tyc-muted dark:text-gray-400">Skip traditional screening rounds with our hiring partner network.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: LIVE WORKSHOPS & HACKATHONS ================= */}
      <section className="py-20 bg-white dark:bg-[#0E1210] border-b border-tyc-border dark:border-[#222E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tyc-orange dark:text-orange-400">
                Live Community Events
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-tyc-text dark:text-white mt-1">
                Upcoming Masterclasses & Global Hackathons
              </h2>
            </div>
            <div className="flex gap-2">
              <Link to="/workshops">
                <Button variant="outline" size="sm">Workshops</Button>
              </Link>
              <Link to="/hackathons">
                <Button variant="outline" size="sm">Hackathons</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workshop card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-tyc-bg dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 space-y-4 shadow-subtle hover:border-tyc-green/50 dark:hover:border-tyc-green/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <Badge variant="green" size="sm">Live Masterclass</Badge>
                <span className="text-xs font-semibold text-tyc-green dark:text-green-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Free Community RSVP
                </span>
              </div>
              <h3 className="text-base font-bold text-tyc-text dark:text-white">
                {mockWorkshops[0].title}
              </h3>
              <p className="text-xs text-tyc-muted dark:text-gray-400 leading-relaxed">
                {mockWorkshops[0].description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-tyc-border dark:border-[#222E26] text-xs">
                <div className="text-tyc-muted dark:text-gray-400 font-mono">
                  <strong>Date:</strong> {mockWorkshops[0].date} ({mockWorkshops[0].time})
                </div>
                <Link to="/workshops">
                  <Button variant="primary" size="sm">Reserve Seat</Button>
                </Link>
              </div>
            </motion.div>

            {/* Hackathon card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-tyc-bg dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 space-y-4 shadow-subtle hover:border-tyc-orange/50 dark:hover:border-tyc-orange/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <Badge variant="orange" size="sm">Global Hackathon</Badge>
                <span className="text-xs font-extrabold text-tyc-orange dark:text-orange-400 font-mono">{mockHackathons[0].prizePool}</span>
              </div>
              <h3 className="text-base font-bold text-tyc-text dark:text-white">
                {mockHackathons[0].title}
              </h3>
              <p className="text-xs text-tyc-muted dark:text-gray-400 leading-relaxed">
                {mockHackathons[0].description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-tyc-border dark:border-[#222E26] text-xs">
                <div className="text-tyc-muted dark:text-gray-400 font-mono">
                  <strong>Sprint:</strong> {mockHackathons[0].startDate} &bull; {mockHackathons[0].teamsCount} Teams
                </div>
                <Link to="/hackathons">
                  <Button variant="orange" size="sm">Join Hackathon</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: STATS & TESTIMONIALS ================= */}
      <section className="py-20 bg-tyc-bg dark:bg-[#0B0E0C] border-b border-tyc-border dark:border-[#222E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 shadow-subtle">
              <div className="text-3xl lg:text-4xl font-black text-tyc-green dark:text-green-400 font-mono">24,800+</div>
              <div className="text-xs text-tyc-muted dark:text-gray-400 font-medium mt-1">Active Students</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 shadow-subtle">
              <div className="text-3xl lg:text-4xl font-black text-tyc-text dark:text-white font-mono">14,800+</div>
              <div className="text-xs text-tyc-muted dark:text-gray-400 font-medium mt-1">Capstones Built</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 shadow-subtle">
              <div className="text-3xl lg:text-4xl font-black text-tyc-orange dark:text-orange-400 font-mono">94.2%</div>
              <div className="text-xs text-tyc-muted dark:text-gray-400 font-medium mt-1">Course Completion</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 shadow-subtle">
              <div className="text-3xl lg:text-4xl font-black text-tyc-green dark:text-green-400 font-mono">890+</div>
              <div className="text-xs text-tyc-muted dark:text-gray-400 font-medium mt-1">Hired Candidates</div>
            </motion.div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-tyc-green dark:text-green-400">
              Real Student Outcomes
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-tyc-text dark:text-white mt-1">What Students & Engineers Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ankit Sharma',
                role: 'Full Stack Engineer @ Razorpay',
                text: 'The emphasis on automated testing and real git diffs in TYC projects gave me the confidence to ace my system design and coding rounds.',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
              },
              {
                name: 'Kavita Iyer',
                role: 'AI Engineer @ Cohere Partner',
                text: 'The Socratic AI Tutor helped me understand vector embeddings and RAG pipelines far faster than reading documentation alone.',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
              },
              {
                name: 'Daniel Brooks',
                role: 'Cloud Developer @ scale.io',
                text: 'The verifiable certificate link on my portfolio made recruiter outreach instant. Best practical tech education platform in 2026.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#141916] border border-tyc-border dark:border-[#222E26] rounded-2xl p-6 space-y-4 shadow-subtle"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-tyc-muted dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-tyc-border dark:border-[#222E26]">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-tyc-border dark:border-gray-700" />
                  <div>
                    <div className="text-xs font-bold text-tyc-text dark:text-white">{t.name}</div>
                    <div className="text-[11px] text-tyc-muted dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CTA ================= */}
      <section className="py-24 bg-white dark:bg-[#0E1210] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,128,58,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tyc-green to-emerald-400 text-white flex items-center justify-center mx-auto shadow-glow-green"
          >
            <Rocket className="w-7 h-7" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-tyc-text dark:text-white tracking-tight leading-tight">
            Your Journey From Learning to Career Starts Here.
          </h2>
          <p className="text-sm sm:text-base text-tyc-muted dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers leveling up their full-stack, AI, and cloud systems engineering skills with Traya Yukti Core.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" className="shadow-md hover:scale-105 transition-transform">
                Get Started Free Today
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                Explore Course Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
