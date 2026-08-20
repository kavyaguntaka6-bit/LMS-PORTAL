import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCode,
  Eye,
  Video,
  FolderPlus,
  Save,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Course, CourseModule, Lesson } from '../../types';

export const CourseCMSPage: React.FC = () => {
  const { courses, refreshCourses } = useLMS();
  const { toast } = useNotifications();

  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || {} as any);
  
  // Modals
  const [newLessonModalOpen, setNewLessonModalOpen] = useState(false);
  const [newModuleModalOpen, setNewModuleModalOpen] = useState(false);
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);

  // Lesson state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(25);
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>('video');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  
  // Module state
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // New Course state
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Frontend & Full Stack');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newCourseDuration, setNewCourseDuration] = useState(20);

  const saveCourseChanges = (updatedCourse: Course) => {
    try {
      const stored = localStorage.getItem('tyc_courses');
      let courseList: Course[] = stored ? JSON.parse(stored) : courses;
      const idx = courseList.findIndex(c => c.id === updatedCourse.id);
      if (idx !== -1) {
        courseList[idx] = updatedCourse;
      } else {
        courseList.unshift(updatedCourse);
      }
      localStorage.setItem('tyc_courses', JSON.stringify(courseList));
      setSelectedCourse({ ...updatedCourse });
      refreshCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = (newStatus: Course['status']) => {
    const updated = { ...selectedCourse, status: newStatus };
    saveCourseChanges(updated);
    toast('Status Updated', `Course status changed to ${newStatus}.`, 'system');
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModule: CourseModule = {
      id: `mod_${Date.now()}`,
      title: newModuleTitle,
      order: (selectedCourse.modules?.length || 0) + 1,
      durationMinutes: 60,
      lessons: []
    };

    const updated = {
      ...selectedCourse,
      modules: [...(selectedCourse.modules || []), newModule],
      modulesCount: (selectedCourse.modules?.length || 0) + 1
    };

    saveCourseChanges(updated);
    toast('Module Added', `"${newModuleTitle}" created successfully.`, 'course');
    setNewModuleModalOpen(false);
    setNewModuleTitle('');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const targetModId = selectedModuleId || selectedCourse.modules?.[0]?.id || 'mod_1';

    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      moduleId: targetModId,
      courseId: selectedCourse.id,
      title: newLessonTitle,
      order: 1,
      durationMinutes: newLessonDuration,
      type: newLessonType,
      videoUrl: newLessonVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    };

    const updatedModules = (selectedCourse.modules || []).map(m => {
      if (m.id === targetModId) {
        return {
          ...m,
          durationMinutes: m.durationMinutes + newLessonDuration,
          lessons: [...m.lessons, { ...newLesson, order: m.lessons.length + 1 }]
        };
      }
      return m;
    });

    const totalLessons = updatedModules.reduce((acc, m) => acc + m.lessons.length, 0);

    const updated = {
      ...selectedCourse,
      modules: updatedModules,
      lessonsCount: totalLessons
    };

    saveCourseChanges(updated);
    toast('Lesson Added', `"${newLessonTitle}" published to module.`, 'course');
    setNewLessonModalOpen(false);
    setNewLessonTitle('');
    setNewLessonVideoUrl('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      slug: newCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newCourseTitle,
      subtitle: newCourseSubtitle || 'Master next-generation engineering skills with project-based learning.',
      description: 'Comprehensive industry curriculum developed by senior architects and tech leaders.',
      category: newCourseCategory,
      difficulty: newCourseDifficulty,
      durationHours: newCourseDuration,
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 1,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isFeatured: true,
      hasCertificate: true,
      skills: ['Modern Frameworks', 'Full-Stack Architecture', 'Testing & CI/CD'],
      prerequisites: ['Basic programming fundamentals'],
      learningObjectives: [
        'Understand modern system architecture and best practices',
        'Build production-ready projects with automated tests',
        'Prepare for technical career interviews'
      ],
      projectsCount: 1,
      modulesCount: 1,
      lessonsCount: 1,
      whyThisCourse: 'Curated curriculum aligned with current market demand.',
      lastUpdated: 'Just now',
      status: 'published',
      instructor: {
        id: 'inst_new',
        name: 'TYC Expert Faculty',
        role: 'Senior Staff Engineer',
        company: 'Traya Yukti Labs',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Industry practitioner guiding modern software engineers.',
        rating: 4.98,
        studentsCount: 12000,
        coursesCount: 4
      },
      modules: [
        {
          id: `mod_${Date.now()}`,
          title: 'Module 1: Foundations & Architecture',
          order: 1,
          durationMinutes: 60,
          lessons: [
            {
              id: `les_${Date.now()}`,
              moduleId: `mod_${Date.now()}`,
              courseId: `crs_${Date.now()}`,
              title: '1.1 Course Overview & Architecture Setup',
              order: 1,
              durationMinutes: 20,
              type: 'video',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            }
          ]
        }
      ]
    };

    saveCourseChanges(newCourse);
    toast('New Course Published', `"${newCourse.title}" is now active in the platform catalog.`, 'course');
    setNewCourseModalOpen(false);
    setNewCourseTitle('');
    setNewCourseSubtitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-tyc-text dark:text-white">Course Curriculum CMS</h1>
          <p className="text-xs text-tyc-muted dark:text-gray-400">Manage Course &rarr; Module &rarr; Lesson hierarchy and publishing workflows.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setNewCourseModalOpen(true)} className="dark:border-gray-700">
            <FolderPlus className="w-4 h-4 mr-1 text-tyc-green" />
            Create Course
          </Button>
          <Button variant="outline" size="sm" onClick={() => setNewModuleModalOpen(true)} className="dark:border-gray-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Module
          </Button>
          <Button variant="primary" size="sm" onClick={() => {
            setSelectedModuleId(selectedCourse?.modules?.[0]?.id || '');
            setNewLessonModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-1" />
            Add Lesson
          </Button>
        </div>
      </div>

      {/* Course Selector Dropdown */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-[#151916] dark:border-gray-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-tyc-green shrink-0" />
          <div>
            <label className="text-[11px] font-bold text-tyc-muted dark:text-gray-400 uppercase block">Active Course Curriculum</label>
            <select
              value={selectedCourse?.id}
              onChange={(e) => {
                const found = courses.find(c => c.id === e.target.value);
                if (found) setSelectedCourse(found);
              }}
              className="text-xs font-bold text-tyc-text dark:text-gray-100 bg-transparent focus:outline-none cursor-pointer mt-0.5"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-[#191D1A]">
                  {c.title} ({c.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Workflow Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-tyc-muted dark:text-gray-400 font-medium">Status:</span>
          <select
            value={selectedCourse?.status || 'published'}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="text-xs bg-tyc-bg dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-2.5 py-1.5 font-semibold text-tyc-green dark:text-green-400 focus:outline-none cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>

      {/* Hierarchy Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-tyc-text dark:text-white uppercase tracking-wider">
            Curriculum Modules & Lessons Tree ({selectedCourse?.modules?.length || 0} Modules)
          </h3>
          <span className="text-xs text-tyc-muted dark:text-gray-400">
            Total {selectedCourse?.lessonsCount || 0} Lessons &bull; ~{selectedCourse?.durationHours || 0}h Duration
          </span>
        </div>

        {selectedCourse?.modules?.map((mod, modIdx) => (
          <Card key={mod.id} className="p-5 space-y-4 border-tyc-border dark:border-gray-800 dark:bg-[#151916]">
            <div className="flex items-center justify-between border-b border-tyc-border dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-tyc-green text-white text-xs font-bold flex items-center justify-center">
                  {modIdx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-tyc-text dark:text-white">{mod.title}</h4>
                  <span className="text-[11px] text-tyc-muted dark:text-gray-400">{mod.lessons.length} Lessons &bull; ~{mod.durationMinutes} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 px-2 dark:border-gray-700"
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setNewLessonModalOpen(true);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Lesson
                </Button>
              </div>
            </div>

            {/* Lessons in Module */}
            <div className="divide-y divide-tyc-border/60 dark:divide-gray-800/60 pl-4 border-l-2 border-tyc-green/30 space-y-1">
              {mod.lessons.map((les, lesIdx) => (
                <div key={les.id} className="pt-2 pb-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-tyc-muted dark:text-gray-500 text-[11px]">{modIdx + 1}.{lesIdx + 1}</span>
                    <span className="font-semibold text-tyc-text dark:text-gray-200">{les.title}</span>
                    <Badge variant={les.type === 'quiz' ? 'orange' : les.type === 'coding' ? 'green' : 'gray'} size="sm">
                      {les.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-tyc-muted dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {les.durationMinutes} mins
                    </span>
                    <span className="text-tyc-green dark:text-green-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> CDN Stream
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Module Modal */}
      <Modal
        isOpen={newModuleModalOpen}
        onClose={() => setNewModuleModalOpen(false)}
        title="Add Curriculum Module"
        description={`Creating a new module under ${selectedCourse?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleAddModule} className="space-y-4 text-xs">
          <Input
            label="Module Title"
            required
            placeholder="e.g. Module 3: Advanced State Synchronization"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={() => setNewModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Module
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add New Lesson Modal */}
      <Modal
        isOpen={newLessonModalOpen}
        onClose={() => setNewLessonModalOpen(false)}
        title="Add New Lesson to Curriculum"
        description={`Appending to ${selectedCourse?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
          <Input
            label="Lesson Title"
            required
            placeholder="e.g. 2.3 Zustand Custom Storage Middleware"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
          />

          <Input
            label="Video Stream URL (HLS / MP4 / YouTube)"
            placeholder="https://example.com/stream.m3u8"
            value={newLessonVideoUrl}
            onChange={(e) => setNewLessonVideoUrl(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Lesson Type</label>
              <select
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value as any)}
                className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
              >
                <option value="video">Video Stream</option>
                <option value="coding">Coding Challenge</option>
                <option value="quiz">Assessment Quiz</option>
                <option value="project">Capstone Project</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={() => setNewLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Append Lesson
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create New Course Modal */}
      <Modal
        isOpen={newCourseModalOpen}
        onClose={() => setNewCourseModalOpen(false)}
        title="Create New Course"
        description="Publish a brand-new structured engineering course"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
          <Input
            label="Course Title"
            required
            placeholder="e.g. Distributed Systems & Microservices in Go"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
          />

          <Input
            label="Course Subtitle / Tagline"
            placeholder="e.g. High-throughput concurrency patterns, gRPC, and Kafka event streaming."
            value={newCourseSubtitle}
            onChange={(e) => setNewCourseSubtitle(e.target.value)}
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Category</label>
              <select
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
              >
                <option value="Frontend & Full Stack">Frontend & Full Stack</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Backend & Cloud">Backend & Cloud</option>
                <option value="System Design">System Design</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Difficulty</label>
              <select
                value={newCourseDifficulty}
                onChange={(e) => setNewCourseDifficulty(e.target.value as any)}
                className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Estimated Hours</label>
              <input
                type="number"
                min="4"
                max="100"
                value={newCourseDuration}
                onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={() => setNewCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Course to Platform
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
