import {
  User,
  Course,
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
  UserRole
} from '../types';
import {
  mockCurrentUser,
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
  mockAdminStats
} from './mockData';

// Helper to simulate realistic network delay
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

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

// ==================== AUTH & USER SERVICE ====================
export const authService = {
  async getCurrentUser(): Promise<User> {
    await delay();
    return getStored('currentUser', mockCurrentUser);
  },

  async login(email: string, _password?: string, role: UserRole = 'student'): Promise<User> {
    await delay(300);
    const user = {
      ...mockCurrentUser,
      email,
      role
    };
    setStored('currentUser', user);
    return user;
  },

  async register(name: string, email: string, _password?: string): Promise<User> {
    await delay(300);
    const user: User = {
      ...mockCurrentUser,
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'student',
      enrolledCourseIds: [],
      completedLessonIds: [],
      certificatesEarned: 0,
      streakDays: 1,
      skills: []
    };
    setStored('currentUser', user);
    return user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay();
    const current = await this.getCurrentUser();
    const updated = { ...current, ...updates };
    setStored('currentUser', updated);
    return updated;
  },

  async switchRole(role: UserRole): Promise<User> {
    await delay(100);
    const current = await this.getCurrentUser();
    const updated = { ...current, role };
    setStored('currentUser', updated);
    return updated;
  },

  async completeOnboarding(data: StudentOnboardingData): Promise<User> {
    await delay(400);
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
        level: 40 + Math.floor(Math.random() * 30),
        category: 'Frontend',
        verified: false
      }))
    };
    setStored('currentUser', updated);
    return updated;
  },

  async logout(): Promise<void> {
    await delay();
    localStorage.removeItem(STORAGE_PREFIX + 'currentUser');
  }
};

// ==================== COURSE SERVICE ====================
export const courseService = {
  async getCourses(): Promise<Course[]> {
    await delay();
    return getStored('courses', mockCourses);
  },

  async getCourseById(id: string): Promise<Course | null> {
    await delay();
    const courses = await this.getCourses();
    return courses.find((c) => c.id === id || c.slug === id) || null;
  },

  async enroll(courseId: string): Promise<User> {
    await delay(200);
    const user = await authService.getCurrentUser();
    if (!user.enrolledCourseIds.includes(courseId)) {
      user.enrolledCourseIds.push(courseId);
      setStored('currentUser', user);
    }
    return user;
  },

  async toggleLessonComplete(courseId: string, lessonId: string): Promise<{ completed: boolean; completedLessonIds: string[] }> {
    await delay(100);
    const user = await authService.getCurrentUser();
    const index = user.completedLessonIds.indexOf(lessonId);
    let completed = false;
    if (index > -1) {
      user.completedLessonIds.splice(index, 1);
      completed = false;
    } else {
      user.completedLessonIds.push(lessonId);
      completed = true;
    }
    setStored('currentUser', user);
    return { completed, completedLessonIds: user.completedLessonIds };
  }
};

// ==================== LEARNING PATHS SERVICE ====================
export const learningPathService = {
  async getPaths(): Promise<LearningPath[]> {
    await delay();
    return getStored('learningPaths', mockLearningPaths);
  },

  async getPathById(id: string): Promise<LearningPath | null> {
    await delay();
    const paths = await this.getPaths();
    return paths.find((p) => p.id === id || p.slug === id) || null;
  }
};

// ==================== PRACTICE SERVICE ====================
export const practiceService = {
  async getProblems(): Promise<PracticeProblem[]> {
    await delay();
    return getStored('practiceProblems', mockPracticeProblems);
  },

  async getProblemById(id: string): Promise<PracticeProblem | null> {
    await delay();
    const problems = await this.getProblems();
    return problems.find((p) => p.id === id) || null;
  },

  async submitSolution(problemId: string, _solutionCode: string): Promise<{ success: boolean; message: string; output: string }> {
    await delay(600);
    return {
      success: true,
      message: 'All 3 test cases passed! Runtime: 42ms (faster than 94.2% of submissions).',
      output: 'Test Case 1: PASSED [0, 1]\nTest Case 2: PASSED [1, 2]\nTest Case 3: PASSED [0, 1]'
    };
  }
};

// ==================== PROJECTS SERVICE ====================
export const projectService = {
  async getProjects(): Promise<Project[]> {
    await delay();
    return getStored('projects', mockProjects);
  },

  async getProjectById(id: string): Promise<Project | null> {
    await delay();
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id || p.slug === id) || null;
  },

  async submitProject(projectId: string, submission: Partial<ProjectSubmission>): Promise<ProjectSubmission> {
    await delay(500);
    const sub: ProjectSubmission = {
      id: `sub_${Date.now()}`,
      projectId,
      userId: mockCurrentUser.id,
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

    return sub;
  }
};

// ==================== CERTIFICATES SERVICE ====================
export const certificateService = {
  async getCertificates(): Promise<Certificate[]> {
    await delay();
    return getStored('certificates', mockCertificates);
  },

  async verifyCertificate(certId: string): Promise<Certificate | null> {
    await delay(300);
    const certs = await this.getCertificates();
    return certs.find((c) => c.certificateId.toLowerCase() === certId.trim().toLowerCase()) || null;
  }
};

// ==================== CAREER SERVICE ====================
export const careerService = {
  async getJobs(): Promise<JobOpportunity[]> {
    await delay();
    return getStored('jobs', mockJobOpportunities);
  },

  async applyJob(jobId: string): Promise<{ success: boolean; message: string }> {
    await delay(400);
    const jobs = await this.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      job.applied = true;
      setStored('jobs', jobs);
    }
    return { success: true, message: 'Application submitted successfully with your TYC Verified Profile!' };
  }
};

// ==================== WORKSHOPS & HACKATHONS ====================
export const workshopService = {
  async getWorkshops(): Promise<Workshop[]> {
    await delay();
    return getStored('workshops', mockWorkshops);
  },

  async register(workshopId: string): Promise<boolean> {
    await delay(300);
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
    await delay();
    return getStored('hackathons', mockHackathons);
  },

  async register(hackathonId: string): Promise<boolean> {
    await delay(300);
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
    await delay();
    return getStored('communityPosts', mockCommunityPosts);
  },

  async createPost(title: string, content: string, category: CommunityPost['category'], tags: string[]): Promise<CommunityPost> {
    await delay(300);
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
    await delay(100);
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
    await delay();
    return getStored('notifications', mockNotifications);
  },

  async markAsRead(id: string): Promise<void> {
    await delay(50);
    const notifs = await this.getNotifications();
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      setStored('notifications', notifs);
    }
  },

  async markAllAsRead(): Promise<void> {
    await delay(100);
    const notifs = await this.getNotifications();
    notifs.forEach(n => { n.read = true; });
    setStored('notifications', notifs);
  }
};

// ==================== AI TUTOR SERVICE ====================
export const aiTutorService = {
  async askTutor(
    query: string,
    mode: AITutorMode = 'Explain',
    context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string }
  ): Promise<AIMessage> {
    await delay(700);

    let content = '';
    let codeSnippet = '';
    let suggestedFollowUps: string[] = [];

    const lower = query.toLowerCase();

    if (mode === 'Debug' || lower.includes('debug') || lower.includes('error')) {
      content = `Here is the diagnosis for your issue:\n\n1. **Root Cause**: The async state updater is invoking before the promise settles, causing stale closure references.\n2. **Solution**: Use the functional updater form \`setState(prev => ...)\` and ensure your subscription cleanup is properly returned in the useEffect body.`;
      codeSnippet = `// Recommended Fix:\nuseEffect(() => {\n  let isMounted = true;\n  async function fetchData() {\n    const res = await api.getTelemetry();\n    if (isMounted) {\n      setData(prev => ({ ...prev, ...res }));\n    }\n  }\n  fetchData();\n  return () => { isMounted = false; };\n}, [sensorId]);`;
      suggestedFollowUps = ['Explain race condition prevention in React 19', 'Show test case for this component', 'How does AbortController compare?'];
    } else if (mode === 'Socratic') {
      content = `Great question! Before I provide the formula directly, think about this:\n\nIf you have $N$ items and want to look up an element in constant time $O(1)$, what underlying data structure uses hash calculations to map keys to memory addresses?\n\nHow would you store items you have already visited?`;
      suggestedFollowUps = ['Is it a Hash Map (Dictionary)?', 'What happens during a hash collision?', 'Walk me through the two-pointer alternative'];
    } else if (mode === 'Interview') {
      content = `**Mock Interviewer Question:**\n\nSuppose you are designing a high-throughput notifications service in TYC that must deliver 500,000 push messages per second.\n\nHow would you partition the workload between Redis pub/sub, Apache Kafka, and worker nodes? What trade-offs exist between at-least-once vs exactly-once delivery?`;
      suggestedFollowUps = ['Structure my answer using the STAR method', 'Discuss Kafka topic partitioning', 'How do we handle dead-letter queues?'];
    } else if (mode === 'Project Mentor') {
      content = `For your **${context?.courseTitle || 'Current Project'}** milestone:\n\nI recommend structuring your application into 3 clean layers:\n1. **Presentation Layer**: Pure UI components with typed props.\n2. **State & Logic Hooks**: Custom hooks encapsulating API calls and optimistic updates.\n3. **Network Gateway**: Centralized Axios/Fetch client with interceptors for auth tokens and error telemetry.`;
      suggestedFollowUps = ['Generate folder structure for this architecture', 'Show example of an optimistic update hook', 'What testing tools are recommended?'];
    } else {
      content = `In **${context?.lessonTitle || 'Modern Web Engineering'}**, this concept revolves around deterministic data flows.\n\nWhen state is lifted to the appropriate boundary, components become predictable, easier to test, and prevent cascading re-renders across the DOM tree.`;
      codeSnippet = `// Example Pattern:\nconst useUserData = (userId: string) => {\n  return useQuery({\n    queryKey: ['user', userId],\n    queryFn: () => fetchUser(userId),\n    staleTime: 5 * 60 * 1000, // 5 minutes fresh\n  });\n};`;
      suggestedFollowUps = ['Give me a realistic real-world example', 'Quiz me on this concept', 'Summarize key takeaways for notes'];
    }

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      content,
      codeSnippet,
      mode,
      timestamp: 'Just now',
      suggestedFollowUps
    };
  }
};

// ==================== ADMIN SERVICE ====================
export const adminService = {
  async getStats() {
    await delay();
    return mockAdminStats;
  },

  async updateCourseStatus(courseId: string, status: Course['status']): Promise<Course[]> {
    await delay(300);
    const courses = await courseService.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.status = status;
      setStored('courses', courses);
    }
    return courses;
  }
};
