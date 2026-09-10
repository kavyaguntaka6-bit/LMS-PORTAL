import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { authService, cohortService, courseService } from '../../services/api';
import { User, UserRole, Cohort, Course } from '../../types';
import {
  Search,
  UserPlus,
  Crown,
  UploadCloud,
  FileSpreadsheet,
  Users,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { clsx } from 'clsx';

interface StudentsManagerProps {
  initialTab?: string;
}

export const StudentsManagerPage: React.FC<StudentsManagerProps> = () => {
  const location = useLocation();
  const { user: currentUser, isOwner, isSuperAdmin } = useAuth();
  const { toast } = useNotifications();

  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/cohorts')) return 'cohorts';
    if (path.includes('/admin/instructors')) return 'instructors';
    return 'students';
  };

  const activeTab = getTabFromPath();

  // State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [cohortsList, setCohortsList] = useState<Cohort[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>(activeTab === 'instructors' ? 'instructor' : 'All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'suspended'>('All');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState('All');

  // Single User Create Modal
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('student');
  const [formCollege, setFormCollege] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formYear, setFormYear] = useState('3rd Year');
  const [formCohort, setFormCohort] = useState('');

  // CSV Bulk Import Modal
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState(
    'name,email,college,branch,year\nJane Doe,jane.doe@stanford.edu,Stanford University,Computer Science,2nd Year\nJohn Smith,john.smith@berkeley.edu,UC Berkeley,Artificial Intelligence,3rd Year\nAlex Rivera,alex.rivera@mit.edu,MIT,Data Systems,1st Year'
  );
  const [csvCohortId, setCsvCohortId] = useState('');
  const [csvCourseIds, setCsvCourseIds] = useState<string[]>(['crs_1']);
  const [isImporting, setIsImporting] = useState(false);

  // Create Cohort Modal
  const [isCreateCohortModalOpen, setIsCreateCohortModalOpen] = useState(false);
  const [cohortName, setCohortName] = useState('');
  const [cohortCode, setCohortCode] = useState('');
  const [cohortDescription, setCohortDescription] = useState('');
  const [cohortCourseIds, setCohortCourseIds] = useState<string[]>(['crs_1']);
  const [cohortStartDate, setCohortStartDate] = useState('2026-09-01');
  const [cohortEndDate, setCohortEndDate] = useState('2026-12-31');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [allUsers, allCohorts, allCourses] = await Promise.all([
        authService.getAllUsers(),
        cohortService.getCohorts(),
        courseService.getCourses()
      ]);
      setUsersList(allUsers);
      setCohortsList(allCohorts);
      setCoursesList(allCourses);
      if (allCohorts.length > 0 && !csvCohortId) {
        setCsvCohortId(allCohorts[0].id);
      }
    } catch (err) {
      console.error('Error loading student manager data', err);
    }
  };

  const handleToggleStatus = async (targetUser: User) => {
    const current = targetUser.accountStatus || targetUser.status || 'active';
    const nextStatus = current === 'suspended' ? 'active' : 'suspended';
    try {
      await authService.updateUserStatus(targetUser.id, nextStatus as any, currentUser || undefined);
      toast(
        nextStatus === 'active' ? 'Account Activated' : 'Account Suspended',
        `${targetUser.name} status updated to ${nextStatus.toUpperCase()}.`,
        'system'
      );
      await loadAllData();
    } catch (err: any) {
      toast('Update Failed', err?.message || 'Could not update status.', 'system');
    }
  };

  const handleCreateSingleUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    try {
      await authService.createUser(
        {
          name: formName,
          email: formEmail.trim().toLowerCase(),
          role: formRole,
          college: formCollege || 'Stanford Institute of Tech',
          branch: formBranch || 'Computer Science & AI',
          year: formYear,
          department: currentUser?.department || 'Computer Science & AI',
          enrolledCourseIds: formRole === 'student' ? ['crs_1'] : []
        },
        currentUser || undefined
      );

      toast('User Created', `${formName} added to directory.`, 'system');
      setAddUserModalOpen(false);
      setFormName('');
      setFormEmail('');
      await loadAllData();
    } catch (err: any) {
      toast('Creation Failed', err?.message || 'Please verify form fields.', 'system');
    }
  };

  const handleCSVImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    setIsImporting(true);
    try {
      const result = await cohortService.importStudentsFromCSV(
        csvContent,
        csvCohortId || (cohortsList[0]?.id || 'cohort_1'),
        csvCourseIds,
        currentUser || undefined
      );

      toast(
        'CSV Import Complete',
        `Successfully enrolled ${result.importedCount} students. (${result.failedCount} skipped/duplicates).`,
        'system'
      );
      setIsCSVModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      toast('CSV Import Failed', err?.message || 'CSV parse error.', 'system');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohortName.trim()) return;

    try {
      await cohortService.createCohort(
        {
          name: cohortName,
          code: cohortCode || `TYC-${Date.now() % 10000}`,
          description: cohortDescription,
          assignedCourseIds: cohortCourseIds,
          startDate: cohortStartDate,
          endDate: cohortEndDate
        },
        currentUser || undefined
      );

      toast('Cohort Created', `New batch "${cohortName}" initialized.`, 'system');
      setIsCreateCohortModalOpen(false);
      setCohortName('');
      setCohortCode('');
      setCohortDescription('');
      await loadAllData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to create cohort.', 'system');
    }
  };

  // Filter users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.college || '').toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      activeTab === 'instructors'
        ? u.role === 'instructor'
        : roleFilter === 'All'
        ? true
        : u.role === roleFilter;

    const currentStatus = u.accountStatus || u.status || 'active';
    const matchesStatus = statusFilter === 'All' ? true : currentStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {activeTab === 'cohorts' ? (
              <>
                <Layers className="w-5 h-5 text-indigo-500" />
                Student Cohorts & Batches
              </>
            ) : activeTab === 'instructors' ? (
              <>
                <GraduationCap className="w-5 h-5 text-purple-500" />
                Department Faculty & Instructors
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-cyan-500" />
                Student Directory & Enrollment Management
              </>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'cohorts'
              ? 'Organize learners into distinct institutional cohorts and automated syllabus tracks.'
              : 'Enterprise learner directory, CSV bulk provisioning, and cohort assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'cohorts' ? (
            <Button variant="primary" size="sm" onClick={() => setIsCreateCohortModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Cohort
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsCSVModalOpen(true)}>
                <UploadCloud className="w-4 h-4 mr-1.5 text-emerald-500" />
                CSV Bulk Import
              </Button>
              <Button variant="primary" size="sm" onClick={() => setAddUserModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-1.5" />
                Add Student
              </Button>
            </>
          )}
        </div>
      </div>

      {/* COHORTS TAB CONTENT */}
      {activeTab === 'cohorts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohortsList.map((cohort) => (
            <Card key={cohort.id} className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {cohort.code}
                  </span>
                  <Badge variant="green" size="sm">Active Cohort</Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{cohort.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cohort.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Enrolled Students</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{cohort.studentIds.length} Learners</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Tracks</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{cohort.assignedCourseIds.length} Courses</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Start: {cohort.startDate}</span>
                <span>End: {cohort.endDate}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* STUDENTS & INSTRUCTORS TAB CONTENT */}
      {activeTab !== 'cohorts' && (
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, college, branch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {activeTab !== 'instructors' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Roles</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto no-scrollbar pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Learner / Faculty</th>
                  <th className="pb-3">Institution & Branch</th>
                  <th className="pb-3">Enrolled Courses</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 text-slate-700 dark:text-slate-300">
                      <div className="font-semibold">{u.college || 'Stanford Partner Institute'}</div>
                      <div className="text-[10px] text-slate-400">{u.branch || 'Computer Science'} &bull; {u.year || '3rd Year'}</div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {u.enrolledCourseIds?.length || (u.role === 'student' ? 2 : 0)} Courses
                      </span>
                    </td>

                    <td className="py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          (u.accountStatus || u.status) === 'suspended'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}
                      >
                        {u.accountStatus || u.status || 'active'}
                      </button>
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(u)}
                        className="text-[11px]"
                      >
                        {(u.accountStatus || u.status) === 'suspended' ? 'Activate' : 'Suspend'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* CSV Bulk Import Modal */}
      <Modal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        title="CSV Bulk Student Provisioning & Cohort Enrollment"
      >
        <form onSubmit={handleCSVImport} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paste CSV formatted student records. Accounts will be automatically provisioned and assigned to the selected cohort.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Target Student Cohort
            </label>
            <select
              value={csvCohortId}
              onChange={(e) => setCsvCohortId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              {cohortsList.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              CSV Data (Header: name,email,college,branch,year)
            </label>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCSVModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isImporting}>
              Import & Provision Accounts
            </Button>
          </div>
        </form>
      </Modal>

      {/* Single Add Student Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Add Single Learner Account"
      >
        <form onSubmit={handleCreateSingleUser} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Liam Zhang"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <Input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="liam.zhang@stanford.edu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College / University</label>
              <Input
                value={formCollege}
                onChange={(e) => setFormCollege(e.target.value)}
                placeholder="Stanford University"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Academic Year</label>
              <select
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Cohort Modal */}
      <Modal
        isOpen={isCreateCohortModalOpen}
        onClose={() => setIsCreateCohortModalOpen(false)}
        title="Initialize New Student Cohort"
      >
        <form onSubmit={handleCreateCohort} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Cohort Name</label>
            <Input
              value={cohortName}
              onChange={(e) => setCohortName(e.target.value)}
              placeholder="e.g. Fall 2026 AI Fellows Batch"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Cohort Code</label>
            <Input
              value={cohortCode}
              onChange={(e) => setCohortCode(e.target.value)}
              placeholder="TYC-FALL-2026"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
            <Input
              value={cohortDescription}
              onChange={(e) => setCohortDescription(e.target.value)}
              placeholder="Full stack engineering track..."
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateCohortModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Cohort
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
