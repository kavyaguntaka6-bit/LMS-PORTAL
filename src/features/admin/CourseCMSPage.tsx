import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { courseService } from '../../services/api';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  FileCode,
  Eye,
  Video,
  Save,
  Check,
  X,
  AlertCircle,
  Send,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Course, CourseModule, Lesson } from '../../types';

export const CourseCMSPage: React.FC = () => {
  const { courses, refreshCourses } = useLMS();
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useNotifications();

  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || {} as any);
  
  // Modals
  const [newLessonModalOpen, setNewLessonModalOpen] = useState(false);
  const [newModuleModalOpen, setNewModuleModalOpen] = useState(false);
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

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

  useEffect(() => {
    loadLiveCourses();
  }, []);

  const loadLiveCourses = async () => {
    try {
      const all = await courseService.getCourses();
      setCourseList(all);
      if (all.length > 0 && (!selectedCourse.id || !all.some((c) => c.id === selectedCourse.id))) {
        setSelectedCourse(all[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveCourseChanges = async (updatedCourse: Course) => {
    try {
      const saved = await courseService.saveCourse(updatedCourse, user || undefined);
      setSelectedCourse(saved);
      await loadLiveCourses();
      refreshCourses();
      toast('Course Saved', `Changes saved to ${saved.title}.`, 'course');
    } catch (err: any) {
      toast('Save Error', err?.message || 'Failed to save course changes.', 'system');
    }
  };

  // Moderation Handlers
  const handleReviewDecision = async (decision: 'approved' | 'rejected' | 'changes_requested') => {
    if (!selectedCourse.id) return;
    try {
      const reviewed = await courseService.reviewCourse(
        selectedCourse.id,
        decision,
        reviewNotes || `Verdict: ${decision.toUpperCase()}`,
        user || undefined
      );
      setSelectedCourse(reviewed);
      setReviewDrawerOpen(false);
      setReviewNotes('');
      await loadLiveCourses();
      toast('Course Review Submitted', `Verdict: ${decision.toUpperCase()}.`, 'system');
    } catch (err: any) {
      toast('Review Error', err?.message || 'Failed to review course.', 'system');
    }
  };

  const handlePublishCourse = async () => {
    if (!selectedCourse.id) return;
    try {
      const published = await courseService.publishCourse(selectedCourse.id, user || undefined);
      setSelectedCourse(published);
      await loadLiveCourses();
      toast('Course Published', 'Course is now live in the student catalog.', 'system');
    } catch (err: any) {
      toast('Publish Error', err?.message || 'Insufficient permissions to publish directly.', 'system');
    }
  };

  const handleArchiveCourse = async () => {
    if (!selectedCourse.id) return;
    try {
      const archived = await courseService.archiveCourse(selectedCourse.id, user || undefined);
      setSelectedCourse(archived);
      await loadLiveCourses();
      toast('Course Archived', 'Course retired from active view.', 'system');
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to archive course.', 'system');
    }
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
    setNewModuleModalOpen(false);
    setNewModuleTitle('');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !selectedModuleId) return;

    const targetModule = (selectedCourse.modules || []).find(m => m.id === selectedModuleId);
    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      moduleId: selectedModuleId,
      courseId: selectedCourse.id,
      order: (targetModule?.lessons?.length || 0) + 1,
      title: newLessonTitle,
      durationMinutes: Number(newLessonDuration),
      type: newLessonType,
      videoUrl: newLessonVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };

    const updatedModules = (selectedCourse.modules || []).map((m) => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          lessons: [...(m.lessons || []), newLesson]
        };
      }
      return m;
    });

    const updated = {
      ...selectedCourse,
      modules: updatedModules,
      lessonsCount: (selectedCourse.lessonsCount || 0) + 1
    };

    saveCourseChanges(updated);
    setNewLessonModalOpen(false);
    setNewLessonTitle('');
    setNewLessonVideoUrl('');
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      slug: newCourseTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: newCourseTitle,
      subtitle: newCourseSubtitle || 'Enterprise Masterclass by Traya Yukti',
      category: newCourseCategory,
      difficulty: newCourseDifficulty,
      durationHours: Number(newCourseDuration),
      lessonsCount: 0,
      modulesCount: 0,
      projectsCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 0,
      price: 0,
      hasCertificate: true,
      skills: ['Full Stack AI', 'System Architecture'],
      prerequisites: ['Basic JavaScript knowledge'],
      learningObjectives: ['Master production concepts', 'Build full stack AI integrations'],
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'Comprehensive curriculum designed for industry mastery.',
      instructor: {
        id: user?.id || 'usr_inst_1',
        name: user?.name || 'Faculty Director',
        role: 'Senior Curriculum Architect',
        company: 'Traya Yukti AI',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Industry specialist and enterprise curriculum lead.',
        rating: 4.9,
        studentsCount: 1200,
        coursesCount: 3
      },
      status: isAdmin ? 'published' : 'draft',
      reviewStatus: isAdmin ? 'approved' : 'draft',
      lastUpdated: 'Just now',
      modules: []
    };

    try {
      const saved = await courseService.saveCourse(newCourse, user || undefined);
      setNewCourseModalOpen(false);
      setNewCourseTitle('');
      setNewCourseSubtitle('');
      await loadLiveCourses();
      setSelectedCourse(saved);
      toast('Course Created', `Initialized course "${saved.title}".`, 'course');
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to create course.', 'system');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Course Curriculum CMS & Moderation Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Author syllabus, construct modular lessons, evaluate submitted faculty courses, and control publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setNewCourseModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Masterclass
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Course Selector & Moderation Banner */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Select Curriculum Track ({courseList.length})
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {courseList.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all text-xs space-y-1.5 ${
                    selectedCourse.id === course.id
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {course.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase ${
                      course.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      course.status === 'submitted_for_review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      course.status === 'changes_requested' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                      'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{course.modules?.length || 0} Modules &bull; {course.lessonsCount || 0} Lessons</span>
                    <span className="font-semibold text-emerald-600">{course.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Active Course Editor & Governance Panel */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCourse.id ? (
            <Card className="p-6 space-y-6 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
              
              {/* Course Header & Moderation Status Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedCourse.title}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Status: {selectedCourse.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedCourse.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Governance Moderation Actions */}
                  {selectedCourse.status === 'submitted_for_review' && (isAdmin || isSuperAdmin) && (
                    <Button variant="primary" size="sm" onClick={() => setReviewDrawerOpen(true)}>
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      Review & Approve Course
                    </Button>
                  )}

                  {selectedCourse.status !== 'published' && (isAdmin || isSuperAdmin) && (
                    <Button variant="outline" size="sm" onClick={handlePublishCourse} className="text-emerald-600 border-emerald-300 dark:border-emerald-800">
                      <Check className="w-4 h-4 mr-1.5" />
                      Publish Live
                    </Button>
                  )}

                  {selectedCourse.status === 'published' && (isAdmin || isSuperAdmin) && (
                    <Button variant="outline" size="sm" onClick={handleArchiveCourse} className="text-slate-500">
                      Archive
                    </Button>
                  )}
                </div>
              </div>

              {/* Review Notes Alert if Changes Requested */}
              {selectedCourse.reviewNotes && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Admin Moderation Feedback:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    "{selectedCourse.reviewNotes}"
                  </p>
                </div>
              )}

              {/* Module Hierarchy List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    Syllabus Modules & Lessons ({selectedCourse.modules?.length || 0} Modules)
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setNewModuleModalOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Module
                  </Button>
                </div>

                <div className="space-y-3">
                  {(selectedCourse.modules || []).map((module, mIdx) => (
                    <div key={module.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                            {mIdx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">{module.title}</h4>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedModuleId(module.id); setNewLessonModalOpen(true); }}
                          className="text-[11px] py-1 px-2.5"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Lesson
                        </Button>
                      </div>

                      {/* Lessons Sub-list */}
                      <div className="pl-8 space-y-1.5">
                        {(module.lessons || []).map((lesson, lIdx) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="flex items-center gap-2">
                              <Video className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{lesson.durationMinutes} mins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400">
              Select a course to view and edit its modules.
            </Card>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* Modal: Review & Decision */}
      <Modal
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        title="Admin Moderation: Course Review"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            Review the submitted syllabus, module count, and lesson videos for <strong>{selectedCourse.title}</strong>.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Reviewer Notes / Feedback to Instructor
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Provide comments or requested adjustments..."
              rows={4}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="pt-3 flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReviewDecision('changes_requested')}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Request Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReviewDecision('rejected')}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleReviewDecision('approved')}
            >
              Approve Course
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Add Module */}
      <Modal
        isOpen={newModuleModalOpen}
        onClose={() => setNewModuleModalOpen(false)}
        title="Add Curriculum Module"
      >
        <form onSubmit={handleAddModule} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Module Title</label>
            <Input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="e.g. Module 3: Advanced Vector Embeddings & RAG"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Module
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Lesson */}
      <Modal
        isOpen={newLessonModalOpen}
        onClose={() => setNewLessonModalOpen(false)}
        title="Add Lesson to Module"
      >
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Title</label>
            <Input
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="e.g. Implementing Cosine Similarity in Python"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Minutes)</label>
              <Input
                type="number"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                min={5}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lesson Type</label>
              <select
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="video">Video Lecture</option>
                <option value="article">Reading Article</option>
                <option value="quiz">Interactive Quiz</option>
                <option value="assignment">Coding Project</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Embed / Video URL</label>
            <Input
              value={newLessonVideoUrl}
              onChange={(e) => setNewLessonVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Lesson
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Course */}
      <Modal
        isOpen={newCourseModalOpen}
        onClose={() => setNewCourseModalOpen(false)}
        title="Initialize New Masterclass Curriculum"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Masterclass Title</label>
            <Input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="e.g. Distributed Systems & High-Scale Microservices"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtitle</label>
            <Input
              value={newCourseSubtitle}
              onChange={(e) => setNewCourseSubtitle(e.target.value)}
              placeholder="Master Kafka, gRPC, and Kubernetes architecture"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
              <select
                value={newCourseDifficulty}
                onChange={(e) => setNewCourseDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Est. Duration (Hours)</label>
              <Input
                type="number"
                value={newCourseDuration}
                onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Course
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
