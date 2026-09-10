import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Course, LearningPath } from '../types';
import { courseService, learningPathService } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface AIContextState {
  courseTitle?: string;
  moduleTitle?: string;
  lessonTitle?: string;
  codeSnippet?: string;
}

interface LMSContextType {
  courses: Course[];
  learningPaths: LearningPath[];
  isLoading: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAiTutorOpen: boolean;
  setIsAiTutorOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  aiContext: AIContextState;
  setAiContext: (ctx: AIContextState) => void;
  enrollCourse: (courseId: string) => Promise<boolean>;
  toggleLessonComplete: (courseId: string, lessonId: string) => Promise<boolean>;
  triggerCelebration: () => void;
  refreshCourses: () => Promise<void>;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useNotifications();
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global modals & drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [aiContext, setAiContext] = useState<AIContextState>({});

  const refreshCourses = useCallback(async () => {
    try {
      const [crs, paths] = await Promise.all([
        courseService.getCourses(),
        learningPathService.getPaths()
      ]);
      setCourses(crs);
      setLearningPaths(paths);
    } catch (e) {
      console.error('Failed to load courses', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  // Auto-trigger onboarding modal for normal students who have not completed onboarding
  useEffect(() => {
    if (user && user.role === 'student' && user.onboardingCompleted === false) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#16803A', '#0B5D2A', '#F28C28', '#22C55E', '#EAF6EE']
      });
    } catch {
      // safe fallback
    }
  };

  const enrollCourse = async (courseId: string): Promise<boolean> => {
    if (!user) {
      toast('Login Required', 'Please log in to enroll in this course.', 'system');
      return false;
    }
    const updatedUser = await courseService.enroll(courseId);
    await updateProfile({ enrolledCourseIds: updatedUser.enrolledCourseIds });
    toast('Enrolled Successfully!', 'Course added to your active learning journey.', 'course');
    triggerCelebration();
    return true;
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string): Promise<boolean> => {
    if (!user) return false;
    const { completed } = await courseService.toggleLessonComplete(courseId, lessonId);
    await refreshCourses();
    return completed;
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        learningPaths,
        isLoading,
        isSearchOpen,
        setIsSearchOpen,
        isAiTutorOpen,
        setIsAiTutorOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        aiContext,
        setAiContext,
        enrollCourse,
        toggleLessonComplete,
        triggerCelebration,
        refreshCourses
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = (): LMSContextType => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
