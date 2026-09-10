import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  assignmentService,
  authService,
  activityService,
  courseService,
  resourceOverrideService
} from '../../services/api';
import {
  Assignment,
  AssignmentSubmission,
  User,
  ActivityLog,
  Course,
  ResourceAccessOverride
} from '../../types';
import {
  FileCheck,
  Users,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  KeyRound,
  Send,
  AlertCircle,
  ShieldCheck,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { StatCard } from '../../components/shared/StatCard';
import { Modal } from '../../components/ui/Modal';

interface InstructorDashboardProps {
  initialTab?: string;
}

export const InstructorDashboardPage: React.FC<InstructorDashboardProps> = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useNotifications();

  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/instructor/submissions')) return 'submissions';
    if (path.includes('/instructor/students')) return 'students';
    if (path.includes('/instructor/overrides')) return 'overrides';
    return 'overview';
  };

  const activeTab = getTabFromPath();

  // State
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [overrides, setOverrides] = useState<ResourceAccessOverride[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'reviewed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(95);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);

  // Resource Access Override Modal State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideStudentId, setOverrideStudentId] = useState('');
  const [overrideResourceTitle, setOverrideResourceTitle] = useState('Cloud DataLab: NVIDIA A100 GPU Cluster');
  const [overrideResourceType, setOverrideResourceType] = useState<'datalab' | 'course' | 'masterclass' | 'coding_lab'>('datalab');
  const [overrideReason, setOverrideReason] = useState('Capstone Deep Learning experimentation.');
  const [overrideExpiryDate, setOverrideExpiryDate] = useState('2026-09-30');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subs, asgs, usersList, logs, allCourses, allOverrides] = await Promise.all([
        assignmentService.getSubmissions(),
        assignmentService.getAssignments(),
        authService.getAllUsers(),
        activityService.getActivities(undefined, 15),
        courseService.getCourses(),
        resourceOverrideService.getOverrides(user?.id)
      ]);
      setSubmissions(subs);
      setAssignments(asgs);
      setStudents(usersList.filter((u) => u.role === 'student'));
      setActivityLogs(logs);
      setCourses(allCourses);
      setOverrides(allOverrides);
    } catch (err) {
      console.error('Error loading instructor data', err);
    }
  };

  // Submit Course for Review
  const handleSubmitCourseForReview = async (courseId: string) => {
    try {
      await courseService.submitForReview(courseId, user || undefined);
      toast('Course Submitted for Review', 'Syllabus and modules sent to Admin Moderation queue.', 'course');
      await loadData();
    } catch (err: any) {
      toast('Submission Error', err?.message || 'Failed to submit course.', 'system');
    }
  };

  // Grading Handlers
  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.marksObtained || 95);
    setFeedbackInput(sub.feedback || 'Great implementation! Code is well-structured and handles edge cases.');
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    setIsGrading(true);
    try {
      await assignmentService.gradeSubmission(
        selectedSubmission.id,
        gradeInput,
        feedbackInput,
        user?.name || 'Dr. Sarah Chen'
      );
      toast('Grade Saved & Dispatched', `Awarded ${gradeInput}/${selectedSubmission.maxMarks} to ${selectedSubmission.studentName}.`, 'assignment');
      setSelectedSubmission(null);
      await loadData();
    } catch {
      toast('Error saving grade', 'Please try again.', 'system');
    } finally {
      setIsGrading(false);
    }
  };

  // Resource Access Override Handlers
  const handleGrantOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const targetStudent = students.find((s) => s.id === overrideStudentId) || students[0];
      await resourceOverrideService.grantOverride(
        {
          studentId: targetStudent?.id || 'usr_8829',
          studentName: targetStudent?.name || 'Alex Rivera',
          studentEmail: targetStudent?.email || 'alex.rivera@tyc.dev',
          resourceTitle: overrideResourceTitle,
          resourceType: overrideResourceType,
          reason: overrideReason,
          expiryDate: overrideExpiryDate
        },
        user || undefined
      );

      toast('Resource Access Granted', `Temporary access issued until ${overrideExpiryDate}.`, 'system');
      setIsOverrideModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to grant resource access.', 'system');
    }
  };

  const handleRevokeOverride = async (overrideId: string) => {
    try {
      await resourceOverrideService.revokeOverride(overrideId, user || undefined);
      toast('Access Revoked', 'Resource access has been revoked.', 'system');
      await loadData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to revoke override.', 'system');
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter =
      filterTab === 'all' ? true : filterTab === 'pending' ? s.status === 'pending' : s.status === 'reviewed';
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Faculty Mentorship & Assignment Evaluation Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Grade submissions, manage course syllabi, and issue temporary student compute resources.
          </p>
        </div>

        {activeTab === 'overrides' && (
          <Button variant="primary" size="sm" onClick={() => setIsOverrideModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Grant Resource Access
          </Button>
        )}
      </div>

      {/* Primary KPI Stats */}
      {(activeTab === 'overview' || activeTab === 'submissions') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Submissions"
            value={submissions.filter((s) => s.status === 'pending').length.toString()}
            subtitle="Require code review"
            icon={<FileCheck className="w-5 h-5 text-purple-500" />}
            iconBgColor="purple"
          />

          <StatCard
            title="Assigned Students"
            value={students.length.toString()}
            subtitle="Across 2 Masterclasses"
            icon={<Users className="w-5 h-5 text-blue-500" />}
            iconBgColor="blue"
          />

          <StatCard
            title="Reviewed Assignments"
            value={submissions.filter((s) => s.status === 'reviewed').length.toString()}
            subtitle="Evaluated this term"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            iconBgColor="green"
          />

          <StatCard
            title="Active Resource Overrides"
            value={overrides.filter((o) => o.status === 'active').length.toString()}
            subtitle="GPU & Course Grants"
            icon={<KeyRound className="w-5 h-5 text-amber-500" />}
            iconBgColor="orange"
          />
        </div>
      )}

      {/* OVERVIEW TAB: Courses & Submissions Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Assigned Courses & Submission Governance */}
          <Card className="lg:col-span-7 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                My Authored Courses & Moderation Status
              </h3>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 4).map((course) => (
                <div key={course.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{course.title}</h4>
                      <span className="text-[11px] text-slate-400">{course.modules?.length || 0} Modules &bull; {course.lessonsCount || 0} Lessons</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      course.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      course.status === 'submitted_for_review' ? 'bg-amber-100 text-amber-700' :
                      course.status === 'changes_requested' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>

                  {course.reviewNotes && (
                    <div className="text-[11px] text-orange-600 bg-orange-50 dark:bg-orange-950/40 p-2 rounded-lg">
                      Admin Notes: "{course.reviewNotes}"
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    {(course.status === 'draft' || course.status === 'changes_requested') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSubmitCourseForReview(course.id)}
                        className="text-[11px]"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Submit for Admin Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Grading Backlog */}
          <Card className="lg:col-span-5 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Grading Backlog
              </h3>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
              {submissions.filter((s) => s.status === 'pending').map((sub) => (
                <div key={sub.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{sub.studentName}</span>
                    <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{sub.assignmentTitle}</div>
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" onClick={() => handleOpenGradeModal(sub)} className="text-[11px]">
                      Grade Submission
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SUBMISSIONS & GRADING TAB */}
      {activeTab === 'submissions' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'pending'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending Review ({submissions.filter((s) => s.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('reviewed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'reviewed'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Reviewed ({submissions.filter((s) => s.status === 'reviewed').length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredSubmissions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{sub.studentName}</span>
                    <span className="text-[10px] text-slate-400">&bull; {sub.studentEmail}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{sub.assignmentTitle}</div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    {sub.submissionUrl && (
                      <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline flex items-center gap-1">
                        Repository / Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {sub.status === 'reviewed' ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 block">{sub.marksObtained} / {sub.maxMarks} Marks</span>
                      <span className="text-[10px] text-slate-400">Reviewed by {sub.reviewedBy}</span>
                    </div>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleOpenGradeModal(sub)}>
                      Grade Code
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ASSIGNED STUDENTS TAB */}
      {activeTab === 'students' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Learners ({students.length})</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Learner Name</th>
                  <th className="pb-3">Institution</th>
                  <th className="pb-3">Streak</th>
                  <th className="pb-3 pr-2 text-right">Enrolled Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">{student.name}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{student.college || 'Stanford Partner'}</td>
                    <td className="py-3 text-amber-500 font-bold">🔥 {student.streakDays || 1} Days</td>
                    <td className="py-3 pr-2 text-right font-semibold">{student.enrolledCourseIds?.length || 2} Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* RESOURCE ACCESS OVERRIDES TAB */}
      {activeTab === 'overrides' && (
        <Card className="p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              Temporary Student Resource Access Overrides
            </h3>
            <p className="text-xs text-slate-500">
              Grant temporary DataLab GPU cluster or sandbox resource clearance with automatic expiration.
            </p>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Student</th>
                  <th className="pb-3">Resource Target</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Expires On</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {overrides.map((ovr) => (
                  <tr key={ovr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">{ovr.studentName}</td>
                    <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">{ovr.resourceTitle}</td>
                    <td className="py-3.5 text-slate-500 text-[11px] max-w-xs truncate">{ovr.reason}</td>
                    <td className="py-3.5 font-mono text-slate-500">{ovr.expiryDate}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ovr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {ovr.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      {ovr.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeOverride(ovr.id)}
                          className="text-[11px] text-rose-500 border-rose-200 hover:bg-rose-50"
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: Grade Submission */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="Grade Assignment Submission"
      >
        {selectedSubmission && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <div><strong>Student:</strong> {selectedSubmission.studentName}</div>
              <div><strong>Assignment:</strong> {selectedSubmission.assignmentTitle}</div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Marks Obtained (Max: {selectedSubmission.maxMarks})
              </label>
              <Input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(Number(e.target.value))}
                min={0}
                max={selectedSubmission.maxMarks}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Faculty Feedback
              </label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveGrade} isLoading={isGrading}>
                Submit Grade & Feedback
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Grant Resource Access */}
      <Modal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        title="Issue Temporary Resource Access"
      >
        <form onSubmit={handleGrantOverride} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Student</label>
            <select
              value={overrideStudentId}
              onChange={(e) => setOverrideStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Resource</label>
            <Input
              value={overrideResourceTitle}
              onChange={(e) => setOverrideResourceTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Resource Type</label>
              <select
                value={overrideResourceType}
                onChange={(e) => setOverrideResourceType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="datalab">Cloud DataLab GPU</option>
                <option value="course">Premium Course Track</option>
                <option value="sandbox">Kubernetes Sandbox</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiration Date</label>
              <Input
                type="date"
                value={overrideExpiryDate}
                onChange={(e) => setOverrideExpiryDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Override Reason</label>
            <Input
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Capstone ML training requirement"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsOverrideModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Grant Temporary Access
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
