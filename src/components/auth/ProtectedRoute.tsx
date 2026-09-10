import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Permission } from '../../types';
import { UnauthorizedPage } from '../../features/auth/UnauthorizedPage';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  context?: {
    organizationId?: string;
    department?: string;
    courseId?: string;
    targetUserId?: string;
  };
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredPermission,
  context,
  children
}) => {
  const { user, isLoading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Verifying security clearance & RBAC scope...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. If requiredPermission is specified, evaluate fine-grained permission + scope
  if (requiredPermission && !hasPermission(requiredPermission, context)) {
    return (
      <UnauthorizedPage
        requiredPermission={requiredPermission}
        requiredRole={allowedRoles?.[0]}
      />
    );
  }

  // 2. If allowedRoles is specified, check RBAC role hierarchy clearance
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <UnauthorizedPage
        requiredRole={allowedRoles[0]}
      />
    );
  }

  return <>{children}</>;
};
