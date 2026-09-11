import {
  User,
  Course,
  CourseStatus,
  CourseReviewStatus,
  LearningPath,
  PracticeProblem,
  Project,
  ProjectSubmission,
  Certificate,
  JobOpportunity,
  Workshop,
  Hackathon,
  CommunityPost,
  NotificationItem,
  AIMessage,
  AITutorMode,
  StudentOnboardingData,
  StudentPreferences,
  UserRole,
  ActivityLog,
  ActivityType,
  Assignment,
  AssignmentSubmission,
  Organization,
  Cohort,
  ResourceAccessOverride,
  RefundRequest,
  AuditLogEntry,
  Permission,
  RoleDefinition
} from '../types';
import {
  mockCurrentUser,
  mockOwnerUser,
  mockSuperAdminUser,
  mockAdminUser,
  mockInstructorUser,
  mockAllSeedUsers,
  mockCourses,
  mockLearningPaths,
  mockPracticeProblems,
  mockProjects,
  mockCertificates,
  mockJobOpportunities,
  mockWorkshops,
  mockHackathons,
  mockCommunityPosts,
  mockNotifications,
  mockAdminStats,
  mockInitialActivityLogs,
  mockAssignments,
  mockAssignmentSubmissions,
  mockOrganizations,
  mockCohorts,
  mockResourceOverrides,
  mockRefundRequests
} from './mockData';
import { rbacService } from './rbacService';
import { auditService } from './auditService';

// Helper to simulate realistic network delay (optimized to 0ms for instant client responsiveness)
const delay = (ms = 0) => new Promise((resolve) => (ms > 0 ? setTimeout(resolve, ms) : resolve(null)));

// Storage Keys
const STORAGE_PREFIX = 'tyc_';
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

// ==================== ACTIVITY SERVICE ====================
export const activityService = {
  async getActivities(userId?: string, limit = 20): Promise<ActivityLog[]> {
    await delay(0);
    const all = getStored('activityLogs', mockInitialActivityLogs);
    if (!userId) return all.slice(0, limit);
    return all.filter((a) => a.userId === userId).slice(0, limit);
  },

  async logActivity(
    userId: string,
    userName: string,
    userRole: UserRole,
    activityType: ActivityType,
    title: string,
    description: string,
    relatedId?: string,
    relatedTitle?: string
  ): Promise<ActivityLog> {
    const all = getStored('activityLogs', mockInitialActivityLogs);
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      userRole,
      activityType,
      title,
      description,
      relatedId,
      relatedTitle,
      timestamp: 'Just now'
    };
    all.unshift(newLog);
    setStored('activityLogs', all);
    return newLog;
  }
};

// ==================== AUTH & USER SERVICE (RBAC) ====================
export const authService = {
  async getAllUsers(): Promise<User[]> {
    await delay(0);
    const users = getStored('users', mockAllSeedUsers);
    
    // Ensure primary Super Admin account (hcskolluru@gmail.com) is always seeded with Level 1 Super Admin role
    const hcsIdx = users.findIndex((u) => u.email.toLowerCase() === 'hcskolluru@gmail.com');
    if (hcsIdx === -1) {
      users.unshift(mockSuperAdminUser);
      setStored('users', users);
    } else if (users[hcsIdx].role !== 'superadmin' && users[hcsIdx].role !== 'owner') {
      users[hcsIdx].role = 'superadmin';
      users[hcsIdx].passwordHash = 'tyc@2021';
      users[hcsIdx].status = 'active';
      users[hcsIdx].accountStatus = 'active';
      setStored('users', users);
    }

    return users;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(0);
    return getStored('currentUser', null);
  },

  async login(email: string, password?: string, requestedRole?: UserRole): Promise<User> {
    await delay(0);
    const users = await this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check if Super Admin login
    if (cleanEmail === 'hcskolluru@gmail.com') {
      if (password && password !== 'tyc@2021' && password !== 'SuperAdmin@123') {
        throw new Error('Invalid credentials: Incorrect password for Super Admin.');
      }

      let matchedUser = users.find((u) => u.email.toLowerCase() === 'hcskolluru@gmail.com');
      if (!matchedUser) {
        matchedUser = { ...mockSuperAdminUser };
        users.unshift(matchedUser);
      } else {
        matchedUser.role = 'superadmin';
        matchedUser.status = 'active';
        matchedUser.accountStatus = 'active';
      }

      matchedUser.lastLogin = 'Just now';
      setStored('currentUser', matchedUser);

      const idx = users.findIndex((u) => u.id === matchedUser!.id);
      if (idx !== -1) {
        users[idx] = matchedUser;
      }
      setStored('users', users);

      await activityService.logActivity(
        matchedUser.id,
        matchedUser.name,
        matchedUser.role,
        'login',
        'Super Admin Authenticated',
        'Root clearance session established for hcskolluru@gmail.com.'
      );

      return matchedUser;
    }

    // Standard User / Student / Staff Login
    let matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      // If user exists, update role if explicitly requested in staff mode
      if (requestedRole && requestedRole !== 'student' && matchedUser.role === 'student') {
        matchedUser.role = requestedRole;
      }
      matchedUser.lastLogin = 'Just now';
    } else {
      // Automatically register new student user
      const defaultName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      matchedUser = {
        id: `usr_${Date.now()}`,
        name: defaultName || 'Student Learner',
        email: cleanEmail,
        passwordHash: password || 'student@123',
        role: requestedRole || 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 00000',
        college: 'TYC Academy of Engineering',
        branch: 'Computer Science & AI',
        year: '3rd Year',
        status: 'active',
        accountStatus: 'active',
        lastLogin: 'Just now',
        careerGoal: 'Full Stack & AI Developer',
        bio: 'Student learner pursuing full stack software engineering and AI systems.',
        streakDays: 7,
        longestStreak: 14,
        weeklyHoursSpent: 12.5,
        enrolledCourseIds: ['crs_1', 'crs_2', 'crs_3'],
        completedCourseIds: ['crs_1'],
        completedLessonIds: ['les_1_1', 'les_1_2'],
        certificatesEarned: 1,
        joinedDate: 'Jan 2026',
        onboardingCompleted: true,
        skills: [
          { id: 'sk_1', name: 'React 19', level: 78, category: 'Frontend', verified: true },
          { id: 'sk_2', name: 'TypeScript', level: 75, category: 'Frontend', verified: true }
        ]
      };
      users.push(matchedUser);
    }

    setStored('currentUser', matchedUser);
    setStored('users', users);

    await activityService.logActivity(
      matchedUser.id,
      matchedUser.name,
      matchedUser.role,
      'login',
      'User Authenticated',
      `Session established for ${matchedUser.name} (${matchedUser.role}).`
    );

    return matchedUser;
  },

  async register(name: string, email: string, password?: string): Promise<User> {
    await delay(0);
    const users = await this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();

    let matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      matchedUser = {
        id: `usr_${Date.now()}`,
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        passwordHash: password || 'student@123',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 00000',
        college: 'TYC Academy of Engineering',
        branch: 'Computer Science',
        year: '1st Year',
        status: 'active',
        accountStatus: 'active',
        lastLogin: 'Just now',
        careerGoal: 'Full Stack & AI Developer',
        bio: 'Student learner registered on Traya Yukti.',
        streakDays: 1,
        longestStreak: 1,
        weeklyHoursSpent: 2,
        enrolledCourseIds: ['crs_1', 'crs_2'],
        completedCourseIds: [],
        completedLessonIds: [],
        certificatesEarned: 0,
        joinedDate: 'Jan 2026',
        onboardingCompleted: true,
        skills: [
          { id: 'sk_1', name: 'React 19', level: 70, category: 'Frontend', verified: true }
        ]
      };
      users.push(matchedUser);
      setStored('users', users);
    }

    setStored('currentUser', matchedUser);

    await activityService.logActivity(
      matchedUser.id,
      matchedUser.name,
      matchedUser.role,
      'login',
      'Account Created',
      `New student registered: ${matchedUser.name}`
    );

    return matchedUser;
  },

  async logout(): Promise<void> {
    await delay(50);
    localStorage.removeItem('tyc_currentUser');
  },

  async updateProfile(updates: Partial<User>, callerRole?: UserRole): Promise<User> {
    await delay(150);
    const current = await this.getCurrentUser();
    
    // Security guard: If caller is a standard student, prevent modifying protected fields
    const sanitizedUpdates = { ...updates };
    if (callerRole === 'student' || (!callerRole && current.role === 'student')) {
      delete sanitizedUpdates.role;
      delete sanitizedUpdates.status;
      delete sanitizedUpdates.certificatesEarned;
      delete sanitizedUpdates.completedCourseIds;
    }

    const updated = { ...current, ...sanitizedUpdates };
    setStored('currentUser', updated);

    // Update in users table
    const users = await this.getAllUsers();
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      users[idx] = updated;
      setStored('users', users);
    }

    await activityService.logActivity(
      updated.id,
      updated.name,
      updated.role,
      'profile_updated',
      'Updated Profile Details',
      'Saved bio, skills, or educational institution details.'
    );

    return updated;
  },

  async saveStudentPreferencesAndEnroll(
    selectedCourseIds: string[],
    preferences: StudentPreferences
  ): Promise<User> {
    await delay(200);
    const current = await this.getCurrentUser();
    if (!current) throw new Error('Unauthenticated user');

    // Merge existing enrolled courses with new selected courses (no duplicates)
    const existingEnrolled = current.enrolledCourseIds || [];
    const mergedEnrolled = Array.from(new Set([...existingEnrolled, ...selectedCourseIds]));

    const updated: User = {
      ...current,
      enrolledCourseIds: mergedEnrolled,
      onboardingCompleted: true,
      preferences: {
        ...preferences,
        completedAt: new Date().toISOString()
      }
    };

    setStored('currentUser', updated);

    // Update in users table
    const users = await this.getAllUsers();
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      users[idx] = updated;
      setStored('users', users);
    }

    await activityService.logActivity(
      updated.id,
      updated.name,
      updated.role,
      'course_enrolled',
      'Completed Course Onboarding',
      `Personalized preferences saved. Enrolled in ${selectedCourseIds.length} recommended course(s).`
    );

    return updated;
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended', callerUser?: User): Promise<User[]> {
    await delay(150);
    const users = await this.getAllUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const targetUser = users[idx];
      users[idx].status = status === 'suspended' ? 'inactive' : status;
      users[idx].accountStatus = status;
      setStored('users', users);

      auditService.log(
        callerUser || null,
        status === 'suspended' ? 'student_suspend' : 'student_activate',
        `User: ${targetUser.name} (${targetUser.email})`,
        `Account status modified to ${status.toUpperCase()}`,
        { targetId: userId, organizationId: targetUser.organizationId, departmentId: targetUser.department }
      );
    }
    return users;
  },

  async updateUserRole(userId: string, role: UserRole, callerUser?: User): Promise<User[]> {
    await delay(150);
    const current = callerUser || (await this.getCurrentUser());
    
    // Authorization Check: Only Super Admin (or Admin managing students/instructors) can change roles
    if (current && !rbacService.hasPermission(current, 'rbac:manage_roles') && !rbacService.hasPermission(current, 'users:manage_students')) {
      auditService.log(
        current,
        'permission_change',
        `User ID: ${userId}`,
        `Unauthorized privilege elevation attempt to ${role.toUpperCase()}`,
        { result: 'DENIED' }
      );
      throw new Error('403 Forbidden: Insufficient clearance to modify user roles.');
    }

    const users = await this.getAllUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const oldRole = users[idx].role;
      users[idx].role = role;
      if (!users[idx].auditInfo) users[idx].auditInfo = {};
      users[idx].auditInfo!.lastRoleModified = new Date().toISOString();
      users[idx].auditInfo!.lastRoleModifiedBy = current?.name || 'System';
      setStored('users', users);

      auditService.log(
        current,
        'role_change',
        `User: ${users[idx].name} (${users[idx].email})`,
        `Role clearance updated from ${oldRole.toUpperCase()} to ${role.toUpperCase()}`,
        { targetId: userId, metadata: { previousRole: oldRole, newRole: role } }
      );
    }
    return users;
  },

  async createUser(userData: Partial<User>, callerUser?: User): Promise<User> {
    await delay(200);
    const current = callerUser || (await this.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'users:create')) {
      throw new Error('403 Forbidden: Insufficient clearance to create user accounts.');
    }

    const users = await this.getAllUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const newUser: User = {
      ...mockCurrentUser,
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: userData.name || 'New User',
      email: cleanEmail,
      role: userData.role || 'student',
      status: 'active',
      accountStatus: 'active',
      organizationId: userData.organizationId || current?.organizationId || 'org_tyc_core',
      organizationName: userData.organizationName || current?.organizationName || 'Traya Yukti Academic Partner',
      department: userData.department || current?.department || 'Computer Science & AI',
      passwordHash: userData.passwordHash || 'password123',
      enrolledCourseIds: userData.enrolledCourseIds || [],
      assignedCourseIds: userData.assignedCourseIds || [],
      joinedDate: 'Just now',
      streakDays: 1,
      skills: [],
      auditInfo: {
        createdBy: current?.name || 'Admin',
        ipAddress: '127.0.0.1'
      }
    };

    users.push(newUser);
    setStored('users', users);

    auditService.log(
      current,
      'student_create',
      `User: ${newUser.name} (${newUser.email})`,
      `Created ${newUser.role.toUpperCase()} account assigned to ${newUser.department}`,
      { targetId: newUser.id, organizationId: newUser.organizationId, departmentId: newUser.department }
    );

    return newUser;
  },

  async resetUserPassword(userId: string, callerUser?: User): Promise<{ success: boolean; tempPass: string }> {
    await delay(150);
    const current = callerUser || (await this.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'users:reset_password')) {
      throw new Error('403 Forbidden: Insufficient clearance to reset passwords.');
    }

    const users = await this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found.');

    const tempPass = `TYC-${Math.floor(100000 + Math.random() * 900000)}`;
    user.passwordHash = tempPass;
    if (!user.auditInfo) user.auditInfo = {};
    user.auditInfo.lastPasswordReset = new Date().toISOString();
    setStored('users', users);

    auditService.log(
      current,
      'password_reset',
      `User: ${user.name} (${user.email})`,
      'Administrative password reset initiated; temporary password generated.',
      { targetId: user.id }
    );

    return { success: true, tempPass };
  },

  async deleteUser(userId: string, callerUser?: User): Promise<User[]> {
    await delay(200);
    const current = callerUser || (await this.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'users:delete')) {
      throw new Error('403 Forbidden: Insufficient clearance to delete user accounts.');
    }

    let users = await this.getAllUsers();
    const target = users.find((u) => u.id === userId);
    if (target?.role === 'owner' || target?.role === 'superadmin') {
      throw new Error('Action blocked: Super Admin root accounts cannot be deleted.');
    }

    users = users.filter((u) => u.id !== userId);
    setStored('users', users);

    auditService.log(
      current,
      'role_change',
      `User: ${target?.name || userId}`,
      'User record permanently purged from platform directory.',
      { targetId: userId }
    );

    return users;
  },

  async switchRole(role: UserRole): Promise<User> {
    await delay(100);
    const current = await this.getCurrentUser();
    // Verify user is allowed to switch or simulate persona
    let targetUser: User;
    if (role === 'owner') targetUser = mockOwnerUser;
    else if (role === 'superadmin') targetUser = mockSuperAdminUser;
    else if (role === 'admin') targetUser = mockAdminUser;
    else if (role === 'instructor') targetUser = mockInstructorUser;
    else targetUser = { ...current, role: 'student' };

    setStored('currentUser', targetUser);
    return targetUser;
  },

  async completeOnboarding(data: StudentOnboardingData): Promise<User> {
    await delay(300);
    const current = await this.getCurrentUser();
    const updated: User = {
      ...current,
      name: data.name || current.name,
      careerGoal: data.careerGoal,
      educationLevel: data.educationLevel,
      experienceLevel: data.experienceLevel as any,
      weeklyHoursSpent: data.weeklyHours,
      skills: data.currentSkills.map((sk, idx) => ({
        id: `sk_${idx}`,
        name: sk,
        level: 50 + Math.floor(Math.random() * 30),
        category: 'Frontend',
        verified: false
      }))
    };
    setStored('currentUser', updated);
    return updated;
  }
};

// ==================== ASSIGNMENT & INSTRUCTOR SERVICE ====================
export const assignmentService = {
  async getAssignments(courseId?: string): Promise<Assignment[]> {
    await delay(80);
    const all = getStored('assignments', mockAssignments);
    if (!courseId) return all;
    return all.filter((a) => a.courseId === courseId);
  },

  async getSubmissions(instructorId?: string, studentId?: string): Promise<AssignmentSubmission[]> {
    await delay(100);
    const all = getStored('assignmentSubmissions', mockAssignmentSubmissions);
    if (studentId) return all.filter((s) => s.studentId === studentId);
    return all;
  },

  async createAssignment(assignmentData: Omit<Assignment, 'id' | 'submissionsCount'>): Promise<Assignment> {
    await delay(200);
    const all = await this.getAssignments();
    const newAsg: Assignment = {
      ...assignmentData,
      id: `asg_${Date.now()}`,
      submissionsCount: 0
    };
    all.unshift(newAsg);
    setStored('assignments', all);
    return newAsg;
  },

  async gradeSubmission(
    submissionId: string,
    marksObtained: number,
    feedback: string,
    instructorName: string
  ): Promise<AssignmentSubmission> {
    await delay(250);
    const all = getStored('assignmentSubmissions', mockAssignmentSubmissions);
    const idx = all.findIndex((s) => s.id === submissionId);
    if (idx === -1) throw new Error('Submission not found');

    all[idx].marksObtained = marksObtained;
    all[idx].feedback = feedback;
    all[idx].status = 'reviewed';
    all[idx].reviewedBy = instructorName;
    all[idx].reviewedAt = new Date().toISOString();

    setStored('assignmentSubmissions', all);

    // Automatically log activity for the student
    await activityService.logActivity(
      all[idx].studentId,
      all[idx].studentName,
      'student',
      'assignment_graded',
      `Assignment Reviewed: ${all[idx].assignmentTitle}`,
      `Instructor ${instructorName} awarded ${marksObtained}/${all[idx].maxMarks} marks with feedback: "${feedback}"`,
      all[idx].assignmentId,
      all[idx].assignmentTitle
    );

    return all[idx];
  }
};

// ==================== COURSE SERVICE (GOVERNANCE & RBAC) ====================
export const courseService = {
  async getCourses(): Promise<Course[]> {
    await delay(80);
    return getStored('courses', mockCourses);
  },

  async getCourseById(id: string): Promise<Course | null> {
    await delay(80);
    const courses = await this.getCourses();
    return courses.find((c) => c.id === id || c.slug === id) || null;
  },

  async saveCourse(courseData: Course, callerUser?: User): Promise<Course> {
    await delay(180);
    const current = callerUser || (await authService.getCurrentUser());
    const isNew = !courseData.id || courseData.id.startsWith('temp_');
    const courses = await this.getCourses();

    if (isNew) {
      if (current && !rbacService.hasPermission(current, 'courses:create')) {
        throw new Error('403 Forbidden: Insufficient clearance to create courses.');
      }
      const newCourse: Course = {
        ...courseData,
        id: `crs_${Date.now()}`,
        slug: courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        status: current?.role === 'instructor' ? 'draft' : (courseData.status || 'published'),
        reviewStatus: 'draft',
        lastUpdated: 'Just now'
      };
      courses.unshift(newCourse);
      setStored('courses', courses);

      auditService.log(
        current,
        'course_create',
        `Course: ${newCourse.title}`,
        `Course created in draft state by ${current?.name || 'User'}`,
        { targetId: newCourse.id, organizationId: newCourse.organizationId }
      );
      return newCourse;
    } else {
      const idx = courses.findIndex((c) => c.id === courseData.id);
      if (idx === -1) throw new Error('Course not found');

      // Ownership check for instructors: can only edit own courses
      if (current?.role === 'instructor' && !rbacService.hasPermission(current, 'courses:edit_all')) {
        if (!rbacService.hasPermission(current, 'courses:edit_own', { courseId: courseData.id })) {
          throw new Error('403 Forbidden: Cannot modify courses authored by other faculty.');
        }
      }

      courses[idx] = { ...courseData, lastUpdated: 'Just now' };
      setStored('courses', courses);
      return courses[idx];
    }
  },

  async submitForReview(courseId: string, callerUser?: User): Promise<Course> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'courses:submit_review')) {
      throw new Error('403 Forbidden: Insufficient clearance to submit course for review.');
    }

    const courses = await this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) throw new Error('Course not found');

    courses[idx].status = 'submitted_for_review';
    courses[idx].reviewStatus = 'submitted';
    courses[idx].submittedAt = new Date().toISOString();
    setStored('courses', courses);

    auditService.log(
      current,
      'course_submit_review',
      `Course: ${courses[idx].title}`,
      `Syllabus and modules submitted to Admin Moderation Queue by ${current?.name}`,
      { targetId: courseId }
    );

    return courses[idx];
  },

  async reviewCourse(
    courseId: string,
    decision: 'approved' | 'rejected' | 'changes_requested',
    notes: string,
    callerUser?: User
  ): Promise<Course> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'courses:review_approve')) {
      throw new Error('403 Forbidden: Department Admin clearance required to review courses.');
    }

    const courses = await this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) throw new Error('Course not found');

    courses[idx].reviewStatus = decision;
    courses[idx].reviewNotes = notes;
    courses[idx].reviewedAt = new Date().toISOString();
    courses[idx].reviewedBy = current?.name || 'Admin';

    if (decision === 'approved') {
      courses[idx].status = 'approved';
    } else if (decision === 'rejected') {
      courses[idx].status = 'draft';
    } else if (decision === 'changes_requested') {
      courses[idx].status = 'changes_requested';
    }

    setStored('courses', courses);

    auditService.log(
      current,
      decision === 'approved' ? 'course_approve' : 'course_reject',
      `Course: ${courses[idx].title}`,
      `Review verdict: ${decision.toUpperCase()}. Notes: "${notes}"`,
      { targetId: courseId, metadata: { decision, notes } }
    );

    return courses[idx];
  },

  async publishCourse(courseId: string, callerUser?: User): Promise<Course> {
    await delay(180);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'courses:publish')) {
      throw new Error('403 Forbidden: Instructors cannot publish directly. Admin approval required.');
    }

    const courses = await this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) throw new Error('Course not found');

    courses[idx].status = 'published';
    courses[idx].reviewStatus = 'published';
    courses[idx].lastUpdated = 'Just now';
    setStored('courses', courses);

    auditService.log(
      current,
      'course_publish',
      `Course: ${courses[idx].title}`,
      'Course published to live public catalog by Admin.',
      { targetId: courseId }
    );

    return courses[idx];
  },

  async archiveCourse(courseId: string, callerUser?: User): Promise<Course> {
    await delay(150);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'courses:archive')) {
      throw new Error('403 Forbidden: Insufficient clearance to archive courses.');
    }

    const courses = await this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) throw new Error('Course not found');

    courses[idx].status = 'archived';
    setStored('courses', courses);

    auditService.log(
      current,
      'course_archive',
      `Course: ${courses[idx].title}`,
      'Course retired from active directory.',
      { targetId: courseId }
    );

    return courses[idx];
  },

  async enroll(courseId: string): Promise<User> {
    await delay(0);
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Unauthenticated');
    const course = await this.getCourseById(courseId);
    if (!user.enrolledCourseIds) user.enrolledCourseIds = [];
    if (!user.enrolledCourseIds.includes(courseId)) {
      user.enrolledCourseIds.push(courseId);
      setStored('currentUser', user);

      await activityService.logActivity(
        user.id,
        user.name,
        user.role,
        'course_enrolled',
        `Enrolled in ${course?.title || 'New Masterclass'}`,
        'Unlocked course syllabus, interactive coding labs, and project capstones.',
        courseId,
        course?.title
      );
    }
    return user;
  },

  async toggleLessonComplete(courseId: string, lessonId: string): Promise<{ completed: boolean; completedLessonIds: string[] }> {
    await delay(0);
    const user = await authService.getCurrentUser();
    if (!user) return { completed: false, completedLessonIds: [] };
    if (!user.completedLessonIds) user.completedLessonIds = [];
    const course = await this.getCourseById(courseId);
    const index = user.completedLessonIds.indexOf(lessonId);
    let completed = false;
    if (index > -1) {
      user.completedLessonIds.splice(index, 1);
      completed = false;
    } else {
      user.completedLessonIds.push(lessonId);
      completed = true;

      // Log lesson completion activity
      await activityService.logActivity(
        user.id,
        user.name,
        user.role,
        'lesson_completed',
        `Completed Lesson in ${course?.title || 'Masterclass'}`,
        'Successfully passed code walkthrough and validated interactive concepts.',
        courseId,
        course?.title
      );
    }
    setStored('currentUser', user);
    return { completed, completedLessonIds: user.completedLessonIds };
  }
};

// ==================== LEARNING PATHS SERVICE ====================
export const learningPathService = {
  async getPaths(): Promise<LearningPath[]> {
    await delay(80);
    return getStored('learningPaths', mockLearningPaths);
  },

  async getPathById(id: string): Promise<LearningPath | null> {
    await delay(80);
    const paths = await this.getPaths();
    return paths.find((p) => p.id === id || p.slug === id) || null;
  }
};

// ==================== PRACTICE SERVICE ====================
export const practiceService = {
  async getProblems(): Promise<PracticeProblem[]> {
    await delay(80);
    return getStored('practiceProblems', mockPracticeProblems);
  },

  async getProblemById(id: string): Promise<PracticeProblem | null> {
    await delay(80);
    const problems = await this.getProblems();
    return problems.find((p) => p.id === id) || null;
  },

  async submitSolution(problemId: string, _solutionCode: string): Promise<{ success: boolean; message: string; output: string }> {
    await delay(500);
    const user = await authService.getCurrentUser();
    const problem = await this.getProblemById(problemId);

    // Log solved coding challenge activity
    await activityService.logActivity(
      user.id,
      user.name,
      user.role,
      'coding_challenge_solved',
      `Solved Challenge: ${problem?.title || 'Algorithm Problem'}`,
      'Passed all automated test suites with high performance execution.',
      problemId,
      problem?.title
    );

    return {
      success: true,
      message: 'All test cases passed! Runtime: 38ms (Top 95.8% execution percentile).',
      output: 'Test Case 1: PASSED [0, 1]\nTest Case 2: PASSED [1, 2]\nTest Case 3: PASSED [0, 1]'
    };
  }
};

// ==================== PROJECTS SERVICE ====================
export const projectService = {
  async getProjects(): Promise<Project[]> {
    await delay(80);
    return getStored('projects', mockProjects);
  },

  async getProjectById(id: string): Promise<Project | null> {
    await delay(80);
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id || p.slug === id) || null;
  },

  async submitProject(projectId: string, submission: Partial<ProjectSubmission>): Promise<ProjectSubmission> {
    await delay(400);
    const user = await authService.getCurrentUser();
    const project = await this.getProjectById(projectId);

    const sub: ProjectSubmission = {
      id: `sub_${Date.now()}`,
      projectId,
      userId: user.id,
      githubUrl: submission.githubUrl || '',
      liveUrl: submission.liveUrl,
      zipFileName: submission.zipFileName,
      demoVideoUrl: submission.demoVideoUrl,
      notes: submission.notes,
      submittedAt: 'Just now',
      status: 'submitted'
    };
    
    // Update local project state
    const projects = await this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      projects[idx].status = 'submitted';
      projects[idx].submission = sub;
      setStored('projects', projects);
    }

    // Log project submission activity
    await activityService.logActivity(
      user.id,
      user.name,
      user.role,
      'project_submitted',
      `Submitted Project: ${project?.title || 'Capstone Project'}`,
      'Repository code and deployment submitted for instructor code review.',
      projectId,
      project?.title
    );

    return sub;
  }
};

// ==================== CERTIFICATES SERVICE (GOVERNANCE & RBAC) ====================
export const certificateService = {
  async getCertificates(): Promise<Certificate[]> {
    await delay(80);
    return getStored('certificates', mockCertificates);
  },

  async verifyCertificate(certId: string): Promise<Certificate | null> {
    await delay(200);
    const certs = await this.getCertificates();
    return certs.find((c) => c.certificateId.toLowerCase() === certId.trim().toLowerCase()) || null;
  },

  async issueCertificate(certData: Partial<Certificate>, callerUser?: User): Promise<Certificate> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'certificates:issue')) {
      throw new Error('403 Forbidden: Insufficient clearance to issue certificates.');
    }

    const certs = await this.getCertificates();
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      certificateId: certData.certificateId || `TYC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      courseId: certData.courseId || 'crs_1',
      courseTitle: certData.courseTitle || 'Masterclass Certification',
      studentId: certData.studentId || 'usr_8829',
      studentName: certData.studentName || 'Student Learner',
      instructorName: certData.instructorName || current?.name || 'Faculty Director',
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skills: certData.skills || ['AI Engineering', 'Full Stack Development'],
      grade: certData.grade || 'A+ (Distinction)',
      verificationUrl: `https://trayayukti.com/verify/${certData.certificateId || 'TYC-2026-VERIFIED'}`,
      credentialScore: certData.credentialScore || 95
    };

    certs.unshift(newCert);
    setStored('certificates', certs);

    auditService.log(
      current,
      'certificate_issue',
      `Certificate: ${newCert.certificateId} for ${newCert.studentName}`,
      `Verified credential issued for ${newCert.courseTitle}`,
      { targetId: newCert.id }
    );

    return newCert;
  },

  async revokeCertificate(certificateId: string, reason: string, callerUser?: User): Promise<boolean> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'certificates:revoke')) {
      throw new Error('403 Forbidden: Insufficient clearance to revoke certificates.');
    }

    let certs = await this.getCertificates();
    const target = certs.find((c) => c.certificateId === certificateId || c.id === certificateId);
    if (!target) throw new Error('Certificate not found.');

    certs = certs.filter((c) => c.certificateId !== certificateId && c.id !== certificateId);
    setStored('certificates', certs);

    auditService.log(
      current,
      'certificate_revoke',
      `Certificate: ${target.certificateId} (${target.studentName})`,
      `Certificate revoked. Reason: "${reason}"`,
      { targetId: target.id, metadata: { reason } }
    );

    return true;
  }
};

// ==================== CAREER SERVICE (GOVERNANCE & RBAC) ====================
export const careerService = {
  async getJobs(): Promise<JobOpportunity[]> {
    await delay(80);
    return getStored('jobs', mockJobOpportunities);
  },

  async applyJob(jobId: string): Promise<{ success: boolean; message: string }> {
    await delay(300);
    const jobs = await this.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      job.applied = true;
      setStored('jobs', jobs);
    }
    return { success: true, message: 'Application submitted with your verified TYC Skill Certificate!' };
  },

  async approveJob(jobId: string, callerUser?: User): Promise<JobOpportunity> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'career:approve_jobs')) {
      throw new Error('403 Forbidden: Admin clearance required to approve job listings.');
    }

    const jobs = await this.getJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job posting not found');

    setStored('jobs', jobs);

    auditService.log(
      current,
      'job_approve',
      `Job Posting: ${job.title} at ${job.company}`,
      'Job posting approved for verified student directory.',
      { targetId: jobId }
    );

    return job;
  },

  async rejectJob(jobId: string, reason: string, callerUser?: User): Promise<boolean> {
    await delay(180);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'career:reject_jobs')) {
      throw new Error('403 Forbidden: Admin clearance required to reject job listings.');
    }

    let jobs = await this.getJobs();
    const target = jobs.find((j) => j.id === jobId);
    jobs = jobs.filter((j) => j.id !== jobId);
    setStored('jobs', jobs);

    auditService.log(
      current,
      'job_reject',
      `Job Posting: ${target?.title || jobId}`,
      `Job posting rejected. Reason: "${reason}"`,
      { targetId: jobId, metadata: { reason } }
    );

    return true;
  }
};

// ==================== COHORT & CSV BATCH ENROLLMENT SERVICE ====================
export const cohortService = {
  async getCohorts(organizationId?: string): Promise<Cohort[]> {
    await delay(80);
    const cohorts = getStored('cohorts', mockCohorts);
    if (organizationId) return cohorts.filter((c: Cohort) => c.organizationId === organizationId);
    return cohorts;
  },

  async createCohort(cohortData: Partial<Cohort>, callerUser?: User): Promise<Cohort> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'users:manage_cohorts')) {
      throw new Error('403 Forbidden: Clearance required to create student cohorts.');
    }

    const cohorts = await this.getCohorts();
    const newCohort: Cohort = {
      id: `cohort_${Date.now()}`,
      organizationId: cohortData.organizationId || current?.organizationId || 'org_tyc_core',
      departmentId: cohortData.departmentId || current?.department,
      name: cohortData.name || 'New Student Cohort',
      code: cohortData.code || `TYC-${Date.now() % 10000}`,
      description: cohortData.description || 'Batch of enrolled learners.',
      assignedCourseIds: cohortData.assignedCourseIds || ['crs_1'],
      studentIds: cohortData.studentIds || [],
      startDate: cohortData.startDate || new Date().toISOString().split('T')[0],
      endDate: cohortData.endDate || '2026-12-31',
      status: 'active'
    };

    cohorts.unshift(newCohort);
    setStored('cohorts', cohorts);

    auditService.log(
      current,
      'cohort_assign',
      `Cohort: ${newCohort.name} (${newCohort.code})`,
      `Created new student cohort cluster assigned to ${newCohort.departmentId || 'Department'}`,
      { targetId: newCohort.id }
    );

    return newCohort;
  },

  async importStudentsFromCSV(
    csvContent: string,
    cohortId: string,
    assignedCourseIds: string[],
    callerUser?: User
  ): Promise<{ importedCount: number; failedCount: number; importedUsers: User[] }> {
    await delay(400);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'users:csv_import')) {
      throw new Error('403 Forbidden: Clearance required for CSV bulk enrollment.');
    }

    const lines = csvContent.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or missing data rows.');
    }

    const existingUsers = await authService.getAllUsers();
    const importedUsers: User[] = [];
    let failedCount = 0;

    // Header row: name,email,college,branch,year
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length < 2 || !parts[1].includes('@')) {
        failedCount++;
        continue;
      }
      const [name, email, college, branch, year] = parts;
      const cleanEmail = email.toLowerCase();

      // Check if already registered
      if (existingUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        failedCount++;
        continue;
      }

      const newUser: User = {
        ...mockCurrentUser,
        id: `usr_csv_${Date.now()}_${i}`,
        name: name || email.split('@')[0],
        email: cleanEmail,
        passwordHash: 'Welcome@123',
        role: 'student',
        status: 'active',
        accountStatus: 'active',
        college: college || 'Stanford Institute of Technology',
        branch: branch || 'Computer Science',
        year: year || '1st Year',
        organizationId: current?.organizationId || 'org_tyc_core',
        organizationName: current?.organizationName || 'Traya Yukti Academic Partner',
        department: current?.department || 'Computer Science & AI',
        enrolledCourseIds: [...assignedCourseIds],
        joinedDate: 'Just now',
        streakDays: 1,
        skills: [],
        auditInfo: {
          createdBy: current?.name || 'CSV Batch Pipeline',
          ipAddress: '127.0.0.1'
        }
      };

      existingUsers.push(newUser);
      importedUsers.push(newUser);
    }

    setStored('users', existingUsers);

    // Update Cohort
    const cohorts = await this.getCohorts();
    const cohortIdx = cohorts.findIndex((c) => c.id === cohortId);
    if (cohortIdx !== -1) {
      cohorts[cohortIdx].studentIds = [
        ...cohorts[cohortIdx].studentIds,
        ...importedUsers.map((u) => u.id)
      ];
      setStored('cohorts', cohorts);
    }

    auditService.log(
      current,
      'student_csv_import',
      `Batch Import: ${importedUsers.length} Students`,
      `Provisioned ${importedUsers.length} student accounts into Cohort ID ${cohortId}. (${failedCount} skipped/duplicates).`,
      { metadata: { importedCount: importedUsers.length, failedCount, cohortId } }
    );

    return { importedCount: importedUsers.length, failedCount, importedUsers };
  }
};

// ==================== RESOURCE ACCESS OVERRIDE SERVICE ====================
export const resourceOverrideService = {
  async getOverrides(instructorId?: string, studentId?: string): Promise<ResourceAccessOverride[]> {
    await delay(80);
    const all = getStored('resourceOverrides', mockResourceOverrides);
    if (studentId) return all.filter((o: ResourceAccessOverride) => o.studentId === studentId);
    if (instructorId) return all.filter((o: ResourceAccessOverride) => o.instructorId === instructorId);
    return all;
  },

  async grantOverride(
    overrideData: Partial<ResourceAccessOverride>,
    callerUser?: User
  ): Promise<ResourceAccessOverride> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'resources:override_access')) {
      throw new Error('403 Forbidden: Insufficient clearance to grant temporary resource access.');
    }

    const all = await this.getOverrides();
    const newOverride: ResourceAccessOverride = {
      id: `res_ovr_${Date.now()}`,
      studentId: overrideData.studentId || 'usr_8829',
      studentName: overrideData.studentName || 'Alex Rivera',
      studentEmail: overrideData.studentEmail || 'alex.rivera@tyc.dev',
      instructorId: current?.id || 'usr_inst_1',
      instructorName: current?.name || 'Dr. Sarah Chen',
      resourceId: overrideData.resourceId || 'datalab_gpu_cluster_a100',
      resourceTitle: overrideData.resourceTitle || 'Cloud DataLab: NVIDIA A100 Instance',
      resourceType: overrideData.resourceType || 'datalab',
      reason: overrideData.reason || 'Capstone Machine Learning experiment.',
      startDate: overrideData.startDate || new Date().toISOString().split('T')[0],
      expiryDate: overrideData.expiryDate || '2026-09-30',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    all.unshift(newOverride);
    setStored('resourceOverrides', all);

    auditService.log(
      current,
      'resource_override_grant',
      `Resource Override: ${newOverride.resourceTitle} for ${newOverride.studentName}`,
      `Temporary access granted until ${newOverride.expiryDate}. Reason: "${newOverride.reason}"`,
      { targetId: newOverride.id, metadata: { expiryDate: newOverride.expiryDate, reason: newOverride.reason } }
    );

    return newOverride;
  },

  async revokeOverride(overrideId: string, callerUser?: User): Promise<boolean> {
    await delay(150);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'resources:override_access')) {
      throw new Error('403 Forbidden: Insufficient clearance to revoke resource access.');
    }

    const all = await this.getOverrides();
    const idx = all.findIndex((o: ResourceAccessOverride) => o.id === overrideId);
    if (idx !== -1) {
      all[idx].status = 'revoked';
      setStored('resourceOverrides', all);

      auditService.log(
        current,
        'resource_override_revoke',
        `Resource Override: ${all[idx].resourceTitle} (${all[idx].studentName})`,
        'Early revocation of temporary resource access override executed by faculty.',
        { targetId: overrideId }
      );
    }
    return true;
  }
};

// ==================== FINANCIALS & REFUND SERVICE ====================
export const financeService = {
  async getRefundRequests(department?: string, callerUser?: User): Promise<RefundRequest[]> {
    await delay(80);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'finance:approve_refunds') && !rbacService.hasPermission(current, 'finance:view_global')) {
      throw new Error('403 Forbidden: Insufficient clearance to access financial records.');
    }
    const all = getStored('refundRequests', mockRefundRequests);
    return all;
  },

  async approveRefund(refundId: string, notes: string, callerUser?: User): Promise<RefundRequest> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'finance:approve_refunds')) {
      throw new Error('403 Forbidden: Clearance required to approve refund payouts.');
    }

    const requests = await this.getRefundRequests();
    const req = requests.find((r: RefundRequest) => r.id === refundId);
    if (!req) throw new Error('Refund request not found');

    req.status = 'approved';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = current?.name || 'Administrator';
    req.reviewNotes = notes;
    setStored('refundRequests', requests);

    auditService.log(
      current,
      'refund_approve',
      `Refund ID: ${refundId} (${req.studentName} - ${req.courseTitle})`,
      `Approved ${req.currency} ${req.amount.toLocaleString()} refund payout. Notes: "${notes}"`,
      { targetId: refundId, metadata: { amount: req.amount, currency: req.currency } }
    );

    return req;
  },

  async rejectRefund(refundId: string, notes: string, callerUser?: User): Promise<RefundRequest> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'finance:approve_refunds')) {
      throw new Error('403 Forbidden: Clearance required to evaluate refunds.');
    }

    const requests = await this.getRefundRequests();
    const req = requests.find((r: RefundRequest) => r.id === refundId);
    if (!req) throw new Error('Refund request not found');

    req.status = 'rejected';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = current?.name || 'Administrator';
    req.reviewNotes = notes;
    setStored('refundRequests', requests);

    auditService.log(
      current,
      'refund_reject',
      `Refund ID: ${refundId} (${req.studentName} - ${req.courseTitle})`,
      `Refund rejected. Reason: "${notes}"`,
      { targetId: refundId, metadata: { notes } }
    );

    return req;
  },

  async getGlobalFinanceOverview(callerUser?: User) {
    await delay(100);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'finance:view_global')) {
      throw new Error('403 Forbidden: Level 1 Super Admin clearance required for global finance telemetry.');
    }

    return {
      totalGMV: 48520000,
      platformFeeEarned: 7278000,
      activeSubscriptions: 1240,
      monthlyRecurringRevenue: 3840000,
      pendingPayouts: 1850000,
      currency: 'INR',
      supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
      stripeConnected: true,
      lastWebhookSync: '3 mins ago'
    };
  },

  async updateStripeConfig(config: any, callerUser?: User) {
    await delay(250);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'finance:manage_stripe')) {
      throw new Error('403 Forbidden: Only Super Admin can configure Stripe infrastructure.');
    }

    auditService.log(
      current,
      'system_config_change',
      'Global Stripe Gateway & Multi-Currency',
      'Updated payment webhook keys, automated INR settlement, and merchant account routing.',
      { scope: 'FULL' }
    );

    return { success: true, message: 'Stripe production credentials updated.' };
  }
};

// ==================== TENANT & ORGANIZATION SERVICE ====================
export const tenantService = {
  async getOrganizations(): Promise<Organization[]> {
    await delay(80);
    return getStored('organizations', mockOrganizations);
  },

  async createOrganization(orgData: Partial<Organization>, callerUser?: User): Promise<Organization> {
    await delay(200);
    const current = callerUser || (await authService.getCurrentUser());
    if (current && !rbacService.hasPermission(current, 'platform:manage_tenants')) {
      throw new Error('403 Forbidden: Super Admin clearance required for multi-tenant provisioning.');
    }

    const orgs = await this.getOrganizations();
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: orgData.name || 'New Enterprise Tenant',
      slug: orgData.slug || 'enterprise-tenant',
      tier: orgData.tier || 'Enterprise',
      status: 'active',
      adminIds: orgData.adminIds || [],
      departments: orgData.departments || [],
      createdAt: new Date().toISOString(),
      maxStudents: orgData.maxStudents || 1000,
      studentCount: 0
    };

    orgs.push(newOrg);
    setStored('organizations', orgs);

    auditService.log(
      current,
      'system_config_change',
      `Tenant: ${newOrg.name}`,
      `Provisioned enterprise tenant partition with max student capacity ${newOrg.maxStudents}.`,
      { targetId: newOrg.id, scope: 'FULL' }
    );

    return newOrg;
  }
};

// ==================== WORKSHOPS & HACKATHONS ====================
export const workshopService = {
  async getWorkshops(): Promise<Workshop[]> {
    await delay(80);
    return getStored('workshops', mockWorkshops);
  },

  async register(workshopId: string): Promise<boolean> {
    await delay(200);
    const workshops = await this.getWorkshops();
    const ws = workshops.find(w => w.id === workshopId);
    if (ws) {
      ws.isRegistered = true;
      ws.registeredCount += 1;
      setStored('workshops', workshops);
    }
    return true;
  }
};

export const hackathonService = {
  async getHackathons(): Promise<Hackathon[]> {
    await delay(80);
    return getStored('hackathons', mockHackathons);
  },

  async register(hackathonId: string): Promise<boolean> {
    await delay(200);
    const hacks = await this.getHackathons();
    const h = hacks.find(x => x.id === hackathonId);
    if (h) {
      h.isRegistered = true;
      h.participantsCount += 1;
      setStored('hackathons', hacks);
    }
    return true;
  }
};

// ==================== COMMUNITY SERVICE ====================
export const communityService = {
  async getPosts(): Promise<CommunityPost[]> {
    await delay(80);
    return getStored('communityPosts', mockCommunityPosts);
  },

  async createPost(title: string, content: string, category: CommunityPost['category'], tags: string[]): Promise<CommunityPost> {
    await delay(250);
    const user = await authService.getCurrentUser();
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      title,
      content,
      category,
      tags,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: `${user.role} • ${user.careerGoal}`
      },
      upvotes: 1,
      commentsCount: 0,
      createdAt: 'Just now',
      hasUpvoted: true,
      comments: []
    };
    const posts = await this.getPosts();
    posts.unshift(newPost);
    setStored('communityPosts', posts);
    return newPost;
  },

  async toggleUpvote(postId: string): Promise<number> {
    await delay(50);
    const posts = await this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (post.hasUpvoted) {
        post.upvotes -= 1;
        post.hasUpvoted = false;
      } else {
        post.upvotes += 1;
        post.hasUpvoted = true;
      }
      setStored('communityPosts', posts);
      return post.upvotes;
    }
    return 0;
  }
};

// ==================== NOTIFICATIONS ====================
export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await delay(50);
    return getStored('notifications', mockNotifications);
  },

  async markAsRead(id: string): Promise<void> {
    await delay(30);
    const notifs = await this.getNotifications();
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      setStored('notifications', notifs);
    }
  },

  async markAllAsRead(): Promise<void> {
    await delay(50);
    const notifs = await this.getNotifications();
    notifs.forEach(n => { n.read = true; });
    setStored('notifications', notifs);
  }
};

// ==================== AI TUTOR SERVICE (OPENROUTER NEMOTRON-3) ====================
import { aiChatService, StreamCallbacks } from './aiService';

export const aiTutorService = {
  async askTutor(
    query: string,
    mode: AITutorMode = 'Explain',
    context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string },
    chatHistory?: AIMessage[]
  ): Promise<AIMessage> {
    return await aiChatService.sendMessage(query, mode, chatHistory || [], context);
  },
  async streamTutor(
    query: string,
    mode: AITutorMode = 'Explain',
    context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string },
    chatHistory?: AIMessage[],
    callbacks?: StreamCallbacks,
    abortSignal?: AbortSignal
  ): Promise<string> {
    return await aiChatService.streamMessage(query, mode, chatHistory || [], context, callbacks, abortSignal);
  }
};

// ==================== ADMIN STATS SERVICE ====================
export const adminService = {
  async getStats() {
    await delay(80);
    return mockAdminStats;
  },

  async updateCourseStatus(courseId: string, status: Course['status']): Promise<Course[]> {
    await delay(200);
    const courses = await courseService.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.status = status;
      setStored('courses', courses);
    }
    return courses;
  }
};


