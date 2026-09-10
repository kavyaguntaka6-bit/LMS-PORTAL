import {
  User,
  UserRole,
  Permission,
  RoleDefinition,
  PermissionGroup,
  ScopeLevel
} from '../types';

// Storage Key
const ROLES_STORAGE_KEY = 'tyc_rbac_roles';

// All Permissions organized by functional domain
export const ALL_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: 'System & Infrastructure',
    description: 'Root level server, database, rate limiting, and environment configs',
    permissions: [
      { id: 'platform:manage_settings', label: 'Global Platform Settings', description: 'Configure system-wide parameters and tenant features', category: 'Platform' },
      { id: 'platform:manage_db', label: 'Database & RLS Configuration', description: 'Direct database management and table-level policies', category: 'Platform' },
      { id: 'platform:manage_api', label: 'API & Rate Limiting', description: 'Configure gateway throughput and token limits', category: 'Platform' },
      { id: 'platform:manage_tenants', label: 'Multi-Tenant Management', description: 'Create, isolate, and partition enterprise tenants', category: 'Platform' },
      { id: 'platform:view_environment', label: 'View Environment Settings', description: 'Inspect cloud environment flags and deployment states', category: 'Platform' },
    ]
  },
  {
    name: 'RBAC & Access Control',
    description: 'Security clearance definition and role-permission matrices',
    permissions: [
      { id: 'rbac:manage_roles', label: 'Manage Roles', description: 'Create, edit, and disable RBAC roles', category: 'RBAC' },
      { id: 'rbac:create_role', label: 'Create Custom Roles', description: 'Define new permission presets', category: 'RBAC' },
      { id: 'rbac:edit_role', label: 'Edit Role Permissions', description: 'Update permission sets assigned to roles', category: 'RBAC' },
      { id: 'rbac:delete_role', label: 'Delete Roles', description: 'Remove non-system custom roles', category: 'RBAC' },
      { id: 'rbac:assign_permissions', label: 'Assign Permissions', description: 'Grant custom permissions to specific users', category: 'RBAC' },
      { id: 'rbac:override_permissions', label: 'Override Lower Permissions', description: 'Supercede department-level permission blocks', category: 'RBAC' },
    ]
  },
  {
    name: 'User & Cohort Management',
    description: 'Student, Instructor, and Admin identity lifecycle',
    permissions: [
      { id: 'users:manage_admins', label: 'Manage Admin Accounts', description: 'Create, configure, and assign department admins', category: 'Users' },
      { id: 'users:manage_instructors', label: 'Manage Instructor Rosters', description: 'Assign faculty to courses and departments', category: 'Users' },
      { id: 'users:manage_students', label: 'Manage Student Directory', description: 'View, edit, and organize student records', category: 'Users' },
      { id: 'users:create', label: 'Create Users', description: 'Direct creation of new user profiles', category: 'Users' },
      { id: 'users:edit', label: 'Edit User Profiles', description: 'Update credentials and assigned departments', category: 'Users' },
      { id: 'users:suspend', label: 'Suspend Accounts', description: 'Freeze access for compliance or disciplinary reasons', category: 'Users' },
      { id: 'users:activate', label: 'Activate Accounts', description: 'Restore suspended user accounts', category: 'Users' },
      { id: 'users:delete', label: 'Delete Users', description: 'Permanently purge user records', category: 'Users' },
      { id: 'users:reset_password', label: 'Reset User Passwords', description: 'Trigger password recovery or set temporary credentials', category: 'Users' },
      { id: 'users:csv_import', label: 'CSV Bulk Student Import', description: 'Batch enroll hundreds of students via CSV uploads', category: 'Users' },
      { id: 'users:manage_cohorts', label: 'Manage Cohorts & Batches', description: 'Group learners into time-bound cohort clusters', category: 'Users' },
    ]
  },
  {
    name: 'Course Governance & Publishing',
    description: 'Syllabus authoring, moderation workflow, and catalogue management',
    permissions: [
      { id: 'courses:create', label: 'Create Courses', description: 'Author new masterclasses and syllabus modules', category: 'Courses' },
      { id: 'courses:edit_own', label: 'Edit Assigned/Authored Courses', description: 'Update course materials for own curriculums', category: 'Courses' },
      { id: 'courses:edit_all', label: 'Edit Any Course', description: 'Unrestricted course editing across all departments', category: 'Courses' },
      { id: 'courses:delete', label: 'Delete Courses', description: 'Purge courses from platform database', category: 'Courses' },
      { id: 'courses:submit_review', label: 'Submit Course for Review', description: 'Send drafted syllabus to Admin moderation queue', category: 'Courses' },
      { id: 'courses:review_approve', label: 'Approve Submitted Courses', description: 'Grant approval for course to be published', category: 'Courses' },
      { id: 'courses:review_reject', label: 'Reject Submitted Courses', description: 'Deny publication with detailed reasoning', category: 'Courses' },
      { id: 'courses:request_changes', label: 'Request Course Revisions', description: 'Send course back to instructor with actionable notes', category: 'Courses' },
      { id: 'courses:publish', label: 'Publish Live Courses', description: 'Make approved courses visible to enrolled students', category: 'Courses' },
      { id: 'courses:archive', label: 'Archive Courses', description: 'Retire deprecated courses from catalog', category: 'Courses' },
    ]
  },
  {
    name: 'Student Evaluations & Grading',
    description: 'Assignment assessments, code reviews, and quiz evaluations',
    permissions: [
      { id: 'assignments:create', label: 'Create Assignments', description: 'Author homework and code challenges', category: 'Assessments' },
      { id: 'assignments:grade_own', label: 'Grade Own Students', description: 'Evaluate submissions for assigned courses', category: 'Assessments' },
      { id: 'assignments:grade_all', label: 'Grade Any Student', description: 'Cross-department grading clearance', category: 'Assessments' },
      { id: 'quizzes:manage', label: 'Manage Quizzes & Banks', description: 'Configure question banks and automated test suites', category: 'Assessments' },
    ]
  },
  {
    name: 'Career Portal & Job Board',
    description: 'Company registrations, job postings, and offer audits',
    permissions: [
      { id: 'career:view', label: 'View Career Portal', description: 'Browse active job listings and internships', category: 'Career' },
      { id: 'career:post_job', label: 'Submit Job Opportunities', description: 'Post new recruiter or startup listings', category: 'Career' },
      { id: 'career:approve_jobs', label: 'Approve Job Postings', description: 'Vet and publish recruiter positions', category: 'Career' },
      { id: 'career:reject_jobs', label: 'Reject Job Postings', description: 'Decline spam or unqualified job listings', category: 'Career' },
      { id: 'career:audit_applications', label: 'Audit Candidate Applications', description: 'Review student applications and verification badges', category: 'Career' },
    ]
  },
  {
    name: 'Financial Governance & Refunds',
    description: 'Payment gateways, currency configurations, and instructor revenue shares',
    permissions: [
      { id: 'finance:manage_stripe', label: 'Global Stripe & Gateway Config', description: 'Root API keys and payment pipeline infrastructure', category: 'Finance' },
      { id: 'finance:manage_pricing', label: 'Enterprise Pricing & Currency', description: 'Set INR/USD exchange matrices and tier discounts', category: 'Finance' },
      { id: 'finance:view_global', label: 'View Global Platform Revenue', description: 'Audit all platform GMV and transaction fees', category: 'Finance' },
      { id: 'finance:view_dept', label: 'View Department Revenue', description: 'Track income generated within assigned department', category: 'Finance' },
      { id: 'finance:view_own_earnings', label: 'View Instructor Commissions', description: 'Monitor personal course sales and payout receipts', category: 'Finance' },
      { id: 'finance:approve_refunds', label: 'Approve/Reject Refunds', description: 'Process student tuition refund requests', category: 'Finance' },
      { id: 'finance:monitor_payouts', label: 'Monitor Faculty Payouts', description: 'Audit commission distribution schedules', category: 'Finance' },
    ]
  },
  {
    name: 'Certificates & Compliance',
    description: 'Passing benchmarks, cryptographic credentials, and revocations',
    permissions: [
      { id: 'certificates:configure_threshold', label: 'Configure Passing Benchmarks', description: 'Set minimum exam thresholds for cert issuance', category: 'Certificates' },
      { id: 'certificates:issue', label: 'Issue Certificates', description: 'Generate verified student credentials', category: 'Certificates' },
      { id: 'certificates:revoke', label: 'Revoke Certificates', description: 'Invalidate credentials with audit logging', category: 'Certificates' },
      { id: 'certificates:audit', label: 'Audit Verification History', description: 'Inspect public verification hits and QR scans', category: 'Certificates' },
    ]
  },
  {
    name: 'Security & Audit Logging',
    description: 'Global activity logs, SSO authentication, and incident inspection',
    permissions: [
      { id: 'security:view_logs', label: 'View Security Logs', description: 'Inspect failed auth attempts, IP blocks, and CVE alerts', category: 'Security' },
      { id: 'security:manage_sso', label: 'Configure SSO/SAML Providers', description: 'Manage Okta, Google Workspace, and Azure AD federation', category: 'Security' },
      { id: 'security:manage_rls', label: 'Manage Row-Level Security', description: 'Define Postgres RLS tenant boundary filters', category: 'Security' },
      { id: 'security:manage_sessions', label: 'Session Termination & Limits', description: 'Force logout active suspect sessions', category: 'Security' },
      { id: 'security:data_recovery', label: 'Data Recovery & Snapshots', description: 'Execute cold backups and rollback checkpoints', category: 'Security' },
      { id: 'audit:view_global', label: 'View Global Audit Logs', description: 'Complete chronological platform trail of all user actions', category: 'Audit' },
      { id: 'audit:view_dept', label: 'View Department Audit Logs', description: 'Audit trail restricted to assigned department', category: 'Audit' },
      { id: 'audit:view_course', label: 'View Course Activity Logs', description: 'Logs related to specific assigned masterclasses', category: 'Audit' },
      { id: 'audit:export', label: 'Export Audit Records', description: 'Download compliance reports as CSV or JSON', category: 'Audit' },
    ]
  },
  {
    name: 'DataLab & Live Sessions',
    description: 'Cloud sandbox override extensions and interactive webinars',
    permissions: [
      { id: 'resources:override_access', label: 'Grant Resource Access Override', description: 'Temporarily grant paid DataLab or course access to a student', category: 'Resources' },
      { id: 'resources:view_datalab', label: 'Access Cloud DataLab', description: 'Launch interactive Jupyter/VSCode cloud runtimes', category: 'Resources' },
      { id: 'resources:manage_datalab', label: 'Manage DataLab Specs', description: 'Configure GPU/RAM quotas and container images', category: 'Resources' },
      { id: 'live:schedule', label: 'Schedule Live Classes & Webinars', description: 'Orchestrate calendar sessions and meeting links', category: 'Live' },
      { id: 'live:host', label: 'Host Live Broadcasts', description: 'Stream video lecture and manage interactive whiteboard', category: 'Live' },
      { id: 'live:moderate_discussions', label: 'Moderate Discussions & Q&A', description: 'Mute attendees, answer questions, and pin threads', category: 'Live' },
    ]
  }
];

// Flat list of all available permission keys
export const ALL_PERMISSIONS: Permission[] = ALL_PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.id)
);

// Standard Role Definitions (Baseline)
export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'superadmin',
    name: 'Super Administrator',
    description: 'Highest-level platform owner with global infrastructure, security, finance, and RBAC authority.',
    badge: 'Level 1 Root',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    isSystem: true,
    scope: 'FULL',
    permissions: [...ALL_PERMISSIONS],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'owner',
    name: 'Platform Creator / Owner',
    description: 'System architect with unrestricted root clearance across all global tenants and clusters.',
    badge: 'System Founder',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    isSystem: true,
    scope: 'FULL',
    permissions: [...ALL_PERMISSIONS],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'admin',
    name: 'Department Administrator',
    description: 'Operations manager responsible for course review workflows, student cohort enrollments, career approvals, and department financials.',
    badge: 'Operations Tier',
    badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    isSystem: true,
    scope: 'DEPARTMENT',
    permissions: [
      'users:manage_instructors',
      'users:manage_students',
      'users:create',
      'users:edit',
      'users:suspend',
      'users:activate',
      'users:reset_password',
      'users:csv_import',
      'users:manage_cohorts',
      'courses:create',
      'courses:edit_all',
      'courses:review_approve',
      'courses:review_reject',
      'courses:request_changes',
      'courses:publish',
      'courses:archive',
      'assignments:create',
      'assignments:grade_all',
      'quizzes:manage',
      'career:view',
      'career:post_job',
      'career:approve_jobs',
      'career:reject_jobs',
      'career:audit_applications',
      'finance:view_dept',
      'finance:approve_refunds',
      'finance:monitor_payouts',
      'certificates:configure_threshold',
      'certificates:issue',
      'certificates:revoke',
      'certificates:audit',
      'analytics:view_dept',
      'analytics:view_course',
      'audit:view_dept',
      'audit:view_course',
      'audit:export',
      'resources:view_datalab',
      'resources:override_access',
      'live:schedule',
      'live:host',
      'live:moderate_discussions'
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'instructor',
    name: 'Faculty Instructor',
    description: 'Content creator and educator managing assigned courses, assignment reviews, live classes, and student resource access overrides.',
    badge: 'Faculty Tier',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    isSystem: true,
    scope: 'COURSE',
    permissions: [
      'courses:create',
      'courses:edit_own',
      'courses:submit_review',
      'assignments:create',
      'assignments:grade_own',
      'quizzes:manage',
      'career:view',
      'finance:view_own_earnings',
      'analytics:view_course',
      'analytics:view_own',
      'audit:view_course',
      'resources:view_datalab',
      'resources:override_access',
      'live:schedule',
      'live:host',
      'live:moderate_discussions'
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'student',
    name: 'Enrolled Learner',
    description: 'Standard learner accessing enrolled masterclasses, coding sandboxes, quizzes, project submissions, and career postings.',
    badge: 'Student Tier',
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    isSystem: true,
    scope: 'OWN',
    permissions: [
      'career:view',
      'analytics:view_own',
      'resources:view_datalab'
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

export const rbacService = {
  getRoles(): RoleDefinition[] {
    try {
      const stored = localStorage.getItem(ROLES_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(DEFAULT_ROLES));
        return DEFAULT_ROLES;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ROLES;
    }
  },

  getRoleById(roleId: string): RoleDefinition | undefined {
    const roles = this.getRoles();
    return roles.find((r) => r.id === roleId || r.name.toLowerCase() === roleId.toLowerCase());
  },

  saveRoles(roles: RoleDefinition[]): void {
    try {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
    } catch (e) {
      console.error('Failed to persist RBAC roles', e);
    }
  },

  createRole(roleData: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'>): RoleDefinition {
    const roles = this.getRoles();
    const id = `custom_${roleData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newRole: RoleDefinition = {
      ...roleData,
      id,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    roles.push(newRole);
    this.saveRoles(roles);
    return newRole;
  },

  updateRole(roleId: string, updates: Partial<RoleDefinition>): RoleDefinition {
    const roles = this.getRoles();
    const idx = roles.findIndex((r) => r.id === roleId);
    if (idx === -1) throw new Error(`Role ${roleId} not found`);

    // Guard: Prevent locking out root Super Admin essential permissions
    if ((roleId === 'superadmin' || roleId === 'owner') && updates.permissions) {
      const essential: Permission[] = [
        'platform:manage_settings',
        'platform:manage_db',
        'rbac:manage_roles',
        'rbac:assign_permissions',
        'users:manage_admins',
        'security:view_logs',
        'audit:view_global'
      ];
      essential.forEach((perm) => {
        if (!updates.permissions!.includes(perm)) {
          updates.permissions!.push(perm);
        }
      });
    }

    const updatedRole = {
      ...roles[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    roles[idx] = updatedRole;
    this.saveRoles(roles);
    return updatedRole;
  },

  deleteRole(roleId: string): boolean {
    const roles = this.getRoles();
    const role = roles.find((r) => r.id === roleId);
    if (!role) return false;
    if (role.isSystem) {
      throw new Error('System-defined core roles cannot be deleted.');
    }
    const filtered = roles.filter((r) => r.id !== roleId);
    this.saveRoles(filtered);
    return true;
  },

  cloneRole(sourceRoleId: string, newName: string): RoleDefinition {
    const source = this.getRoleById(sourceRoleId);
    if (!source) throw new Error(`Source role ${sourceRoleId} not found`);
    return this.createRole({
      name: newName,
      description: `Cloned from ${source.name}. ${source.description}`,
      badge: 'Custom Role',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      scope: source.scope,
      permissions: [...source.permissions]
    });
  },

  /**
   * Main fine-grained permission evaluator with multi-tier contextual scope checking.
   */
  hasPermission(
    user: User | null,
    requiredPermission: Permission,
    context?: {
      organizationId?: string;
      department?: string;
      courseId?: string;
      targetUserId?: string;
    }
  ): boolean {
    if (!user) return false;

    // 1. Account status guard: suspended/inactive accounts have ZERO permissions
    if (user.status === 'inactive' || user.accountStatus === 'suspended' || user.accountStatus === 'inactive') {
      return false;
    }

    // 2. Super Admin & Owner have UNIVERSAL clearance across all permissions and scopes
    if (user.role === 'owner' || user.role === 'superadmin') {
      return true;
    }

    // 3. Collect effective permissions (Role preset + explicit customPermissions override)
    const roleDef = this.getRoleById(user.role);
    const rolePermissions = roleDef ? roleDef.permissions : [];
    const customPermissions = user.customPermissions || user.permissions || [];
    const effectivePermissions = new Set<Permission>([...rolePermissions, ...customPermissions]);

    // If permission is not in the user's effective set, deny immediately
    if (!effectivePermissions.has(requiredPermission)) {
      return false;
    }

    // 4. Scope-Level Contextual Validation
    // ADMIN Scoping
    if (user.role === 'admin') {
      // If action is department-scoped and context specifies department, ensure matching
      if (context?.department && user.department && context.department !== user.department) {
        return false;
      }
      // If organization-scoped and context specifies org, ensure matching
      if (context?.organizationId && user.organizationId && context.organizationId !== user.organizationId) {
        return false;
      }
      return true;
    }

    // INSTRUCTOR Scoping
    if (user.role === 'instructor') {
      // If action involves a course, verify instructor is assigned/author of that course
      if (context?.courseId && user.assignedCourseIds && user.assignedCourseIds.length > 0) {
        if (!user.assignedCourseIds.includes(context.courseId)) {
          return false;
        }
      }
      return true;
    }

    // STUDENT Scoping
    if (user.role === 'student') {
      // Students can only access their own user data
      if (context?.targetUserId && context.targetUserId !== user.id) {
        return false;
      }
      return true;
    }

    return true;
  }
};
