import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  careerService,
  certificateService,
  financeService
} from '../../services/api';
import {
  JobOpportunity,
  Certificate,
  RefundRequest
} from '../../types';
import {
  Users,
  BookOpen,
  Sparkles,
  Activity,
  Briefcase,
  Award,
  DollarSign,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Plus,
  Search,
  Check,
  X,
  FileCheck,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/shared/StatCard';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { mockAdminStats } from '../../services/mockData';

interface AdminDashboardProps {
  initialTab?: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useNotifications();

  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/career')) return 'career';
    if (path.includes('/admin/certificates')) return 'certificates';
    if (path.includes('/admin/finance')) return 'finance';
    if (path.includes('/admin/analytics')) return 'analytics';
    return 'overview';
  };

  const activeTab = getTabFromPath();

  // State
  const [jobsList, setJobsList] = useState<JobOpportunity[]>([]);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Issue Certificate Modal State
  const [isIssueCertModalOpen, setIsIssueCertModalOpen] = useState(false);
  const [certStudentName, setCertStudentName] = useState('');
  const [certCourseTitle, setCertCourseTitle] = useState('Full Stack AI Engineering Masterclass');
  const [certGrade, setCertGrade] = useState('A+ (Distinction)');

  // Refund Review State
  const [selectedRefundForReview, setSelectedRefundForReview] = useState<RefundRequest | null>(null);
  const [refundNotes, setRefundNotes] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [jobs, certs, refunds] = await Promise.all([
        careerService.getJobs(),
        certificateService.getCertificates(),
        financeService.getRefundRequests(user?.department, user || undefined)
      ]);
      setJobsList(jobs);
      setCertificatesList(certs);
      setRefundRequests(refunds);
    } catch (err) {
      console.error('Error loading admin operations data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Career Job Handlers
  const handleApproveJob = async (jobId: string) => {
    try {
      await careerService.approveJob(jobId, user || undefined);
      toast('Job Posting Approved', 'Job posting is now visible in the student career board.', 'system');
      await loadAdminData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to approve job.', 'system');
    }
  };

  const handleRejectJob = async (jobId: string) => {
    const reason = prompt('Please specify a rejection reason:');
    if (reason === null) return;
    try {
      await careerService.rejectJob(jobId, reason || 'Did not meet quality standards', user || undefined);
      toast('Job Posting Rejected', 'Listing rejected and removed.', 'system');
      await loadAdminData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to reject job.', 'system');
    }
  };

  // Certificate Handlers
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudentName.trim()) return;
    try {
      const newCert = await certificateService.issueCertificate(
        {
          studentName: certStudentName,
          courseTitle: certCourseTitle,
          grade: certGrade
        },
        user || undefined
      );
      toast('Certificate Issued', `Credential ID: ${newCert.certificateId} issued to ${newCert.studentName}.`, 'system');
      setIsIssueCertModalOpen(false);
      setCertStudentName('');
      await loadAdminData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to issue certificate.', 'system');
    }
  };

  const handleRevokeCertificate = async (certId: string) => {
    const reason = prompt('Reason for certificate revocation:');
    if (!reason) return;
    try {
      await certificateService.revokeCertificate(certId, reason, user || undefined);
      toast('Certificate Revoked', 'Credential marked revoked and invalidated from public ledger.', 'system');
      await loadAdminData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to revoke certificate.', 'system');
    }
  };

  // Refund Handlers
  const handleProcessRefund = async (decision: 'approved' | 'rejected') => {
    if (!selectedRefundForReview) return;
    try {
      if (decision === 'approved') {
        await financeService.approveRefund(selectedRefundForReview.id, refundNotes || 'Approved by Admin', user || undefined);
        toast('Refund Approved', `Payout queued for ${selectedRefundForReview.studentName}.`, 'system');
      } else {
        await financeService.rejectRefund(selectedRefundForReview.id, refundNotes || 'Rejected by Admin', user || undefined);
        toast('Refund Rejected', 'Request rejected with review notes.', 'system');
      }
      setSelectedRefundForReview(null);
      setRefundNotes('');
      await loadAdminData();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to process refund.', 'system');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview / Analytics KPI Cards */}
      {(activeTab === 'overview' || activeTab === 'analytics') && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.department || 'Department Operations'} Console
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Departmental student enrollment, curriculum throughput, and academic moderation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="green" size="md" dot>Department Operational</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Department Students"
              value={mockAdminStats.totalStudents.toLocaleString()}
              subtitle="Enrolled Learners"
              trend={{ value: '14.2%', isPositive: true }}
              icon={<Users className="w-5 h-5 text-emerald-500" />}
              iconBgColor="green"
            />

            <StatCard
              title="Assigned Courses"
              value={mockAdminStats.totalEnrollments.toLocaleString()}
              subtitle="Active Department Syllabus"
              trend={{ value: '18.6%', isPositive: true }}
              icon={<BookOpen className="w-5 h-5 text-emerald-500" />}
              iconBgColor="green"
            />

            <StatCard
              title="Completion Rate"
              value={mockAdminStats.completionRate}
              subtitle="Target: 80% benchmark"
              trend={{ value: '4.8%', isPositive: true }}
              icon={<Activity className="w-5 h-5 text-orange-500" />}
              iconBgColor="orange"
            />

            <StatCard
              title="Pending Moderation"
              value={`${refundRequests.filter((r) => r.status === 'pending').length + jobsList.filter((j) => !j.applied).length}`}
              subtitle="Refunds & Job Reviews"
              icon={<Clock className="w-5 h-5 text-purple-500" />}
              iconBgColor="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Enrollment & Completion Velocity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tracking throughput from signup to capstone completion</p>
                </div>
                <Badge variant="green" size="sm">H1 2026 Growth</Badge>
              </div>

              <div className="space-y-4 pt-4">
                {mockAdminStats.monthlyEnrollmentData.map((item) => (
                  <div key={item.month} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.month} 2026</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        <strong className="text-slate-900 dark:text-white">{item.enrollments.toLocaleString()}</strong> Enrolled &bull; <strong className="text-emerald-600 dark:text-emerald-400">{item.completions.toLocaleString()}</strong> Completed
                      </span>
                    </div>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(item.enrollments / 10000) * 100}%` }}
                      />
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${(item.completions / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-5 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Popular Department Modules</h3>
              <div className="space-y-3">
                {mockAdminStats.popularCourses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</div>
                      <div className="text-[11px] text-slate-400">{c.students.toLocaleString()} Students Enrolled</div>
                    </div>
                    <Badge variant="cyan" size="sm">★ {c.rating}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Career Board Approvals Tab */}
      {activeTab === 'career' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500" />
                Industry Job Board Moderation
              </h3>
              <p className="text-xs text-slate-500">
                Review and approve corporate partner job listings before publishing to student portals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsList.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      {job.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {job.salaryOrStipend || 'Competitive'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{job.title}</h4>
                  <div className="text-xs text-slate-500 font-semibold">{job.company} &bull; {job.location}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{job.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRejectJob(job.id)} className="text-rose-500">
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleApproveJob(job.id)}>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve Listing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Certificates Compliance Tab */}
      {activeTab === 'certificates' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Certificate Governance & Issuance
              </h3>
              <p className="text-xs text-slate-500">
                Issue cryptographic course completion certificates and manage revocations.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => setIsIssueCertModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Issue Verified Certificate
            </Button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Credential ID</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Course Title</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3">Issued Date</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {certificatesList.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {cert.certificateId}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                      {cert.studentName}
                    </td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300">
                      {cert.courseTitle}
                    </td>
                    <td className="py-3.5 font-bold text-emerald-600">
                      {cert.grade}
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {cert.issuedDate}
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeCertificate(cert.certificateId)}
                        className="text-[11px] text-rose-500 border-rose-200 hover:bg-rose-50"
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Department Finance & Refunds Tab */}
      {activeTab === 'finance' && (
        <Card className="p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Department Financial Moderation & Refund Approvals
            </h3>
            <p className="text-xs text-slate-500">
              Oversee departmental enrollment revenues and review student refund claims.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Pending Refund Requests ({refundRequests.filter((r) => r.status === 'pending').length})
            </h4>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 pl-2">Refund ID</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {refundRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-slate-500">{req.id}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{req.studentName}</td>
                      <td className="py-3.5 text-slate-700 dark:text-slate-300">{req.courseTitle}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {req.currency === 'INR' ? '₹' : '$'}{req.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-slate-500 text-[11px] max-w-xs truncate">{req.reason}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        {req.status === 'pending' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedRefundForReview(req); setRefundNotes(''); }}
                            className="text-[11px]"
                          >
                            Review Claim
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Modal: Issue Certificate */}
      <Modal
        isOpen={isIssueCertModalOpen}
        onClose={() => setIsIssueCertModalOpen(false)}
        title="Issue Verified Credential"
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Student Full Name</label>
            <Input
              value={certStudentName}
              onChange={(e) => setCertStudentName(e.target.value)}
              placeholder="e.g. Maya Lin"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Title</label>
            <Input
              value={certCourseTitle}
              onChange={(e) => setCertCourseTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Award Grade</label>
            <select
              value={certGrade}
              onChange={(e) => setCertGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="A+ (Distinction)">A+ (Distinction)</option>
              <option value="A (Excellence)">A (Excellence)</option>
              <option value="B+ (Proficient)">B+ (Proficient)</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsIssueCertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Issue Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Review Refund */}
      <Modal
        isOpen={!!selectedRefundForReview}
        onClose={() => setSelectedRefundForReview(null)}
        title="Evaluate Student Refund Claim"
      >
        {selectedRefundForReview && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <div><strong>Student:</strong> {selectedRefundForReview.studentName}</div>
              <div><strong>Course:</strong> {selectedRefundForReview.courseTitle}</div>
              <div><strong>Amount:</strong> {selectedRefundForReview.currency} {selectedRefundForReview.amount.toLocaleString()}</div>
              <div><strong>Claim Reason:</strong> "{selectedRefundForReview.reason}"</div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Decision Notes</label>
              <textarea
                value={refundNotes}
                onChange={(e) => setRefundNotes(e.target.value)}
                placeholder="Specify rationale for approval or rejection..."
                rows={3}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProcessRefund('rejected')}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reject Claim
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleProcessRefund('approved')}
              >
                Approve & Issue Refund
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
