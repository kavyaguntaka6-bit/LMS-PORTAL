import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Award,
  Flame,
  MoreVertical,
  Mail,
  UserCheck,
  Download,
  UserPlus,
  Filter,
  Ban,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  careerGoal: string;
  streak: number;
  coursesEnrolled: number;
  certificates: number;
  status: 'Active' | 'Under Review' | 'Graduated' | 'Suspended';
  avatar: string;
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'usr_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@tyc.dev',
    careerGoal: 'Full Stack AI Developer',
    streak: 14,
    coursesEnrolled: 3,
    certificates: 2,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@tyc.dev',
    careerGoal: 'Full Stack Engineer',
    streak: 28,
    coursesEnrolled: 4,
    certificates: 3,
    status: 'Graduated',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_3',
    name: 'Priya Sharma',
    email: 'priya.sharma@tyc.dev',
    careerGoal: 'AI / ML Engineer',
    streak: 19,
    coursesEnrolled: 2,
    certificates: 1,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_4',
    name: 'David Kim',
    email: 'david.kim@tyc.dev',
    careerGoal: 'Cloud Platform Engineer',
    streak: 8,
    coursesEnrolled: 2,
    certificates: 1,
    status: 'Under Review',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
];

export const StudentsManagerPage: React.FC = () => {
  const { toast } = useNotifications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StudentRecord['status']>('All');
  
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const stored = localStorage.getItem('tyc_students');
      return stored ? JSON.parse(stored) : DEFAULT_STUDENTS;
    } catch {
      return DEFAULT_STUDENTS;
    }
  });

  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTrack, setNewTrack] = useState('Full Stack AI Developer');

  const saveStudents = (list: StudentRecord[]) => {
    setStudents(list);
    try {
      localStorage.setItem('tyc_students', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = students.map(s => {
      if (s.id === id) {
        const nextStatus: StudentRecord['status'] = s.status === 'Active' ? 'Suspended' : 'Active';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    saveStudents(updated);
    toast('Student Status Updated', 'Learner permissions synchronized across gateway.', 'system');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newStudent: StudentRecord = {
      id: `usr_${Date.now()}`,
      name: newName,
      email: newEmail,
      careerGoal: newTrack,
      streak: 1,
      coursesEnrolled: 1,
      certificates: 0,
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newName)}`
    };

    const updated = [newStudent, ...students];
    saveStudents(updated);
    toast('Student Enrolled', `${newName} added to platform directory.`, 'course');
    setAddStudentModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Career Track', 'Streak Days', 'Courses Enrolled', 'Certificates', 'Status'];
    const rows = students.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.careerGoal}"`,
      s.streak,
      s.coursesEnrolled,
      s.certificates,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tyc_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Export Generated', 'Student telemetry downloaded as CSV.', 'system');
  };

  const filtered = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.careerGoal.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-tyc-text dark:text-white">Student Directory & Governance</h1>
          <p className="text-xs text-tyc-muted dark:text-gray-400">Inspect learner progress, verified credentials, and capstone submissions.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="dark:border-gray-700">
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAddStudentModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-1" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#151916] p-3 rounded-xl border border-tyc-border dark:border-gray-800">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search students by name, email, track..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['All', 'Active', 'Under Review', 'Graduated', 'Suspended'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-tyc-green text-white font-bold'
                  : 'text-tyc-muted dark:text-gray-300 hover:bg-tyc-bg dark:hover:bg-gray-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <Card className="p-0 overflow-hidden shadow-subtle border-tyc-border dark:border-gray-800 dark:bg-[#151916]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-tyc-bg dark:bg-gray-800/80 border-b border-tyc-border dark:border-gray-700 text-tyc-muted dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-4 py-3">Career Track</th>
                <th className="px-4 py-3">Daily Streak</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Certificates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tyc-border/60 dark:divide-gray-800/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-tyc-bg/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img src={s.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-tyc-border dark:border-gray-700" />
                    <div>
                      <div className="font-bold text-tyc-text dark:text-white">{s.name}</div>
                      <div className="text-[11px] text-tyc-muted dark:text-gray-400">{s.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-tyc-text dark:text-gray-200">{s.careerGoal}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 font-bold text-tyc-orange">
                      <Flame className="w-3.5 h-3.5 fill-tyc-orange" /> {s.streak}d
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-tyc-muted dark:text-gray-400">{s.coursesEnrolled} active</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="green" size="sm">
                      <Award className="w-3 h-3 mr-1" /> {s.certificates} Verified
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={s.status === 'Graduated' ? 'green' : s.status === 'Active' ? 'green' : s.status === 'Suspended' ? 'gray' : 'orange'}
                      size="sm"
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] py-1 px-2.5 dark:border-gray-700"
                      onClick={() => handleToggleStatus(s.id)}
                      title={s.status === 'Active' ? 'Suspend Student' : 'Reactivate Student'}
                    >
                      {s.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-[11px] py-1 px-2.5"
                      onClick={() => toast('Profile Inspected', `Loaded ${s.name}'s telemetry audit report.`, 'system')}
                    >
                      Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={addStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        title="Enroll New Student"
        description="Register a new learner to the platform directory"
        maxWidth="md"
      >
        <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Marcus Vance"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="marcus.vance@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <div>
            <label className="block font-medium text-tyc-text dark:text-gray-300 mb-1">Career Goal / Track</label>
            <select
              value={newTrack}
              onChange={(e) => setNewTrack(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-tyc-border dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-tyc-text dark:text-gray-100 focus:outline-none"
            >
              <option value="Full Stack AI Developer">Full Stack AI Developer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
              <option value="Cloud Platform Engineer">Cloud Platform Engineer</option>
              <option value="Backend Architect">Backend Architect</option>
              <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-tyc-border dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={() => setAddStudentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
