import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
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
  Briefcase,
  Edit3,
  Building,
  Phone,
  GraduationCap,
  Activity,
  Camera,
  UploadCloud,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { StatCard } from '../../components/shared/StatCard';
import { AITutorSymbol } from '../../components/shared/AITutorSymbol';
import { mockProjects, mockWorkshops } from '../../services/mockData';

// Pre-made Curated Avatars Gallery for TYC Students
const PRESET_AVATARS = [
  {
    id: 'av_1',
    name: 'AI Full-Stack Dev',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'Developer'
  },
  {
    id: 'av_2',
    name: 'Software Engineer',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    category: 'Developer'
  },
  {
    id: 'av_3',
    name: 'AI Researcher',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    category: 'AI & Data'
  },
  {
    id: 'av_4',
    name: 'Cyberpunk Coder',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    category: 'Cyber'
  },
  {
    id: 'av_5',
    name: 'Data Scientist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'AI & Data'
  },
  {
    id: 'av_6',
    name: 'Systems Architect',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    category: 'Architecture'
  },
  {
    id: 'av_7',
    name: 'UI/UX Designer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    category: 'Design'
  },
  {
    id: 'av_8',
    name: 'DevOps Master',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    category: 'Cloud'
  },
  {
    id: 'av_9',
    name: 'Neural Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TYCBot',
    category: 'Avatar'
  },
  {
    id: 'av_10',
    name: 'Neon Cyber Fox',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CyberFox',
    category: 'Avatar'
  },
  {
    id: 'av_11',
    name: 'Pixel Samurai',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Samurai',
    category: 'Avatar'
  },
  {
    id: 'av_12',
    name: 'Cosmic Scholar',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scholar',
    category: 'Avatar'
  }
];

export const StudentDashboardPage: React.FC = () => {
  const { user, activities, updateProfile } = useAuth();
  const { courses, setIsAiTutorOpen, setIsOnboardingOpen } = useLMS();
  const { toast } = useNotifications();

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCollege, setEditCollege] = useState(user?.college || '');
  const [editBranch, setEditBranch] = useState(user?.branch || '');
  const [editYear, setEditYear] = useState(user?.year || '3rd Year');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editCareerGoal, setEditCareerGoal] = useState(user?.careerGoal || '');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar & Photo Upload Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'gallery'>('upload');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.avatar || PRESET_AVATARS[0].url);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        college: editCollege,
        branch: editBranch,
        year: editYear,
        bio: editBio,
        careerGoal: editCareerGoal
      });
      toast('Profile Updated', 'Your student information was securely saved to the database.', 'system');
      setIsEditProfileOpen(false);
    } catch {
      toast('Update Failed', 'Could not save profile.', 'system');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Invalid File', 'Please select an image file (PNG, JPG, WebP).', 'system');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('File Too Large', 'Please select an image smaller than 5MB.', 'system');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    try {
      await updateProfile({
        avatar: selectedAvatar
      });
      toast('Avatar Updated', 'Your profile picture has been updated.', 'system');
      setIsAvatarModalOpen(false);
    } catch {
      toast('Failed', 'Could not update avatar.', 'system');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* ================= STUDENT HERO BANNER ================= */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border border-emerald-500/20 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Background Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Student Credentials */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div 
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-md shrink-0 cursor-pointer group"
              title="Click to change profile avatar / photo"
            >
              <img
                src={user?.avatar || PRESET_AVATARS[0].url}
                alt={user?.name || 'Student Avatar'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Welcome back, {user?.name || 'Student'}!
                </h1>
                <Badge variant="green" size="sm">Active Learner</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {user?.careerGoal || 'Full Stack & AI Systems Track'} • {user?.college || 'TYC Engineering Academy'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  {user?.branch || 'Computer Science'} ({user?.year || '3rd Year'})
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user?.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs bg-white dark:bg-[#0F172A] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Update Course Preferences</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
              className="text-xs bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 shadow-xs"
            >
              Edit Profile
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAiTutorOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <AITutorSymbol size="xs" variant="amber" animated />
              <span>AI Copilot</span>
            </Button>

            <Link to="/practice">
              <Button variant="primary" size="sm" className="text-xs">
                <Code2 className="w-3.5 h-3.5 mr-1" />
                Daily Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= HIGH IMPORTANCE: NEXT BEST ACTION CARD ================= */}
      <div className="p-5 bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/90 dark:from-emerald-950/40 dark:via-[#0D121F] dark:to-orange-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-3xl shadow-[0_4px_20px_rgba(16,185,129,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-[#10B981] text-white shadow-md shrink-0">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="green" size="sm" dot>Next Priority Objective</Badge>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estimated 25 mins</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Complete Lesson 1.2: React 19 useActionState & useOptimistic
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5 leading-relaxed">
              You are 2 lessons away from completing Module 1 and unlocking the Milestone 1 Assessment badge.
            </p>
          </div>
        </div>

        <Link to="/courses/fullstack-react-typescript-mastery" className="shrink-0 w-full md:w-auto">
          <Button variant="primary" size="md" className="w-full md:w-auto shadow-md">
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
          icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
          iconBgColor="orange"
        />

        <StatCard
          title="Weekly Learning"
          value={`${user?.weeklyHoursSpent || 18.5} hrs`}
          subtitle="Target: 15 hrs / week"
          trend={{ value: '3.5 hrs', isPositive: true }}
          icon={<Clock className="w-5 h-5 text-emerald-500" />}
          iconBgColor="green"
        />

        <StatCard
          title="Completed Lessons"
          value={`${user?.completedLessonIds.length || 14} / 48`}
          subtitle="Across 3 active courses"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-600" />}
          iconBgColor="cyan"
        />

        <StatCard
          title="Verified Certificates"
          value={`${user?.certificatesEarned || 2}`}
          subtitle="Verifiable on profile"
          icon={<Award className="w-5 h-5 text-purple-500" />}
          iconBgColor="purple"
        />
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Continue Learning, Visual Progress & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Continue Learning */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Courses & Syllabus</h2>
              </div>
              <Link to="/courses" className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                View All Courses
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackEnrolled.map((course, idx) => {
                const progress = idx === 0 ? 68 : 34;
                const courseCardTheme = idx === 0
                  ? 'bg-gradient-to-br from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-emerald-200/90 dark:border-emerald-800/50'
                  : 'bg-gradient-to-br from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border-purple-200/90 dark:border-purple-800/50';

                return (
                  <Card key={course.id} className={`p-5 space-y-4 rounded-2xl border shadow-xs hover:shadow-md transition-all ${courseCardTheme}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-xs">
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Badge variant="green" size="sm" className="mb-1">{course.category}</Badge>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{course.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Course Progress</span>
                        <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} color={progress > 50 ? 'green' : 'orange'} size="sm" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section: Comprehensive Real-Time Recent Activity Feed */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-slate-50/80 via-white to-white dark:from-[#0F172A] dark:to-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity Stream</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic log recorded from your learning & project milestones</p>
                </div>
              </div>
              <Badge variant="green" size="sm" dot>Live Activity</Badge>
            </div>

            <div className="space-y-3 pt-1">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No recent activities recorded yet. Start a lesson to see live telemetry!
                </div>
              ) : (
                activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#161F30] border border-slate-200/90 dark:border-slate-800 flex items-start gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{act.title}</h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">{act.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Section: 7-Day Activity Matrix */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-amber-50/40 via-white to-white dark:from-amber-950/15 dark:via-[#0F172A] dark:to-[#0F172A] border border-amber-200/90 dark:border-amber-800/50 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Activity Heatmap</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Consistent daily coding builds long-term retention</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800/80 px-3 py-1 rounded-full shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{user?.streakDays || 14} Day Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {weekDays.map((w) => (
                <div
                  key={w.day}
                  className="p-3 rounded-2xl bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 text-center space-y-1.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors shadow-xs"
                >
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">{w.day}</span>
                  <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-black flex items-center justify-center mx-auto shadow-xs">
                    ✓
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{w.hours}h</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Coding Practice, Masterclasses, Projects */}
        <div className="space-y-8">
          
          {/* Quick Coding Lab Jump */}
          <Card className="p-5 space-y-4 border border-cyan-300 dark:border-cyan-500/40 bg-gradient-to-br from-cyan-50/70 via-white to-white dark:from-cyan-950/30 dark:via-[#0F172A] dark:to-[#0F172A] rounded-2xl shadow-[0_4px_20px_rgba(6,182,212,0.08)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 shadow-xs">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Coding Lab</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">In-browser IDE with instant AI grading</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-slate-500">// Today's Daily Target</div>
              <div className="text-emerald-400">fn minWindowSubstring(s, t) -&gt; str:</div>
              <div className="text-slate-400">  # Time complexity: O(N)</div>
            </div>

            <Link to="/coding">
              <Button variant="primary" size="sm" className="w-full mt-2">
                Launch Playground Lab
              </Button>
            </Link>
          </Card>

          {/* Upcoming Masterclasses */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-amber-50/60 via-white to-white dark:from-amber-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border border-amber-200/90 dark:border-amber-800/50 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Masterclasses</h3>
              </div>
              <Link to="/workshops" className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {mockWorkshops.slice(0, 2).map((w) => (
                <div key={w.id} className="p-3 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="orange" size="sm">Live Masterclass</Badge>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{w.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{w.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Instructor: {w.instructorName}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Capstone Project Showcase */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-[#0F172A] dark:to-[#0F172A] border border-purple-200/90 dark:border-purple-800/50 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Featured Project Capstone</h3>
              </div>
              <Link to="/projects" className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                Explore
              </Link>
            </div>

            {mockProjects[0] && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                <img
                  src={mockProjects[0].thumbnail}
                  alt=""
                  className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                />
                <Badge variant="purple" size="sm">{mockProjects[0].difficulty}</Badge>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{mockProjects[0].title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mockProjects[0].objective || mockProjects[0].problemStatement}
                </p>
                <Link to={`/projects/${mockProjects[0].id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Project Spec
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Student Profile Modal */}
      {isEditProfileOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditProfileOpen(false)}
          title="Edit Student Information"
          size="md"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 p-1">
            <Input
              label="Full Name"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. Alex Rivera"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="College / University"
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                placeholder="e.g. Stanford Institute of Technology"
              />
              <Input
                label="Branch / Major"
                value={editBranch}
                onChange={(e) => setEditBranch(e.target.value)}
                placeholder="e.g. Computer Science & AI"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Academic Year"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                placeholder="e.g. 3rd Year"
              />
              <Input
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+1 (555) 234-8901"
              />
            </div>

            <Input
              label="Career Goal / Target Role"
              value={editCareerGoal}
              onChange={(e) => setEditCareerGoal(e.target.value)}
              placeholder="e.g. Full Stack AI Developer"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio / About Me:</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Share a summary of your technical interests and projects..."
                className="w-full bg-white dark:bg-[#161F30] border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Avatar & Photo Shortcut inside Edit Profile */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800/80 rounded-2xl">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/60"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo & Avatar</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Upload your own photo or pick from avatars</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAvatar(user?.avatar || PRESET_AVATARS[0].url);
                  setIsAvatarModalOpen(true);
                }}
                className="text-xs"
              >
                <Camera className="w-3.5 h-3.5 mr-1 text-cyan-500" />
                Change
              </Button>
            </div>

            {/* Read-only security fields reminder */}
            <div className="p-3 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-300 block">Security Guarded Fields (Read-Only):</span>
              <p>Role ({user?.role?.toUpperCase()}), Verified Skill Certifications, and Milestone Grades cannot be manually altered by students.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                Save Profile Updates
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Upload Photo & Avatar Selector Modal */}
      {isAvatarModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAvatarModalOpen(false)}
          title="Update Profile Picture & Avatar"
          size="lg"
        >
          <div className="space-y-6 p-1">
            {/* Tab Selection: Upload Personal Photo vs Avatars Gallery */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#161F30] rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAvatarTab('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  avatarTab === 'upload'
                    ? 'bg-white dark:bg-[#0D121F] text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-emerald-500" />
                <span>Upload Your Picture</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('gallery')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  avatarTab === 'gallery'
                    ? 'bg-white dark:bg-[#0D121F] text-slate-950 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-cyan-500" />
                <span>Choose from Avatars</span>
              </button>
            </div>

            {/* TAB 1: UPLOAD PERSONAL PICTURE */}
            {avatarTab === 'upload' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#161F30]/40 hover:bg-slate-50 dark:hover:bg-[#161F30] transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Upload image"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Click to browse or drag and drop your photo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PNG, JPG, JPEG, or WebP (Max 5MB)
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: CHOOSE FROM PRE-MADE AVATARS */}
            {avatarTab === 'gallery' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select a curated avatar for your profile:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {PRESET_AVATARS.length} options available
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-1">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.url)}
                        className={`relative group rounded-2xl p-1.5 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500 shadow-md'
                            : 'bg-slate-50 dark:bg-[#161F30] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden">
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                          {avatar.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LIVE PREVIEW & CONFIRMATION BAR */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedAvatar}
                    alt="Selected Avatar Preview"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Selected Profile Picture</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    This will appear on your dashboard, navbar, and certifications.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAvatarModalOpen(false)}
                  disabled={isSavingAvatar}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAvatar}
                  isLoading={isSavingAvatar}
                >
                  Save Photo
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
