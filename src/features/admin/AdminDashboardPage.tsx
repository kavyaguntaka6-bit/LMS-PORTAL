import React from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  Award,
  FileCheck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Activity,
  Briefcase,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { mockAdminStats } from '../../services/mockData';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-tyc-text">Executive Platform Analytics</h1>
          <p className="text-xs text-tyc-muted">Real-time health, retention metrics, and curriculum throughput.</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" size="md" dot>All Subsystems Operational</Badge>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={mockAdminStats.totalStudents.toLocaleString()}
          subtitle="3,840 Active Today"
          trend={{ value: '14.2%', isPositive: true }}
          icon={<Users className="w-5 h-5 text-tyc-green" />}
          iconBgColor="green"
        />

        <StatCard
          title="Course Enrollments"
          value={mockAdminStats.totalEnrollments.toLocaleString()}
          subtitle="28 Active Curriculums"
          trend={{ value: '18.6%', isPositive: true }}
          icon={<BookOpen className="w-5 h-5 text-tyc-green" />}
          iconBgColor="green"
        />

        <StatCard
          title="Completion Rate"
          value={mockAdminStats.completionRate}
          subtitle="Target: 80% benchmark"
          trend={{ value: '4.8%', isPositive: true }}
          icon={<Activity className="w-5 h-5 text-tyc-orange" />}
          iconBgColor="orange"
        />

        <StatCard
          title="AI Tutor Queries"
          value="18.5k / day"
          subtitle="Average latency: 380ms"
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          iconBgColor="gray"
        />
      </div>

      {/* Enrollment Growth Chart & Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Visual */}
        <Card className="lg:col-span-7 p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-tyc-text">Monthly Enrollment & Completion Velocity</h3>
              <p className="text-xs text-tyc-muted">Tracking throughput from signup to capstone completion</p>
            </div>
            <Badge variant="green" size="sm">H1 2026 Growth</Badge>
          </div>

          <div className="space-y-4 pt-4">
            {mockAdminStats.monthlyEnrollmentData.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-tyc-text">{item.month} 2026</span>
                  <span className="text-tyc-muted">
                    <strong className="text-tyc-text">{item.enrollments.toLocaleString()}</strong> Enrolled &bull; <strong className="text-tyc-green">{item.completions.toLocaleString()}</strong> Completed
                  </span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-tyc-bg border border-tyc-border/40">
                  <div
                    className="bg-tyc-green h-full rounded-full"
                    style={{ width: `${(item.enrollments / 10000) * 100}%` }}
                  />
                  <div
                    className="bg-tyc-orange h-full rounded-full"
                    style={{ width: `${(item.completions / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-tyc-border text-xs text-tyc-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-tyc-green" />
              <span>New Course Enrollments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-tyc-orange" />
              <span>Verified Course Completions</span>
            </div>
          </div>
        </Card>

        {/* Most Popular Courses Table */}
        <Card className="lg:col-span-5 p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-tyc-text">Top Enrolled Masterclasses</h3>
            <span className="text-xs text-tyc-muted">By Active Students</span>
          </div>

          <div className="space-y-3 pt-2">
            {mockAdminStats.popularCourses.map((c, i) => (
              <div key={i} className="p-3 bg-tyc-bg border border-tyc-border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-tyc-text line-clamp-1">{c.title}</div>
                  <div className="text-[11px] text-tyc-muted">{c.students.toLocaleString()} Students Enrolled</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-amber-500">★ {c.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Placements Card */}
          <div className="p-3.5 bg-tyc-green-soft border border-tyc-green/30 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-tyc-green">890 Placements Secured</div>
              <div className="text-[11px] text-tyc-text">Across 42 partner tech firms</div>
            </div>
            <Briefcase className="w-5 h-5 text-tyc-green shrink-0" />
          </div>
        </Card>
      </div>
    </div>
  );
};
