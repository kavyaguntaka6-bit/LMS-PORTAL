import { Course, StudentPreferences, RecommendedCourseItem } from '../types';

export const QUESTIONNAIRE_INTEREST_OPTIONS = [
  { id: 'frontend', label: 'Frontend & UI Engineering', tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js App Router', 'Frontend & Full Stack'], icon: 'Code2' },
  { id: 'backend', label: 'Backend APIs & Microservices', tags: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Backend & Cloud'], icon: 'Terminal' },
  { id: 'aiml', label: 'Artificial Intelligence & LLMs', tags: ['Generative AI', 'LLM', 'AI & Machine Learning', 'Prompt Eng', 'PyTorch'], icon: 'Sparkles' },
  { id: 'cloud_devops', label: 'Cloud Infrastructure & DevOps', tags: ['Kubernetes', 'Terraform', 'Cloud & DevOps', 'CI/CD', 'AWS'], icon: 'Server' },
  { id: 'core_cs', label: 'Data Structures & Algorithms', tags: ['Data Structures', 'System Design', 'Core CS & Interview Prep', 'Algorithms'], icon: 'Cpu' },
  { id: 'fullstack', label: 'Full Stack Web Architecture', tags: ['React 19', 'TypeScript', 'Zustand', 'FastAPI', 'Full Stack'], icon: 'Layers' },
];

export const QUESTIONNAIRE_GOAL_OPTIONS = [
  { id: 'job_switch', label: 'Prepare for High-Growth Tech Career / Internships', desc: 'Build resume-worthy real-world capstone projects' },
  { id: 'master_ai', label: 'Master Modern AI & Full-Stack Systems', desc: 'Learn latest 2026 frameworks (React 19, FastAPI, LLMs)' },
  { id: 'faang_prep', label: 'Crack Tech & FAANG Coding Interviews', desc: 'Master advanced algorithms and system design' },
  { id: 'build_saas', label: 'Build & Launch Independent Web Products', desc: 'Deploy scalable modern cloud applications' },
];

export const QUESTIONNAIRE_TIME_OPTIONS = [
  { id: 'light', label: '2 - 5 Hours / week', desc: 'Self-paced bite-sized learning' },
  { id: 'moderate', label: '5 - 10 Hours / week', desc: 'Standard steady progression' },
  { id: 'intensive', label: '10 - 20+ Hours / week', desc: 'Immersive career fast-track' },
];

/**
 * Intelligent Course Recommendation Engine
 * Analyzes student preferences against verified active courses in the database
 */
export function calculatePersonalizedRecommendations(
  preferences: StudentPreferences,
  availableCourses: Course[]
): RecommendedCourseItem[] {
  if (!availableCourses || availableCourses.length === 0) return [];

  const results: RecommendedCourseItem[] = availableCourses.map((course) => {
    let score = 50; // Base score
    const matchedInterests: string[] = [];

    // 1. Category and Tag Matching
    const selectedInterests = preferences.interests || [];
    selectedInterests.forEach((interestId) => {
      const option = QUESTIONNAIRE_INTEREST_OPTIONS.find((opt) => opt.id === interestId);
      if (option) {
        const matchesCategory = option.tags.some(
          (tag) => course.category.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(course.category.toLowerCase())
        );
        const matchesSkills = option.tags.some((tag) =>
          course.skills?.some((sk) => sk.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(sk.toLowerCase()))
        );

        if (matchesCategory || matchesSkills) {
          score += 35;
          matchedInterests.push(option.label);
        }
      }
    });

    // 2. Experience / Difficulty Level Matching
    const userLevel = preferences.level || 'Beginner';
    if (course.difficulty === 'All Levels') {
      score += 20;
    } else if (course.difficulty === userLevel) {
      score += 30;
    } else if (
      (userLevel === 'Beginner' && course.difficulty === 'Intermediate') ||
      (userLevel === 'Intermediate' && (course.difficulty === 'Beginner' || course.difficulty === 'Advanced')) ||
      (userLevel === 'Advanced' && course.difficulty === 'Intermediate')
    ) {
      score += 15;
    }

    // 3. Goal Matching
    const userGoals = preferences.goals || [];
    if (userGoals.includes('master_ai') && (course.category.includes('AI') || course.skills?.some(s => s.includes('AI') || s.includes('LLM')))) {
      score += 25;
    }
    if (userGoals.includes('faang_prep') && (course.category.includes('Core CS') || course.skills?.some(s => s.includes('Data Structures')))) {
      score += 25;
    }
    if (userGoals.includes('job_switch') && course.projectsCount && course.projectsCount >= 2) {
      score += 20;
    }

    // 4. Synthesize clear, non-overpromising rationale
    let reason = 'Curated based on foundational software engineering curriculum.';
    if (matchedInterests.length > 0) {
      reason = `Recommended because it matches your interest in ${matchedInterests[0]} and fits your ${userLevel} level.`;
    } else if (course.difficulty === userLevel) {
      reason = `Recommended because its ${course.difficulty} curriculum aligns with your current learning pace.`;
    }

    return {
      course,
      matchScore: Math.min(score, 99),
      reason,
      matchedInterests
    };
  });

  // Sort by highest match score first
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
