import { AuditLogEntry, User, UserRole, ScopeLevel } from '../types';

const AUDIT_STORAGE_KEY = 'tyc_audit_logs';

export const mockInitialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud_101',
    userId: 'usr_superadmin',
    userName: 'Super Admin Executive',
    userRole: 'superadmin',
    userEmail: 'superadmin@tyc.dev',
    action: 'role_change',
    target: 'User: usr_inst_chen',
    targetId: 'usr_inst_chen',
    scope: 'FULL',
    result: 'SUCCESS',
    description: 'Granted Senior Faculty permission set with DataLab quota extension.',
    metadata: { previousRole: 'instructor', newRole: 'instructor', updatedPermissions: ['resources:manage_datalab'] },
    ipAddress: '192.168.1.1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'aud_102',
    userId: 'usr_admin',
    userName: 'Platform Administrator',
    userRole: 'admin',
    userEmail: 'admin@tyc.dev',
    organizationId: 'org_tyc_core',
    departmentId: 'dept_ai_eng',
    action: 'course_approve',
    target: 'Course: crs_1 (Next.js 15 & AI Masterclass)',
    targetId: 'crs_1',
    scope: 'DEPARTMENT',
    result: 'SUCCESS',
    description: 'Reviewed curriculum modules, verified video player assets, and approved course publication.',
    metadata: { reviewedBy: 'Admin Console', approvalNotes: 'All 8 modules validated against curriculum standard.' },
    ipAddress: '10.0.4.15',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'aud_103',
    userId: 'usr_admin',
    userName: 'Platform Administrator',
    userRole: 'admin',
    userEmail: 'admin@tyc.dev',
    organizationId: 'org_tyc_core',
    departmentId: 'dept_ai_eng',
    action: 'job_approve',
    target: 'Job: job_openai_fellow (AI Research Engineer - Anthropic)',
    targetId: 'job_openai_fellow',
    scope: 'DEPARTMENT',
    result: 'SUCCESS',
    description: 'Verified employer credentials and approved job posting for verified students.',
    ipAddress: '10.0.4.15',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'aud_104',
    userId: 'usr_admin',
    userName: 'Platform Administrator',
    userRole: 'admin',
    userEmail: 'admin@tyc.dev',
    organizationId: 'org_tyc_core',
    departmentId: 'dept_ai_eng',
    action: 'student_csv_import',
    target: 'Cohort: 2026-AI-SPRING (48 Students)',
    targetId: 'cohort_2026_ai',
    scope: 'DEPARTMENT',
    result: 'SUCCESS',
    description: 'Imported and provisioned 48 student accounts via CSV batch pipeline with course enrollments.',
    metadata: { importedCount: 48, failedCount: 0 },
    ipAddress: '10.0.4.15',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'aud_105',
    userId: 'usr_inst_chen',
    userName: 'Dr. Sarah Chen',
    userRole: 'instructor',
    userEmail: 'sarah.chen@tyc.dev',
    organizationId: 'org_tyc_core',
    departmentId: 'dept_ai_eng',
    action: 'resource_override_grant',
    target: 'Student: Alex Rivera (DataLab GPU Node)',
    targetId: 'usr_8829',
    scope: 'COURSE',
    result: 'SUCCESS',
    description: 'Granted 14-day temporary GPU cloud container override for Capstone LLM training.',
    metadata: { expiryDate: '2026-09-17T00:00:00Z', quota: 'A100 GPU 40GB' },
    ipAddress: '172.16.8.2',
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'aud_106',
    userId: 'usr_superadmin',
    userName: 'Super Admin Executive',
    userRole: 'superadmin',
    userEmail: 'superadmin@tyc.dev',
    action: 'system_config_change',
    target: 'Global Stripe & Payment Gateway',
    scope: 'FULL',
    result: 'SUCCESS',
    description: 'Updated production webhook endpoints and enabled multi-currency INR auto-conversion.',
    ipAddress: '192.168.1.1',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const auditService = {
  getLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockInitialAuditLogs));
        return mockInitialAuditLogs;
      }
      return JSON.parse(stored);
    } catch {
      return mockInitialAuditLogs;
    }
  },

  saveLogs(logs: AuditLogEntry[]): void {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to persist audit logs', e);
    }
  },

  log(
    user: User | null,
    action: AuditLogEntry['action'],
    target: string,
    description: string,
    options?: {
      targetId?: string;
      scope?: ScopeLevel;
      result?: 'SUCCESS' | 'DENIED' | 'FAILED';
      metadata?: Record<string, any>;
      organizationId?: string;
      departmentId?: string;
    }
  ): AuditLogEntry {
    const logs = this.getLogs();
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'System Anonymous',
      userRole: user?.role || 'student',
      userEmail: user?.email || 'unknown@tyc.dev',
      organizationId: options?.organizationId || user?.organizationId,
      departmentId: options?.departmentId || user?.department,
      action,
      target,
      targetId: options?.targetId,
      scope: options?.scope || (user?.role === 'superadmin' || user?.role === 'owner' ? 'FULL' : user?.role === 'admin' ? 'DEPARTMENT' : user?.role === 'instructor' ? 'COURSE' : 'OWN'),
      result: options?.result || 'SUCCESS',
      description,
      metadata: options?.metadata,
      ipAddress: '127.0.0.1 (Verified TLS)',
      timestamp: new Date().toISOString()
    };

    logs.unshift(entry);
    this.saveLogs(logs);
    return entry;
  },

  /**
   * Filter audit logs based on caller role & scope.
   */
  getScopedLogs(user: User | null, limit = 100): AuditLogEntry[] {
    if (!user) return [];
    const logs = this.getLogs();

    // Super Admin / Owner: Universal visibility of all system logs
    if (user.role === 'owner' || user.role === 'superadmin') {
      return logs.slice(0, limit);
    }

    // Admin: Logs within assigned organization / department
    if (user.role === 'admin') {
      return logs
        .filter((l) => {
          if (l.scope === 'FULL' && l.userRole === 'superadmin') return false; // Hide global infrastructure logs from Admin
          if (user.organizationId && l.organizationId && l.organizationId !== user.organizationId) return false;
          if (user.department && l.departmentId && l.departmentId !== user.department) return false;
          return true;
        })
        .slice(0, limit);
    }

    // Instructor: Logs within own course scope or own actions
    if (user.role === 'instructor') {
      return logs
        .filter((l) => l.userId === user.id || (user.assignedCourseIds && l.targetId && user.assignedCourseIds.includes(l.targetId)))
        .slice(0, limit);
    }

    // Student: Only own activity logs
    return logs.filter((l) => l.userId === user.id).slice(0, limit);
  }
};
