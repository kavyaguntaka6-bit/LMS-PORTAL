import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Clock,
  User as UserIcon,
  X,
  Code2,
  Terminal,
  Server,
  Cpu,
  Layers,
  Check,
  Plus,
  Loader2,
  Target,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import { authService } from '../../services/api';
import { Course, StudentPreferences, RecommendedCourseItem } from '../../types';
import {
  QUESTIONNAIRE_INTEREST_OPTIONS,
  QUESTIONNAIRE_GOAL_OPTIONS,
  QUESTIONNAIRE_TIME_OPTIONS,
  calculatePersonalizedRecommendations
} from '../../services/recommendationEngine';
import { Button } from '../ui/Button';

interface StudentCourseRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentCourseRecommendationModal: React.FC<StudentCourseRecommendationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { courses, refreshCourses, triggerCelebration } = useLMS();
  const { toast } = useNotifications();

  // Multi-step state (1: Interests, 2: Level, 3: Goals & Time, 4: Recommendations)
  const [step, setStep] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Questionnaire responses state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['frontend', 'aiml']);
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['job_switch', 'master_ai']);
  const [selectedTime, setSelectedTime] = useState<string>('moderate');

  // Selected recommended course IDs to enroll
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Prepopulate saved preferences if available
  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.interests?.length) setSelectedInterests(user.preferences.interests);
      if (user.preferences.level) setSelectedLevel(user.preferences.level);
      if (user.preferences.goals?.length) setSelectedGoals(user.preferences.goals);
      if (user.preferences.weeklyHours) setSelectedTime(user.preferences.weeklyHours);
    }
  }, [user]);

  // Compute recommendations
  const recommendations: RecommendedCourseItem[] = useMemo(() => {
    const preferences: StudentPreferences = {
      interests: selectedInterests,
      level: selectedLevel,
      goals: selectedGoals,
      weeklyHours: selectedTime
    };
    return calculatePersonalizedRecommendations(preferences, courses);
  }, [selectedInterests, selectedLevel, selectedGoals, selectedTime, courses]);

  // Default select top recommended courses
  useEffect(() => {
    if (recommendations.length > 0 && selectedCourseIds.length === 0) {
      const topIds = recommendations.slice(0, 2).map((r) => r.course.id);
      setSelectedCourseIds(topIds);
    }
  }, [recommendations, selectedCourseIds.length]);

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleNextStep = () => {
    if (step === 3) {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setStep(4);
      }, 600);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSaveAndEnroll = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const preferences: StudentPreferences = {
        interests: selectedInterests,
        level: selectedLevel,
        goals: selectedGoals,
        weeklyHours: selectedTime
      };

      const updatedUser = await authService.saveStudentPreferencesAndEnroll(
        selectedCourseIds,
        preferences
      );

      // Update auth context state directly
      await updateProfile({
        enrolledCourseIds: updatedUser.enrolledCourseIds,
        onboardingCompleted: true,
        preferences
      });
      
      await refreshCourses();
      triggerCelebration();

      toast(
        'Onboarding Complete!',
        `Your personalized curriculum has been saved with ${selectedCourseIds.length} enrolled course(s).`,
        'system'
      );

      onClose();
    } catch {
      toast('Save Failed', 'Could not save your preferences. Please try again.', 'system');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;
    try {
      // Mark onboarding as completed so student isn't blocked
      await authService.updateProfile({
        onboardingCompleted: true
      } as any);
      onClose();
    } catch {
      onClose();
    }
  };

  const getInterestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="w-full max-w-2xl bg-[#0a0e17] border border-slate-800 rounded-[32px] p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-white relative overflow-hidden my-auto"
      >
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

        {/* Top Navigation & Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-black">
              {step}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {step === 4 ? 'Personalized Recommendations' : 'Student Course Onboarding'}
              </h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4 &bull; Tailoring your learning path</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step < 4 && (
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full mb-6 overflow-hidden border border-slate-800">
          <motion.div
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* ================= STEP 1: AREAS OF INTEREST ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Let's find the right courses for you
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Answer a few quick questions and we'll recommend courses based on your interests, goals, and current level.
              </p>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-300 block mb-2">
                What domains are you most interested in exploring? (Select all that apply)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUESTIONNAIRE_INTEREST_OPTIONS.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0f1523]/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          {getInterestIcon(opt.icon)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {opt.tags.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: EXPERIENCE & SKILL LEVEL ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                What is your current experience level?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We'll match course prerequisites and pacing to your background.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'Beginner',
                  title: 'Beginner / Starting Out',
                  desc: 'New to programming or looking for guided foundational concepts with zero prior assumptions.'
                },
                {
                  id: 'Intermediate',
                  title: 'Intermediate / Practical Builder',
                  desc: 'Comfortable with basic syntax and ready for scalable application patterns, frameworks, and architecture.'
                },
                {
                  id: 'Advanced',
                  title: 'Advanced / Engineering Deep-Dive',
                  desc: 'Experienced engineer focusing on distributed systems, AI pipelines, performance optimization, and internals.'
                }
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-[#0f1523]/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{lvl.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{lvl.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: LEARNING GOALS & TIME ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Goals & Available Time
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Help us calibrate syllabus milestones and weekly project pacing.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  What is your primary milestone? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUESTIONNAIRE_GOAL_OPTIONS.map((g) => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGoal(g.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            : 'bg-[#0f1523]/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{g.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{g.desc}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Weekly study commitment:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {QUESTIONNAIRE_TIME_OPTIONS.map((t) => {
                    const isSelected = selectedTime === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTime(t.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                            : 'bg-[#0f1523]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{t.label}</div>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: RECOMMENDATION SCREEN ================= */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Personalized Matches Found</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Courses recommended for you
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select the courses you would like to add to your student portal.
              </p>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 no-scrollbar pt-1">
              {recommendations.slice(0, 4).map((rec) => {
                const isSelected = selectedCourseIds.includes(rec.course.id);
                return (
                  <div
                    key={rec.course.id}
                    onClick={() => toggleCourseSelection(rec.course.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-[#0f1523]/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={rec.course.thumbnail}
                        alt={rec.course.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {rec.course.difficulty}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{rec.course.durationHours}h Syllabus</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{rec.course.title}</h4>
                        
                        {/* Recommendation Rationale */}
                        <div className="mt-1 text-[10.5px] text-emerald-300/90 leading-snug flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="line-clamp-1">{rec.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCourseSelection(rec.course.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Select Course</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800/80 mt-6">
          {step > 1 && step <= 4 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-[0_4px_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              disabled={isCalculating}
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 shadow-[0_4px_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Finding matching courses...</span>
                </>
              ) : (
                <>
                  <span>View Recommendations</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving || selectedCourseIds.length === 0}
              onClick={handleSaveAndEnroll}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_4px_20px_rgba(52,211,153,0.4)] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Enrolling in Courses...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Add to My Courses ({selectedCourseIds.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
