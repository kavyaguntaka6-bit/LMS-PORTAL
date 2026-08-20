import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Animated Route Loading Skeleton
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-tyc-green/10 dark:bg-tyc-green/20 border-2 border-tyc-green/40 flex items-center justify-center animate-pulse">
        <span className="text-tyc-green dark:text-green-400 font-bold text-sm">TYC</span>
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-tyc-green border-t-transparent animate-spin" />
    </div>
    <div className="text-center space-y-1">
      <p className="text-xs font-semibold text-tyc-text dark:text-gray-200">Loading module environment...</p>
      <p className="text-[11px] text-tyc-muted dark:text-gray-500">Traya Yukti Core Platform</p>
    </div>
  </div>
);

// Dynamic Lazy Imports for Optimized Bundle Chunks
const LandingPage = lazy(() => import('../features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const OnboardingPage = lazy(() => import('../features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const StudentDashboardPage = lazy(() => import('../features/dashboard/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const CourseCatalogPage = lazy(() => import('../features/courses/CourseCatalogPage').then(m => ({ default: m.CourseCatalogPage })));
const CourseDetailsPage = lazy(() => import('../features/courses/CourseDetailsPage').then(m => ({ default: m.CourseDetailsPage })));
const LessonPlayerPage = lazy(() => import('../features/learning/LessonPlayerPage').then(m => ({ default: m.LessonPlayerPage })));
const LearningPathsPage = lazy(() => import('../features/learning-paths/LearningPathsPage').then(m => ({ default: m.LearningPathsPage })));
const PracticePage = lazy(() => import('../features/practice/PracticePage').then(m => ({ default: m.PracticePage })));
const CodingPlaygroundPage = lazy(() => import('../features/coding/CodingPlaygroundPage').then(m => ({ default: m.CodingPlaygroundPage })));
const ProjectsCatalogPage = lazy(() => import('../features/projects/ProjectsCatalogPage').then(m => ({ default: m.ProjectsCatalogPage })));
const ProjectDetailsPage = lazy(() => import('../features/projects/ProjectDetailsPage').then(m => ({ default: m.ProjectDetailsPage })));
const CertificatesPage = lazy(() => import('../features/certificates/CertificatesPage').then(m => ({ default: m.CertificatesPage })));
const StudentPortfolioPage = lazy(() => import('../features/portfolio/StudentPortfolioPage').then(m => ({ default: m.StudentPortfolioPage })));
const CareerCenterPage = lazy(() => import('../features/career/CareerCenterPage').then(m => ({ default: m.CareerCenterPage })));
const WorkshopsPage = lazy(() => import('../features/workshops/WorkshopsPage').then(m => ({ default: m.WorkshopsPage })));
const HackathonsPage = lazy(() => import('../features/hackathons/HackathonsPage').then(m => ({ default: m.HackathonsPage })));
const CommunityPage = lazy(() => import('../features/community/CommunityPage').then(m => ({ default: m.CommunityPage })));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Admin Lazy Pages
const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const CourseCMSPage = lazy(() => import('../features/admin/CourseCMSPage').then(m => ({ default: m.CourseCMSPage })));
const StudentsManagerPage = lazy(() => import('../features/admin/StudentsManagerPage').then(m => ({ default: m.StudentsManagerPage })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Student & Public Routes inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="/learn/:courseId/:lessonId" element={<LessonPlayerPage />} />
          <Route path="/learn/:courseId" element={<LessonPlayerPage />} />
          <Route path="/learning-paths" element={<LearningPathsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/coding" element={<CodingPlaygroundPage />} />
          <Route path="/projects" element={<ProjectsCatalogPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/portfolio" element={<StudentPortfolioPage />} />
          <Route path="/portfolio/:id" element={<StudentPortfolioPage />} />
          <Route path="/career" element={<CareerCenterPage />} />
          <Route path="/internships" element={<CareerCenterPage />} />
          <Route path="/jobs" element={<CareerCenterPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<SettingsPage />} />
        </Route>

        {/* Admin Experience inside AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="courses" element={<CourseCMSPage />} />
          <Route path="students" element={<StudentsManagerPage />} />
          <Route path="instructors" element={<StudentsManagerPage />} />
          <Route path="analytics" element={<AdminDashboardPage />} />
          <Route path="projects" element={<CourseCMSPage />} />
          <Route path="career" element={<CourseCMSPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
