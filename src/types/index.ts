// Core Types for Traya Yukti Core (TYC) LMS

export type UserRole = 'student' | 'instructor' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  careerGoal: string;
  educationLevel?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  streakDays: number;
  longestStreak: number;
  weeklyHoursSpent: number;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  completedLessonIds: string[];
  certificatesEarned: number;
  skills: SkillItem[];
  joinedDate: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0 to 100 percentage
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'Database' | 'DevOps' | 'Core CS' | 'Soft Skills';
  verified: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  durationHours: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  thumbnail: string;
  instructor: Instructor;
  price: number; // 0 = free
  isFeatured?: boolean;
  hasCertificate: boolean;
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
  projectsCount: number;
  modulesCount: number;
  lessonsCount: number;
  modules: CourseModule[];
  whyThisCourse?: string;
  status?: 'published' | 'draft' | 'archived';
  lastUpdated: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  durationMinutes: number;
  type: 'video' | 'article' | 'quiz' | 'coding' | 'project';
  videoUrl?: string;
  contentMarkdown?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  resources?: LessonResource[];
  quiz?: Quiz;
  codingChallengeId?: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'github' | 'zip' | 'link';
  url: string;
  size?: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  role: string;
  description: string;
  level: string;
  durationMonths: number;
  coursesCount: number;
  projectsCount: number;
  skills: string[];
  icon: string;
  featured: boolean;
  milestones: PathMilestone[];
}

export interface PathMilestone {
  id: string;
  title: string;
  description: string;
  order: number;
  skills: string[];
  courseIds: string[];
  status: 'completed' | 'in_progress' | 'upcoming';
  isCapstone?: boolean;
}

export type PracticeCategory = 
  | 'MCQs' 
  | 'Coding' 
  | 'Debugging' 
  | 'Output Prediction' 
  | 'SQL' 
  | 'Technical Questions' 
  | 'Case Studies' 
  | 'Scenario Questions';

export interface PracticeProblem {
  id: string;
  title: string;
  category: PracticeCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  topic: string;
  skills: string[];
  description: string;
  codeStarter?: string;
  language?: 'python' | 'javascript' | 'java' | 'cpp' | 'sql' | 'html';
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  testCases?: TestCase[];
  timeLimitSec?: number;
  attemptsCount: number;
  accuracyRate: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Capstone';
  estimatedHours: number;
  skills: string[];
  thumbnail: string;
  problemStatement: string;
  objective: string;
  requirements: string[];
  expectedOutput: string;
  milestones: ProjectMilestone[];
  starterKitUrl?: string;
  status: 'available' | 'in_progress' | 'submitted' | 'approved';
  submission?: ProjectSubmission;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  order: number;
  completed?: boolean;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  userId: string;
  githubUrl: string;
  liveUrl?: string;
  zipFileName?: string;
  demoVideoUrl?: string;
  notes?: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'changes_requested';
  score?: number;
  feedback?: string;
  reviewerName?: string;
}

export interface Certificate {
  id: string;
  certificateId: string; // e.g. "TYC-2026-REACT-8849"
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  instructorName: string;
  issuedDate: string;
  expiryDate?: string;
  skills: string[];
  grade: string;
  verificationUrl: string;
  credentialScore: number;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Remote';
  salaryOrStipend: string;
  skills: string[];
  experienceRequired: string;
  deadline: string;
  postedDate: string;
  description: string;
  requirements: string[];
  eligibility: string;
  applied?: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  date: string;
  time: string;
  durationMinutes: number;
  fee: number; // 0 = Free
  capacity: number;
  registeredCount: number;
  description: string;
  skills: string[];
  meetingLink?: string;
  resourcesCount: number;
  isRegistered?: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  banner: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  eligibility: string;
  participantsCount: number;
  teamsCount: number;
  description: string;
  problemStatements: { id: string; title: string; track: string; description: string }[];
  isRegistered?: boolean;
  status: 'Upcoming' | 'Live' | 'Evaluation' | 'Ended';
  leaderboard?: { rank: number; teamName: string; projectTitle: string; score: number }[];
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    badge?: string;
  };
  category: 'Questions' | 'Showcases' | 'Study Groups' | 'Announcements' | 'General';
  tags: string[];
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  hasUpvoted?: boolean;
  pinned?: boolean;
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'course' | 'assignment' | 'quiz' | 'certificate' | 'workshop' | 'hackathon' | 'career' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type AITutorMode = 
  | 'Explain' 
  | 'Socratic' 
  | 'Practice' 
  | 'Debug' 
  | 'Revision' 
  | 'Interview' 
  | 'Project Mentor';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  mode?: AITutorMode;
  suggestedFollowUps?: string[];
}

export interface StudentOnboardingData {
  name: string;
  educationLevel: string;
  careerGoal: string;
  experienceLevel: string;
  currentSkills: string[];
  areasOfInterest: string[];
  weeklyHours: number;
}
