import {
  User,
  Course,
  LearningPath,
  PracticeProblem,
  Project,
  Certificate,
  JobOpportunity,
  Workshop,
  Hackathon,
  CommunityPost,
  NotificationItem,
} from '../types';

export const mockCurrentUser: User = {
  id: 'usr_8829',
  name: 'Alex Rivera',
  email: 'alex.rivera@tyc.dev',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  careerGoal: 'Full Stack AI Developer',
  educationLevel: 'Bachelor of Computer Science (3rd Year)',
  experienceLevel: 'Intermediate',
  bio: 'Aspiring Full Stack Engineer passionate about React, TypeScript, and integrating Large Language Models into high-performance web products.',
  githubUrl: 'https://github.com/alexrivera-tyc',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-tech',
  portfolioUrl: 'https://alexrivera.dev',
  streakDays: 14,
  longestStreak: 28,
  weeklyHoursSpent: 18.5,
  enrolledCourseIds: ['crs_1', 'crs_2', 'crs_4'],
  completedCourseIds: ['crs_5'],
  completedLessonIds: ['les_1_1', 'les_1_2', 'les_1_3', 'les_2_1', 'les_2_2'],
  certificatesEarned: 2,
  joinedDate: 'Jan 2026',
  skills: [
    { id: 'sk_1', name: 'Python & FastAPI', level: 84, category: 'Backend', verified: true },
    { id: 'sk_2', name: 'React & TypeScript', level: 78, category: 'Frontend', verified: true },
    { id: 'sk_3', name: 'PostgreSQL & SQL', level: 72, category: 'Database', verified: true },
    { id: 'sk_4', name: 'Prompt Eng & LLM APIs', level: 65, category: 'AI/ML', verified: true },
    { id: 'sk_5', name: 'Git & CI/CD Pipelines', level: 80, category: 'DevOps', verified: true },
    { id: 'sk_6', name: 'Data Structures & Algo', level: 70, category: 'Core CS', verified: false },
  ],
};

export const mockCourses: Course[] = [
  {
    id: 'crs_1',
    slug: 'fullstack-react-typescript-mastery',
    title: 'Full Stack React 19 & TypeScript Architecture',
    subtitle: 'Build scalable modern web applications from atomic components to server-side orchestration.',
    description: 'A comprehensive, project-driven course covering React 19 server components, TypeScript strict typing, state management with Zustand, TanStack Query, accessible Tailwind design systems, and production deployment patterns.',
    category: 'Frontend & Full Stack',
    difficulty: 'Intermediate',
    durationHours: 24,
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 6890,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: true,
    hasCertificate: true,
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js App Router', 'Zustand', 'Performance Optimization'],
    prerequisites: ['Modern JavaScript (ES6+)', 'HTML & CSS basics', 'Basic Git familiarity'],
    learningObjectives: [
      'Architect robust React 19 applications with strict TypeScript typing',
      'Implement enterprise state management and server-state caching',
      'Build responsive, accessible (WCAG 2.1 AA) design systems from scratch',
      'Deploy production-ready applications with automated CI/CD and telemetry'
    ],
    projectsCount: 3,
    modulesCount: 4,
    lessonsCount: 18,
    whyThisCourse: 'Essential foundational stack for high-growth tech companies building responsive, data-heavy web tools.',
    lastUpdated: 'Feb 2026',
    instructor: {
      id: 'inst_1',
      name: 'Dr. Sarah Chen',
      role: 'Principal Frontend Architect',
      company: 'Ex-Vercel / Core Team',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Author of 3 best-selling books on web architecture with 12+ years building enterprise web apps.',
      rating: 4.95,
      studentsCount: 34000,
      coursesCount: 6,
    },
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Modern TypeScript & Component Foundations',
        order: 1,
        durationMinutes: 210,
        lessons: [
          {
            id: 'les_1_1',
            moduleId: 'mod_1',
            courseId: 'crs_1',
            title: '1.1 Strict TypeScript Generics & Component Props',
            order: 1,
            durationMinutes: 22,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            contentMarkdown: `## TypeScript Generics in React Components\n\nGenerics allow us to create flexible, reusable components while maintaining strict compile-time safety.\n\n\`\`\`typescript\ninterface SelectProps<T> {\n  items: T[];\n  value: T;\n  onSelect: (item: T) => void;\n  renderLabel: (item: T) => string;\n}\n\nexport function GenericSelect<T>({ items, value, onSelect, renderLabel }: SelectProps<T>) {\n  return (\n    <select onChange={(e) => onSelect(items[Number(e.target.value)])}>\n      {items.map((item, idx) => (\n        <option key={idx} value={idx}>{renderLabel(item)}</option>\n      ))}\n    </select>\n  );\n}\n\`\`\``,
            isCompleted: true,
            resources: [
              { id: 'res_1', title: 'TypeScript Component Cheatsheet (PDF)', type: 'pdf', url: '#', size: '1.2 MB' },
              { id: 'res_2', title: 'Starter GitHub Repository', type: 'github', url: 'https://github.com/tyc/react-ts-starter' }
            ]
          },
          {
            id: 'les_1_2',
            moduleId: 'mod_1',
            courseId: 'crs_1',
            title: '1.2 React 19 Hooks: useActionState & useOptimistic',
            order: 2,
            durationMinutes: 28,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            contentMarkdown: 'Mastering the new state transitions and asynchronous action hooks in React 19.',
            isCompleted: true,
          },
          {
            id: 'les_1_3',
            moduleId: 'mod_1',
            courseId: 'crs_1',
            title: '1.3 Assessment: React TypeScript Knowledge Check',
            order: 3,
            durationMinutes: 15,
            type: 'quiz',
            isCompleted: true,
            quiz: {
              id: 'qz_1',
              title: 'Module 1 Assessment: TypeScript & Hooks',
              passingScore: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'Which utility type constructs a type with all properties of T set to optional?',
                  options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Record<K, T>'],
                  correctOptionIndex: 1,
                  explanation: 'Partial<T> makes all properties in T optional, which is particularly useful for component optional props or update mutations.'
                },
                {
                  id: 'q2',
                  question: 'What is the primary benefit of useOptimistic in React 19?',
                  options: [
                    'To automatically bundle CSS files',
                    'To display immediate UI updates before a server mutation completes',
                    'To replace the useEffect dependency array',
                    'To prevent memoization leaks'
                  ],
                  correctOptionIndex: 1,
                  explanation: 'useOptimistic provides a way to show expected state changes instantly while async network operations settle in the background.'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'Module 2: Advanced State & Network Architecture',
        order: 2,
        durationMinutes: 320,
        lessons: [
          {
            id: 'les_1_4',
            moduleId: 'mod_2',
            courseId: 'crs_1',
            title: '2.1 Server State with TanStack Query v5',
            order: 1,
            durationMinutes: 35,
            type: 'video',
            isCompleted: false,
          },
          {
            id: 'les_1_5',
            moduleId: 'mod_2',
            courseId: 'crs_1',
            title: '2.2 Client State Patterns with Zustand & Immutability',
            order: 2,
            durationMinutes: 30,
            type: 'video',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'mod_3',
        title: 'Module 3: Accessible Design Systems with Tailwind',
        order: 3,
        durationMinutes: 240,
        lessons: [
          {
            id: 'les_1_6',
            moduleId: 'mod_3',
            courseId: 'crs_1',
            title: '3.1 Building Reusable Radix Primitives & Tokens',
            order: 1,
            durationMinutes: 40,
            type: 'video',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'mod_4',
        title: 'Module 4: Production Deployment & Real-world Capstone',
        order: 4,
        durationMinutes: 380,
        lessons: [
          {
            id: 'les_1_7',
            moduleId: 'mod_4',
            courseId: 'crs_1',
            title: '4.1 Capstone Project: SaaS Analytics Dashboard',
            order: 1,
            durationMinutes: 60,
            type: 'project',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'crs_2',
    slug: 'generative-ai-and-llm-application-engineering',
    title: 'Generative AI & LLM Application Engineering',
    subtitle: 'From prompt engineering and RAG pipelines to autonomous multi-agent systems using Python & LangChain.',
    description: 'Learn to build production-grade AI applications. Master embeddings, vector databases (Pinecone/Chroma), retrieval augmented generation (RAG), tool-calling AI agents, and local LLM fine-tuning.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    durationHours: 32,
    rating: 4.96,
    reviewsCount: 2180,
    studentsCount: 8940,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: true,
    hasCertificate: true,
    skills: ['LangChain', 'LlamaIndex', 'Vector Databases', 'OpenAI APIs', 'Prompt Optimization', 'RAG Pipelines'],
    prerequisites: ['Python intermediate skills', 'Basic REST API concepts'],
    learningObjectives: [
      'Implement context-aware RAG pipelines over enterprise document stores',
      'Build autonomous agents with tool-calling capabilities and error recovery',
      'Optimize token consumption, latency, and streaming responses',
      'Evaluate model hallucinations and output reliability programmatically'
    ],
    projectsCount: 4,
    modulesCount: 5,
    lessonsCount: 22,
    whyThisCourse: 'The highest-demand skillset in 2026. Transition from consuming APIs to engineering real AI systems.',
    lastUpdated: 'Jan 2026',
    instructor: {
      id: 'inst_2',
      name: 'Elena Rostova',
      role: 'Head of AI Research',
      company: 'Neural Labs',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      bio: 'Pioneering RAG architectures and multi-agent coordination. Keynote speaker at Global AI Summit.',
      rating: 4.98,
      studentsCount: 48000,
      coursesCount: 4,
    },
    modules: [
      {
        id: 'mod_2_1',
        title: 'Module 1: Vector Embeddings & Semantic Search',
        order: 1,
        durationMinutes: 240,
        lessons: [
          {
            id: 'les_2_1',
            moduleId: 'mod_2_1',
            courseId: 'crs_2',
            title: '1.1 Dense Embeddings & Cosine Similarity Mathematics',
            order: 1,
            durationMinutes: 25,
            type: 'video',
            isCompleted: true,
          },
          {
            id: 'les_2_2',
            moduleId: 'mod_2_1',
            courseId: 'crs_2',
            title: '1.2 Chunking Strategies & Vector Indexing',
            order: 2,
            durationMinutes: 30,
            type: 'coding',
            isCompleted: true,
          }
        ]
      }
    ]
  },
  {
    id: 'crs_3',
    slug: 'python-backend-fastapi-mastery',
    title: 'Python Backend Engineering with FastAPI & PostgreSQL',
    subtitle: 'Build high-throughput asynchronous REST & GraphQL APIs with Pydantic v2, SQLAlchemy 2.0, and Docker.',
    description: 'Learn modern asynchronous Python backend development. Covers FastAPI, async PostgreSQL, Alembic database migrations, JWT authentication, Redis caching, Celery background tasks, and Docker microservices.',
    category: 'Backend & Systems',
    difficulty: 'Beginner',
    durationHours: 20,
    rating: 4.88,
    reviewsCount: 940,
    studentsCount: 4520,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: true,
    hasCertificate: true,
    skills: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'Redis'],
    prerequisites: ['Python basics (variables, loops, functions)'],
    learningObjectives: [
      'Build async APIs capable of handling 10,000+ requests per second',
      'Structure secure multi-tenant relational schemas with PostgreSQL',
      'Implement OAuth2, JWT tokens, and role-based access control (RBAC)',
      'Containerize backend services with Docker Compose for production'
    ],
    projectsCount: 2,
    modulesCount: 4,
    lessonsCount: 16,
    whyThisCourse: 'FastAPI has become the standard for modern high-performance microservices and AI model serving.',
    lastUpdated: 'Jan 2026',
    instructor: {
      id: 'inst_3',
      name: 'Marcus Vance',
      role: 'Staff Infrastructure Engineer',
      company: 'Scale Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Specialist in distributed backend systems and high-load database sharding.',
      rating: 4.91,
      studentsCount: 22000,
      coursesCount: 5,
    },
    modules: []
  },
  {
    id: 'crs_4',
    slug: 'data-structures-and-algorithms-for-interviews',
    title: 'Data Structures & Algorithms: The Industry Interview Blueprint',
    subtitle: 'Master complex algorithmic problem solving, time/space complexity analysis, and competitive coding.',
    description: 'Master binary trees, dynamic programming, graph traversals, bit manipulation, and system scale problem solving. Includes 100+ curated FAANG-level practice patterns with visual step-by-step traces.',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    durationHours: 36,
    rating: 4.94,
    reviewsCount: 3100,
    studentsCount: 11200,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: true,
    hasCertificate: true,
    skills: ['Binary Search', 'Dynamic Programming', 'Graph Algorithms', 'Heaps & Tries', 'Sliding Window'],
    prerequisites: ['Proficiency in at least one language (Python, Java, C++, or JS)'],
    learningObjectives: [
      'Recognize recurring algorithmic patterns in complex problem statements',
      'Analyze exact asymptotic time and auxiliary memory boundaries',
      'Confidently pass top-tier technical interviews with clean code',
      'Implement non-trivial graph algorithms including Dijkstra & A*'
    ],
    projectsCount: 1,
    modulesCount: 6,
    lessonsCount: 30,
    whyThisCourse: 'The proven blueprint for cracking technical rounds at top technology companies.',
    lastUpdated: 'Feb 2026',
    instructor: {
      id: 'inst_4',
      name: 'Ananya Sharma',
      role: 'Competitive Programmer & Senior SWE',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed26002f?w=150&auto=format&fit=crop&q=80',
      bio: 'Grandmaster on Codeforces, mentored 5,000+ engineers into FAANG and Tier-1 tech roles.',
      rating: 4.97,
      studentsCount: 42000,
      coursesCount: 3,
    },
    modules: []
  },
  {
    id: 'crs_5',
    slug: 'cloud-devops-kubernetes-ci-cd',
    title: 'Cloud DevOps, Kubernetes & Automated CI/CD Pipelines',
    subtitle: 'Automate infrastructure as code with Terraform, Docker container orchestrations, and GitHub Actions.',
    description: 'A deep dive into cloud reliability engineering. Learn to provision AWS/GCP resources using Terraform, configure Kubernetes clusters, set up zero-downtime Blue/Green deployments, and monitor with Prometheus & Grafana.',
    category: 'Cloud & DevOps',
    difficulty: 'Advanced',
    durationHours: 28,
    rating: 4.89,
    reviewsCount: 820,
    studentsCount: 3410,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: false,
    hasCertificate: true,
    skills: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'AWS'],
    prerequisites: ['Linux command line comfort', 'Basic networking fundamentals'],
    learningObjectives: [
      'Architect production Kubernetes clusters with automated self-healing',
      'Build end-to-end continuous deployment pipelines with automated rollbacks',
      'Manage multi-region cloud infrastructure using declarative Terraform code',
      'Implement security scanning, secrets management, and observability'
    ],
    projectsCount: 3,
    modulesCount: 4,
    lessonsCount: 16,
    whyThisCourse: 'Bridge the gap between coding features and running million-user systems reliably.',
    lastUpdated: 'Jan 2026',
    instructor: {
      id: 'inst_3',
      name: 'Marcus Vance',
      role: 'Staff Infrastructure Engineer',
      company: 'Scale Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Specialist in distributed backend systems and high-load database sharding.',
      rating: 4.91,
      studentsCount: 22000,
      coursesCount: 5,
    },
    modules: []
  },
  {
    id: 'crs_6',
    slug: 'machine-learning-pytorch-scikit-learn',
    title: 'Practical Machine Learning & Deep Learning with PyTorch',
    subtitle: 'From statistical regression to convolutional networks and transformer fine-tuning.',
    description: 'Hands-on applied machine learning course. Master data preprocessing with Pandas/NumPy, classical algorithms with Scikit-Learn, and build deep neural networks with PyTorch for computer vision and NLP.',
    category: 'Data Science & ML',
    difficulty: 'Intermediate',
    durationHours: 30,
    rating: 4.92,
    reviewsCount: 1650,
    studentsCount: 7100,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isFeatured: false,
    hasCertificate: true,
    skills: ['PyTorch', 'Scikit-Learn', 'NumPy & Pandas', 'Neural Networks', 'Feature Engineering'],
    prerequisites: ['Python proficiency', 'High school linear algebra & calculus'],
    learningObjectives: [
      'Train, evaluate, and tune machine learning models for tabular & unstructured data',
      'Build custom PyTorch neural network architectures from mathematical formulas',
      'Prevent overfitting using regularization, dropout, and cross-validation',
      'Export models to ONNX and deploy as fast inference microservices'
    ],
    projectsCount: 3,
    modulesCount: 5,
    lessonsCount: 20,
    whyThisCourse: 'Learn the foundational math and programming behind modern artificial intelligence.',
    lastUpdated: 'Feb 2026',
    instructor: {
      id: 'inst_2',
      name: 'Elena Rostova',
      role: 'Head of AI Research',
      company: 'Neural Labs',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      bio: 'Pioneering RAG architectures and multi-agent coordination. Keynote speaker at Global AI Summit.',
      rating: 4.98,
      studentsCount: 48000,
      coursesCount: 4,
    },
    modules: []
  }
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'path_1',
    slug: 'full-stack-ai-engineer',
    title: 'Full Stack AI Developer',
    role: 'AI Product Engineer',
    description: 'Transform from a traditional developer into a full-stack engineer capable of designing, building, and deploying AI-powered applications from database to UI.',
    level: 'Intermediate to Advanced',
    durationMonths: 6,
    coursesCount: 4,
    projectsCount: 5,
    skills: ['React 19', 'TypeScript', 'Python FastAPI', 'LangChain', 'Vector DBs', 'Docker CI/CD'],
    icon: 'Layers',
    featured: true,
    milestones: [
      {
        id: 'ms_1',
        title: 'Phase 1: Modern Frontend Architecture',
        description: 'Master React 19, TypeScript strict mode, responsive design systems, and client state orchestration.',
        order: 1,
        skills: ['React', 'TypeScript', 'Tailwind'],
        courseIds: ['crs_1'],
        status: 'completed'
      },
      {
        id: 'ms_2',
        title: 'Phase 2: High-Performance Backend APIs',
        description: 'Build asynchronous microservices with FastAPI, PostgreSQL relational modeling, and secure JWT auth.',
        order: 2,
        skills: ['Python', 'FastAPI', 'PostgreSQL'],
        courseIds: ['crs_3'],
        status: 'in_progress'
      },
      {
        id: 'ms_3',
        title: 'Phase 3: Generative AI & RAG Pipelines',
        description: 'Integrate Vector databases, LLM prompt chains, context retrieval, and autonomous agents.',
        order: 3,
        skills: ['LangChain', 'Vector DB', 'Prompting'],
        courseIds: ['crs_2'],
        status: 'upcoming'
      },
      {
        id: 'ms_4',
        title: 'Phase 4: Cloud DevOps & Containerization',
        description: 'Deploy the full ecosystem with Docker, Kubernetes, and automated GitHub Actions testing pipelines.',
        order: 4,
        skills: ['Docker', 'Kubernetes', 'CI/CD'],
        courseIds: ['crs_5'],
        status: 'upcoming'
      },
      {
        id: 'ms_5',
        title: 'Phase 5: Capstone Project & Verified Portfolio',
        description: 'Ship an end-to-end commercial AI product with automated grading, recruiter review, and live demo.',
        order: 5,
        skills: ['System Design', 'Production Deployment'],
        courseIds: [],
        status: 'upcoming',
        isCapstone: true
      }
    ]
  },
  {
    id: 'path_2',
    slug: 'ai-ml-research-engineer',
    title: 'AI / Machine Learning Engineer',
    role: 'ML Engineer',
    description: 'Master the math, algorithms, and deep neural frameworks required to build, train, and fine-tune state-of-the-art machine learning models.',
    level: 'Intermediate',
    durationMonths: 7,
    coursesCount: 4,
    projectsCount: 6,
    skills: ['PyTorch', 'Data Pipelines', 'Deep Learning', 'Transformers', 'MLOps'],
    icon: 'Cpu',
    featured: true,
    milestones: [
      {
        id: 'ms_2_1',
        title: 'Phase 1: Mathematical & Algorithmic Core',
        description: 'Linear algebra, vector calculus, statistical inference, and DSA foundations.',
        order: 1,
        skills: ['Algorithms', 'Statistics'],
        courseIds: ['crs_4'],
        status: 'completed'
      },
      {
        id: 'ms_2_2',
        title: 'Phase 2: Applied Machine Learning',
        description: 'Supervised and unsupervised models with Scikit-Learn and Pandas.',
        order: 2,
        skills: ['Scikit-Learn', 'Feature Engineering'],
        courseIds: ['crs_6'],
        status: 'in_progress'
      },
      {
        id: 'ms_2_3',
        title: 'Phase 3: Deep Neural Networks & PyTorch',
        description: 'CNNs, RNNs, Attention mechanisms, and Transformers from scratch.',
        order: 3,
        skills: ['PyTorch', 'Transformers'],
        courseIds: ['crs_2'],
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'path_3',
    slug: 'cloud-devops-architect',
    title: 'Cloud & DevOps Platform Engineer',
    role: 'Site Reliability Engineer',
    description: 'Learn to design resilient, auto-scaling cloud architectures, secure CI/CD workflows, and container fleets.',
    level: 'Beginner to Advanced',
    durationMonths: 5,
    coursesCount: 3,
    projectsCount: 4,
    skills: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'AWS/GCP', 'Observability'],
    icon: 'Cloud',
    featured: false,
    milestones: []
  },
  {
    id: 'path_4',
    slug: 'data-analyst-scientist',
    title: 'Data Analyst to Scientist',
    role: 'Data Scientist',
    description: 'Extract business intelligence from big data using modern SQL, Python analytics, Tableau, and predictive modeling.',
    level: 'Beginner',
    durationMonths: 4,
    coursesCount: 3,
    projectsCount: 4,
    skills: ['Advanced SQL', 'Python Pandas', 'Data Visualization', 'Statistical Testing'],
    icon: 'BarChart3',
    featured: false,
    milestones: []
  }
];

export const mockPracticeProblems: PracticeProblem[] = [
  {
    id: 'prc_1',
    title: 'Two Sum with Optimal HashMap Lookup',
    category: 'Coding',
    difficulty: 'Beginner',
    topic: 'Arrays & Hashing',
    skills: ['Array Manipulation', 'Hash Tables', 'Time Complexity O(N)'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    language: 'python',
    codeStarter: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]`,
    explanation: 'Using a hash map allows looking up complements in O(1) time, bringing total time complexity from brute-force O(N^2) to linear O(N).',
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]' },
    ],
    attemptsCount: 3420,
    accuracyRate: 88
  },
  {
    id: 'prc_2',
    title: 'SQL: Find 2nd Highest Department Salary',
    category: 'SQL',
    difficulty: 'Intermediate',
    topic: 'Window Functions & Subqueries',
    skills: ['SQL DENSE_RANK()', 'GROUP BY', 'Subqueries'],
    description: 'Write a SQL query to find the second highest employee salary in each department. If a department only has one employee, return NULL.',
    language: 'sql',
    codeStarter: `WITH RankedSalaries AS (
    SELECT 
        department_id,
        employee_name,
        salary,
        DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rank_pos
    FROM employees
)
SELECT department_id, employee_name, salary
FROM RankedSalaries
WHERE rank_pos = 2;`,
    explanation: 'Using the DENSE_RANK() window function partitioned by department_id avoids ties skipping ranks, making extraction of the 2nd highest salary deterministic.',
    attemptsCount: 1890,
    accuracyRate: 74
  },
  {
    id: 'prc_3',
    title: 'Identify the Memory Leak in React useEffect',
    category: 'Debugging',
    difficulty: 'Intermediate',
    topic: 'React Lifecycle & Subscriptions',
    skills: ['React Hooks', 'Event Listeners', 'Cleanup Functions'],
    description: 'Review the following component code and identify why memory leaks occur when navigating between routes rapidly.',
    language: 'javascript',
    codeStarter: `// BUGGY COMPONENT
import { useState, useEffect } from 'react';

export function RealtimeSensor({ sensorId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(\`wss://api.sensors.io/\${sensorId}\`);
    
    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    // FIX: Add cleanup function to close WebSocket when sensorId changes or unmounts!
    return () => {
      socket.close();
    };
  }, [sensorId]);

  return <div>Sensor Reading: {data ? data.value : 'Connecting...'}</div>;
}`,
    explanation: 'Without returning a cleanup function that invokes socket.close(), every re-render or component unmount leaves orphaned WebSocket connections open in memory.',
    attemptsCount: 2240,
    accuracyRate: 82
  },
  {
    id: 'prc_4',
    title: 'Async Event Loop Output Prediction',
    category: 'Output Prediction',
    difficulty: 'Intermediate',
    topic: 'JavaScript Microtasks vs Macrotasks',
    skills: ['Event Loop', 'Promises', 'setTimeout', 'Microtask Queue'],
    description: 'What is the exact console output order of the following JavaScript code snippet?',
    options: [
      '1, 4, 3, 2',
      '1, 2, 3, 4',
      '1, 4, 2, 3',
      '4, 1, 3, 2'
    ],
    correctOptionIndex: 0,
    explanation: 'Synchronous statements (1, 4) execute first. Then Promise microtasks (3) execute before setTimeout macrotasks (2). Therefore, output is 1, 4, 3, 2.',
    attemptsCount: 4500,
    accuracyRate: 69
  }
];

export const mockProjects: Project[] = [
  {
    id: 'prj_1',
    slug: 'ai-code-review-bot',
    title: 'Automated AI Code Reviewer & Pull Request Bot',
    category: 'AI & Full Stack',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    skills: ['Python FastAPI', 'GitHub Webhooks API', 'OpenAI / Claude API', 'Docker', 'Redis'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Manual code reviews often consume 20-30% of engineering team bandwidth for standard linting, security antipatterns, and missing test cases.',
    objective: 'Build a serverless or containerized webhook service that automatically listens to GitHub Pull Request events, parses git diffs, analyzes code against security & architectural standards using LLMs, and posts structured inline comments.',
    requirements: [
      'GitHub Webhook verification using HMAC SHA-256 secret headers',
      'Git diff parser extracting added/modified lines with file context',
      'Structured prompt engineering producing JSON review annotations with severity levels',
      'Automatic comment posting via GitHub REST API on exact diff line numbers',
      'Rate-limiting and token cost optimization with Redis caching'
    ],
    expectedOutput: 'A deployed GitHub App that posts intelligent, non-hallucinated review comments with code recommendations on any public or private repository pull request.',
    milestones: [
      { id: 'pms_1', title: 'Milestone 1: Webhook Ingestion & Security Validation', description: 'Set up FastAPI server to handle GitHub pull_request payload and verify HMAC signature.', order: 1, completed: true },
      { id: 'pms_2', title: 'Milestone 2: Git Diff Parsing & Context Chunker', description: 'Extract patch chunks and build prompt context for the LLM.', order: 2, completed: true },
      { id: 'pms_3', title: 'Milestone 3: LLM Review Engine & Structured Response', description: 'Generate deterministic JSON recommendations using schema validation.', order: 3, completed: false },
      { id: 'pms_4', title: 'Milestone 4: Deployment & Recruiter Showcase', description: 'Containerize with Docker, deploy to cloud, and write comprehensive README with architecture diagram.', order: 4, completed: false }
    ],
    starterKitUrl: 'https://github.com/tyc/starter-ai-code-reviewer',
    status: 'in_progress'
  },
  {
    id: 'prj_2',
    slug: 'realtime-collaborative-canvas',
    title: 'Real-time Collaborative Whiteboard with WebSockets & CRDTs',
    category: 'Frontend & Systems',
    difficulty: 'Advanced',
    estimatedHours: 28,
    skills: ['React 19', 'TypeScript', 'HTML5 Canvas / SVG', 'Yjs (CRDT)', 'WebSockets', 'Tailwind'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Building multiplayer interfaces requires solving network partition resolution and concurrent conflict resolution without lagging user interaction.',
    objective: 'Build a collaborative visual whiteboard where multiple distributed users can draw shapes, add sticky notes, write text, and see real-time cursor movements simultaneously.',
    requirements: [
      'Conflict-free Replicated Data Types (CRDT) state synchronization using Yjs',
      'Sub-50ms latency cursor broadcasting with WebSocket rooms',
      'High-performance canvas rendering handling 1,000+ simultaneous elements without frame drops',
      'Export canvas state to PNG/SVG and persist room sessions in database'
    ],
    expectedOutput: 'A fully functional multiplayer canvas app with room URLs that allows seamless real-time co-drawing across separate browser windows.',
    milestones: [
      { id: 'pms_2_1', title: 'Milestone 1: Canvas Drawing Engine', description: 'Canvas rendering with pen, rectangles, and text manipulation.', order: 1, completed: false },
      { id: 'pms_2_2', title: 'Milestone 2: Yjs Multiplayer Sync', description: 'Real-time state replication and conflict resolution.', order: 2, completed: false }
    ],
    starterKitUrl: 'https://github.com/tyc/starter-collaborative-canvas',
    status: 'available'
  },
  {
    id: 'prj_3',
    slug: 'distributed-in-memory-cache',
    title: 'High-Throughput Distributed In-Memory Cache (Redis Clone in Go/Python)',
    category: 'Backend & Systems',
    difficulty: 'Industry Capstone',
    estimatedHours: 35,
    skills: ['TCP Socket Server', 'RESP Protocol Parser', 'Concurrency / Mutex Locks', 'LRU Eviction', 'AOF Persistence'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    problemStatement: 'Understanding low-level network concurrency and storage engines is crucial for senior backend and infrastructure roles.',
    objective: 'Implement a Redis-compatible in-memory key-value database from scratch using low-level TCP sockets, handling concurrent client connections, LRU memory evictions, and append-only disk persistence.',
    requirements: [
      'Implement Redis Serialization Protocol (RESP) parser for GET, SET, DEL, EXPIRE, PING',
      'Thread-safe in-memory hash table with mutex locking strategies',
      'Configurable LRU (Least Recently Used) cache eviction mechanism',
      'AOF (Append Only File) persistence with periodic background rewrite routines'
    ],
    expectedOutput: 'A standalone server binary that can be queried directly using standard redis-cli with benchmarking throughput exceeding 25k ops/sec.',
    milestones: [],
    starterKitUrl: 'https://github.com/tyc/starter-redis-clone',
    status: 'available'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert_1',
    certificateId: 'TYC-2026-REACT-8849',
    courseId: 'crs_1',
    courseTitle: 'Full Stack React 19 & TypeScript Architecture',
    studentId: 'usr_8829',
    studentName: 'Alex Rivera',
    instructorName: 'Dr. Sarah Chen',
    issuedDate: 'Feb 12, 2026',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js App Router', 'Performance Optimization'],
    grade: 'Excellence (96%)',
    verificationUrl: 'https://tyc.dev/verify/TYC-2026-REACT-8849',
    credentialScore: 96
  },
  {
    id: 'cert_2',
    certificateId: 'TYC-2026-DEVOPS-3192',
    courseId: 'crs_5',
    courseTitle: 'Cloud DevOps, Kubernetes & Automated CI/CD Pipelines',
    studentId: 'usr_8829',
    studentName: 'Alex Rivera',
    instructorName: 'Marcus Vance',
    issuedDate: 'Jan 28, 2026',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus'],
    grade: 'Distinction (92%)',
    verificationUrl: 'https://tyc.dev/verify/TYC-2026-DEVOPS-3192',
    credentialScore: 92
  }
];

export const mockJobOpportunities: JobOpportunity[] = [
  {
    id: 'job_1',
    title: 'Junior Full Stack Engineer (AI Products)',
    company: 'Anthropic Partner Studio',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
    location: 'Remote (US/India/EU)',
    type: 'Full-time',
    salaryOrStipend: '$85,000 - $115,000 / year',
    skills: ['React 19', 'TypeScript', 'Python FastAPI', 'Vector DBs'],
    experienceRequired: '0-2 Years',
    deadline: 'March 15, 2026',
    postedDate: '2 days ago',
    description: 'We are looking for a motivated engineer to build intuitive frontends and robust API integrations for next-gen generative AI applications.',
    requirements: [
      'Strong proficiency in TypeScript and React component architecture',
      'Familiarity with Python async backend services and REST endpoints',
      'Completed TYC Full Stack or AI Learning Path or equivalent portfolio projects'
    ],
    eligibility: 'TYC Certified or 2+ Verified Projects',
    applied: false
  },
  {
    id: 'job_2',
    title: 'Frontend Developer Intern',
    company: 'Linear Ecosystem Labs',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    location: 'Hybrid (Bangalore / SF)',
    type: 'Internship',
    salaryOrStipend: '$3,500 / month ($42k/yr eqv)',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI Animation'],
    experienceRequired: 'Freshers / Final Year Students',
    deadline: 'March 5, 2026',
    postedDate: 'Yesterday',
    description: 'Join our design-engineering squad to build pixel-perfect, accessible SaaS components with extreme speed and responsiveness.',
    requirements: [
      'Deep understanding of DOM rendering, CSS layouts, and modern hooks',
      'Portfolio showcasing clean UI design and attention to micro-interactions'
    ],
    eligibility: 'All Enrolled TYC Students',
    applied: true
  },
  {
    id: 'job_3',
    title: 'Associate Machine Learning Engineer',
    company: 'Neural Metrics AI',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Remote',
    type: 'Full-time',
    salaryOrStipend: '$90,000 - $120,000 / year',
    skills: ['PyTorch', 'Python', 'FastAPI', 'MLOps', 'Docker'],
    experienceRequired: '1-2 Years',
    deadline: 'April 1, 2026',
    postedDate: '3 days ago',
    description: 'Help productionize vision and text models, manage data ingestion pipelines, and build latency-optimized inference APIs.',
    requirements: [
      'Strong mathematical foundations in probability and linear algebra',
      'Experience containerizing ML models with Docker and testing on GPUs'
    ],
    eligibility: 'TYC AI/ML Path Graduates',
    applied: false
  }
];

export const mockWorkshops: Workshop[] = [
  {
    id: 'ws_1',
    title: 'Live Masterclass: Building Autonomous Multi-Agent Systems in 2026',
    instructorName: 'Elena Rostova',
    instructorRole: 'Head of AI Research @ Neural Labs',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    date: 'Saturday, Feb 28, 2026',
    time: '6:00 PM - 8:30 PM IST',
    durationMinutes: 150,
    fee: 0,
    capacity: 500,
    registeredCount: 412,
    description: 'Step-by-step live coding session constructing a 3-agent orchestration system that browses the web, synthesizes technical documentation, and compiles automated PR summaries.',
    skills: ['AI Agents', 'LangGraph', 'Python', 'Autonomous Workflows'],
    meetingLink: 'https://meet.tyc.dev/ws-ai-agents',
    resourcesCount: 4,
    isRegistered: true
  },
  {
    id: 'ws_2',
    title: 'System Design Blueprint: Scaling from 1K to 1M Daily Active Users',
    instructorName: 'Marcus Vance',
    instructorRole: 'Staff Infrastructure Engineer @ Scale Systems',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: 'Sunday, March 8, 2026',
    time: '5:00 PM - 7:30 PM IST',
    durationMinutes: 150,
    fee: 0,
    capacity: 400,
    registeredCount: 290,
    description: 'Learn database indexing, cache stampede prevention, connection pooling, and message queuing strategies with real telemetry breakdowns.',
    skills: ['System Design', 'Redis', 'PostgreSQL', 'Load Balancing'],
    meetingLink: 'https://meet.tyc.dev/ws-system-design',
    resourcesCount: 3,
    isRegistered: false
  }
];

export const mockHackathons: Hackathon[] = [
  {
    id: 'hack_1',
    title: 'TYC Global AI & Web3 Innovation Hackathon 2026',
    organizer: 'Traya Yukti Core & Partner Tech Ecosystem',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    startDate: 'March 14, 2026',
    endDate: 'March 16, 2026',
    prizePool: '$25,000 + Venture Fast-Track',
    eligibility: 'Open to All Students & Tech Enthusiasts',
    participantsCount: 1420,
    teamsCount: 380,
    description: 'A 48-hour global sprint to solve real-world problems across Healthcare, Developer Tooling, Education, and FinTech using modern AI architectures.',
    status: 'Upcoming',
    isRegistered: true,
    problemStatements: [
      { id: 'ps_1', title: 'Track 1: AI Developer Productivity & Automation', track: 'DevTools', description: 'Build tools that dramatically reduce manual repetition in engineering workflows.' },
      { id: 'ps_2', title: 'Track 2: Accessible EdTech & Learning Intelligence', track: 'Education', description: 'Create adaptive learning companions that personalize curriculum based on real-time comprehension.' },
      { id: 'ps_3', title: 'Track 3: High-Performance Data & Systems', track: 'Systems', description: 'Solve latency, sync, and security challenges in distributed multi-cloud architectures.' }
    ],
    leaderboard: [
      { rank: 1, teamName: 'NeuroSync Team', projectTitle: 'Realtime Brain-Computer Interface Dashboard', score: 98.4 },
      { rank: 2, teamName: 'HyperScale AI', projectTitle: 'Zero-Copy In-Memory Vector Search Engine', score: 96.1 },
      { rank: 3, teamName: 'CodeGuardian', projectTitle: 'Autonomous Vulnerability Auto-Patcher', score: 94.8 }
    ]
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post_1',
    title: 'How I built a full-stack AI resume reviewer and landed 3 interviews this week',
    content: 'Sharing my architecture after finishing the TYC Full Stack React & Python courses! Used React 19 for the frontend, FastAPI for streaming OCR processing, and ChromaDB for vector matching against job descriptions. Code is open-sourced on GitHub!',
    author: {
      id: 'usr_201',
      name: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Student • Full Stack Path',
      badge: 'Top Contributor'
    },
    category: 'Showcases',
    tags: ['React', 'FastAPI', 'Career', 'Project Showcase'],
    upvotes: 84,
    commentsCount: 19,
    createdAt: '4 hours ago',
    hasUpvoted: true,
    pinned: true,
    comments: [
      {
        id: 'c1',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Incredible work Rohan! How did you handle the PDF chunking for multi-page resumes without cutting context in the middle of a job bullet point?',
        createdAt: '2 hours ago',
        upvotes: 6
      },
      {
        id: 'c2',
        authorName: 'Dr. Sarah Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Clean architecture Rohan! Great use of server-sent events for real-time score streaming.',
        createdAt: '1 hour ago',
        upvotes: 12
      }
    ]
  },
  {
    id: 'post_2',
    title: 'Study Group: Preparing for Google & FAANG Summer 2026 Technical Rounds',
    content: 'We are organizing daily 1-hour peer mock interviews and solving 2 medium/hard LeetCode & TYC Practice Engine problems together over Discord. All intermediate level students welcome!',
    author: {
      id: 'usr_304',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Student • DSA Blueprint'
    },
    category: 'Study Groups',
    tags: ['DSA', 'Mock Interviews', 'Peer Study'],
    upvotes: 52,
    commentsCount: 14,
    createdAt: '1 day ago',
    hasUpvoted: false
  },
  {
    id: 'post_3',
    title: 'Understanding React 19 Actions: When to use useActionState vs standard React Query?',
    content: 'Can someone explain the recommended boundary between React 19 form actions and TanStack Query mutations for complex enterprise forms with dependent fields?',
    author: {
      id: 'usr_402',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Student'
    },
    category: 'Questions',
    tags: ['React 19', 'TanStack Query', 'Architecture'],
    upvotes: 31,
    commentsCount: 8,
    createdAt: '2 days ago',
    hasUpvoted: false
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Certificate Issued!',
    message: 'Your certificate for Full Stack React 19 & TypeScript Architecture is now verified and available for download.',
    category: 'certificate',
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: '/certificates'
  },
  {
    id: 'notif_2',
    title: 'Workshop Reminder',
    message: 'Masterclass on Building Autonomous Multi-Agent Systems starts this Saturday at 6:00 PM IST.',
    category: 'workshop',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/workshops'
  },
  {
    id: 'notif_3',
    title: 'New Internship Matching Your Profile',
    message: 'Linear Ecosystem Labs posted "Frontend Developer Intern" matching your React & TypeScript skills.',
    category: 'career',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/career'
  },
  {
    id: 'notif_4',
    title: 'Assignment Feedback Ready',
    message: 'Instructor Dr. Sarah Chen approved your Milestone 1 submission with a 98% score.',
    category: 'assignment',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/projects'
  }
];

export const mockAdminStats = {
  totalStudents: 24890,
  activeStudentsToday: 3840,
  coursesPublished: 28,
  totalEnrollments: 64200,
  platformRevenue: '$184,200',
  completionRate: '86.4%',
  certificatesIssued: 9420,
  projectsSubmitted: 14800,
  internshipsPlaced: 890,
  hackathonParticipants: 4200,
  aiTutorQueriesDaily: 18500,
  monthlyEnrollmentData: [
    { month: 'Sep', enrollments: 3200, completions: 2400 },
    { month: 'Oct', enrollments: 4100, completions: 3100 },
    { month: 'Nov', enrollments: 4800, completions: 3900 },
    { month: 'Dec', enrollments: 5900, completions: 4700 },
    { month: 'Jan', enrollments: 7200, completions: 5800 },
    { month: 'Feb', enrollments: 8900, completions: 7400 },
  ],
  popularCourses: [
    { title: 'Full Stack React 19 & TypeScript', students: 6890, rating: 4.9 },
    { title: 'Generative AI & LLM Engineering', students: 8940, rating: 4.96 },
    { title: 'Data Structures & Algorithms Blueprint', students: 11200, rating: 4.94 },
    { title: 'Python Backend with FastAPI', students: 4520, rating: 4.88 },
  ]
};
