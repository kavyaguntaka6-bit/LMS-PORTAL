import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { InstructorLayout } from '../components/layout/InstructorLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

import { useAuth } from '../context/AuthContext';

// Animated Route Loading Fallback
const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-5 p-8 select-none">
    <div className="relative flex items-center justify-center">
      {/* Outer Gyro Ring */}
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: '6s' }} />
      {/* Inner Glowing Ring */}
      <div className="absolute w-14 h-14 rounded-full border-2 border-cyan-400/60 border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
      {/* Core Center Badge */}
      <div className="absolute w-10 h-10 rounded-full bg-slate-900 border border-emerald-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] overflow-hidden">
        <img src="/tyc-logo-second.png" alt="TYC" className="w-full h-full object-cover" />
      </div>
    </div>
    <div className="text-center space-y-1">
      <div className="flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <p className="text-xs font-bold text-slate-800 dark:text-white tracking-wide uppercase">Initializing Workspace...</p>
      </div>
      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Trata Yukthi Core Platform</p>
    </div>
  </div>
);

// Gate root path: require login before accessing website
const RootRouteGate: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <RouteLoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <LandingPage />;
};

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

// Instructor Lazy Pages
const InstructorDashboardPage = lazy(() => import('../features/instructor/InstructorDashboardPage').then(m => ({ default: m.InstructorDashboardPage })));

// Admin & Super Admin Lazy Pages
const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const SuperAdminDashboardPage = lazy(() => import('../features/admin/SuperAdminDashboardPage').then(m => ({ default: m.SuperAdminDashboardPage })));
const CourseCMSPage = lazy(() => import('../features/admin/CourseCMSPage').then(m => ({ default: m.CourseCMSPage })));
const StudentsManagerPage = lazy(() => import('../features/admin/StudentsManagerPage').then(m => ({ default: m.StudentsManagerPage })));
const UnauthorizedPage = lazy(() => import('../features/auth/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

import { AuthenticateWithRedirectCallback } from '@clerk/react';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Dedicated Auth Routes (Standalone Master Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl="/dashboard" signUpForceRedirectUrl="/onboarding" />} />

        {/* Student & Ecosystem Routes inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRouteGate />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CourseCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CourseDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-paths"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <LearningPathsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <WorkshopsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hackathons"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <HackathonsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Student Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId/:lessonId"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <LessonPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <LessonPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <PracticePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CodingPlaygroundPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <ProjectsCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <ProjectDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <StudentPortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/:id"
            element={<StudentPortfolioPage />}
          />
          <Route
            path="/career"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CareerCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CareerCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <CareerCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin', 'owner']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Protected Instructor Experience inside InstructorLayout (Faculty Tier) */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin', 'superadmin', 'owner']}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstructorDashboardPage />} />
          <Route path="submissions" element={<InstructorDashboardPage />} />
          <Route path="students" element={<InstructorDashboardPage />} />
          <Route path="overrides" element={<InstructorDashboardPage />} />
          <Route path="live" element={<InstructorDashboardPage />} />
        </Route>

        {/* Protected Admin Experience inside AdminLayout (Operations Tier) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin', 'owner']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="courses" element={<CourseCMSPage />} />
          <Route path="students" element={<StudentsManagerPage />} />
          <Route path="cohorts" element={<StudentsManagerPage />} />
          <Route path="instructors" element={<StudentsManagerPage />} />
          <Route path="career" element={<AdminDashboardPage />} />
          <Route path="certificates" element={<AdminDashboardPage />} />
          <Route path="finance" element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminDashboardPage />} />
          <Route path="projects" element={<CourseCMSPage />} />
        </Route>

        {/* Protected Super Admin Experience inside AdminLayout (Level 1 Root Clearance ONLY) */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'owner']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboardPage />} />
          <Route path="rbac" element={<SuperAdminDashboardPage />} />
          <Route path="users" element={<SuperAdminDashboardPage />} />
          <Route path="audit" element={<SuperAdminDashboardPage />} />
          <Route path="security" element={<SuperAdminDashboardPage />} />
          <Route path="finance" element={<SuperAdminDashboardPage />} />
          <Route path="settings" element={<SuperAdminDashboardPage />} />
          <Route path="logs" element={<SuperAdminDashboardPage />} />
        </Route>

        {/* Dedicated 403 Unauthorized Access Denied Route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
