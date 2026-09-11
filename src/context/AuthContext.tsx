import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { User, UserRole, Permission, StudentOnboardingData, ActivityLog, ActivityType } from '../types';
import { authService, activityService } from '../services/api';
import { rbacService } from '../services/rbacService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  activities: ActivityLog[];
  hasRole: (allowedRoles: UserRole[]) => boolean;
  hasPermission: (
    requiredPermission: Permission,
    context?: {
      organizationId?: string;
      department?: string;
      courseId?: string;
      targetUserId?: string;
    }
  ) => boolean;
  login: (email: string, password?: string, requestedRole?: UserRole) => Promise<User>;
  register: (name: string, email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  completeOnboarding: (data: StudentOnboardingData) => Promise<void>;
  refreshActivities: () => Promise<void>;
  logUserActivity: (type: ActivityType, title: string, desc: string, relId?: string, relTitle?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchActivities = useCallback(async (userId?: string) => {
    try {
      const logs = await activityService.getActivities(userId, 30);
      setActivities(logs);
    } catch (err) {
      console.error('Error fetching activities', err);
    }
  }, []);

  useEffect(() => {
    if (!isClerkLoaded) return;

    if (isClerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const cleanEmail = email.toLowerCase();
      const isSuperAdminEmail = cleanEmail === 'hcskolluru@gmail.com';
      const userRole: UserRole = isSuperAdminEmail ? 'superadmin' : 'student';

      const unifiedUser: User = {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || (isSuperAdminEmail ? 'HCS Kolluru (Super Admin)' : 'Student Learner'),
        email: cleanEmail || (isSuperAdminEmail ? 'hcskolluru@gmail.com' : 'student@tyc.dev'),
        role: userRole,
        avatar: clerkUser.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        careerGoal: isSuperAdminEmail ? 'Chief Executive & Platform Super Administrator' : 'Full Stack & AI Developer',
        streakDays: isSuperAdminEmail ? 60 : 14,
        longestStreak: isSuperAdminEmail ? 90 : 28,
        weeklyHoursSpent: isSuperAdminEmail ? 45 : 18.5,
        enrolledCourseIds: ['crs_1', 'crs_2', 'crs_3', 'crs_4', 'crs_5'],
        completedCourseIds: ['crs_1', 'crs_2', 'crs_3'],
        completedLessonIds: ['les_1_1', 'les_1_2'],
        certificatesEarned: isSuperAdminEmail ? 5 : 2,
        skills: [],
        joinedDate: 'Jan 2026',
        onboardingCompleted: true,
      };
      setUser(unifiedUser);
      setIsLoading(false);
      fetchActivities(unifiedUser.id);
    } else {
      authService
        .getCurrentUser()
        .then((u) => {
          setUser(u);
          if (u) {
            fetchActivities(u.id);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser, fetchActivities]);

  const role: UserRole = user?.role || 'student';
  const isSuperAdmin = role === 'owner' || role === 'superadmin';
  const isOwner = isSuperAdmin;
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isInstructor = role === 'instructor' || isAdmin;
  const isStudent = role === 'student';

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    // Superadmin / Owner has universal clearance across all tiers
    if (user.role === 'owner' || user.role === 'superadmin') return true;
    // Direct match
    if (allowedRoles.includes(user.role)) return true;
    // Admin can access instructor-tier functionality
    if (user.role === 'admin' && allowedRoles.includes('instructor')) return true;
    return false;
  };

  const hasPermission = (
    requiredPermission: Permission,
    context?: {
      organizationId?: string;
      department?: string;
      courseId?: string;
      targetUserId?: string;
    }
  ): boolean => {
    return rbacService.hasPermission(user, requiredPermission, context);
  };

  const login = async (email: string, password?: string, requestedRole?: UserRole) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.login(email, password, requestedRole);
      setUser(loggedIn);
      await fetchActivities(loggedIn.id);
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const registered = await authService.register(name, email, password);
      setUser(registered);
      await fetchActivities(registered.id);
      return registered;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isClerkSignedIn) {
      try {
        await clerkSignOut();
      } catch (e) {
        console.error('Clerk sign out error', e);
      }
    }
    await authService.logout();
    setUser(null);
    setActivities([]);
  };

  const switchRole = async (newRole: UserRole) => {
    const updated = await authService.switchRole(newRole);
    setUser(updated);
    await fetchActivities(updated.id);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates, user?.role);
    setUser(updated);
    await fetchActivities(updated.id);
    return updated;
  };

  const completeOnboarding = async (data: StudentOnboardingData) => {
    const updated = await authService.completeOnboarding(data);
    setUser(updated);
    await fetchActivities(updated.id);
  };

  const refreshActivities = async () => {
    if (user) {
      await fetchActivities(user.id);
    }
  };

  const logUserActivity = async (
    type: ActivityType,
    title: string,
    desc: string,
    relId?: string,
    relTitle?: string
  ) => {
    if (!user) return;
    await activityService.logActivity(
      user.id,
      user.name,
      user.role,
      type,
      title,
      desc,
      relId,
      relTitle
    );
    await refreshActivities();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isSuperAdmin,
        isOwner,
        isAdmin,
        isInstructor,
        isStudent,
        activities,
        hasRole,
        hasPermission,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        completeOnboarding,
        refreshActivities,
        logUserActivity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
