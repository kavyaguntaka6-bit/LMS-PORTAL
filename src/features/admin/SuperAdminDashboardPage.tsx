import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { authService, tenantService, financeService } from '../../services/api';
import { rbacService, ALL_PERMISSION_GROUPS } from '../../services/rbacService';
import { auditService } from '../../services/auditService';
import {
  User,
  UserRole,
  AuditLogEntry,
  RoleDefinition,
  Permission,
  Organization
} from '../../types';
import {
  Crown,
  ShieldCheck,
  Users,
  Activity,
  Server,
  Database,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Terminal,
  Cpu,
  KeyRound,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit2,
  Copy,
  DollarSign,
  ScrollText,
  Sliders,
  Download,
  Building2,
  ShieldAlert,
  Save,
  Check,
  X,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { StatCard } from '../../components/shared/StatCard';

interface SuperAdminDashboardProps {
  initialTab?: string;
}

export const SuperAdminDashboardPage: React.FC<SuperAdminDashboardProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useNotifications();

  // Resolve active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/super-admin/rbac')) return 'rbac';
    if (path.includes('/super-admin/users')) return 'users';
    if (path.includes('/super-admin/audit') || path.includes('/super-admin/logs')) return 'audit';
    if (path.includes('/super-admin/security')) return 'security';
    if (path.includes('/super-admin/finance')) return 'finance';
    if (path.includes('/super-admin/settings')) return 'settings';
    return 'overview';
  };

  const activeTab = getTabFromPath();

  // State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [rolesList, setRolesList] = useState<RoleDefinition[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [financeStats, setFinanceStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // User Management State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [newUserDept, setNewUserDept] = useState('Computer Science & AI');
  const [newUserPassword, setNewUserPassword] = useState('Admin@123');

  // RBAC Role Builder State
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleDefinition | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDesc, setRoleFormDesc] = useState('');
  const [roleFormPermissions, setRoleFormPermissions] = useState<Permission[]>([]);

  // Audit Search State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('all');

  // Finance & Stripe State
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_live_TYC_9924881029487192847192');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_live_TYC_3847291048291048');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [isSavingFinance, setIsSavingFinance] = useState(false);

  // Multi-Tenant State
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [newOrgTier, setNewOrgTier] = useState<Organization['tier']>('Enterprise');
  const [newOrgMaxStudents, setNewOrgMaxStudents] = useState(2500);

  const loadAllTelemetry = async () => {
    setIsLoading(true);
    try {
      const [allUsers, allRoles, allLogs, allOrgs, finance] = await Promise.all([
        authService.getAllUsers(),
        rbacService.getRoles(),
        auditService.getScopedLogs(user, 100),
        tenantService.getOrganizations(),
        financeService.getGlobalFinanceOverview(user)
      ]);
      setUsersList(allUsers);
      setRolesList(allRoles);
      setAuditLogs(allLogs);
      setOrganizations(allOrgs);
      setFinanceStats(finance);
    } catch (err) {
      console.error('Error loading Super Admin telemetry', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllTelemetry();
  }, []);

  // Handlers for User Management
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    try {
      const updated = await authService.updateUserRole(userId, newRole, user || undefined);
      setUsersList(updated);
      toast('Security Clearance Updated', `User role successfully assigned to ${newRole.toUpperCase()}.`, 'system');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to update user role.', 'system');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const updated = await authService.updateUserStatus(userId, nextStatus as any, user || undefined);
      setUsersList(updated);
      toast('Account Status Changed', `User status set to ${nextStatus.toUpperCase()}.`, 'system');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to change status.', 'system');
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await authService.resetUserPassword(userId, user || undefined);
      toast('Password Reset Complete', `Temporary Password generated: ${res.tempPass}`, 'system');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to reset password.', 'system');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently purge this user record?')) return;
    try {
      const updated = await authService.deleteUser(userId, user || undefined);
      setUsersList(updated);
      toast('User Purged', 'User record deleted from directory.', 'system');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to delete user.', 'system');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;
    try {
      await authService.createUser(
        {
          name: newUserName || newUserEmail.split('@')[0],
          email: newUserEmail,
          role: newUserRole,
          department: newUserDept,
          passwordHash: newUserPassword
        },
        user || undefined
      );
      toast('Account Provisioned', `New ${newUserRole.toUpperCase()} account successfully created.`, 'system');
      setIsCreateUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to create user account.', 'system');
    }
  };

  // Handlers for RBAC Role Builder
  const handleOpenRoleEditor = (roleDef?: RoleDefinition) => {
    if (roleDef) {
      setSelectedRoleForEdit(roleDef);
      setRoleFormName(roleDef.name);
      setRoleFormDesc(roleDef.description);
      setRoleFormPermissions([...roleDef.permissions]);
    } else {
      setSelectedRoleForEdit(null);
      setRoleFormName('');
      setRoleFormDesc('');
      setRoleFormPermissions([]);
    }
    setIsRoleModalOpen(true);
  };

  const handleTogglePermission = (permId: Permission) => {
    if (roleFormPermissions.includes(permId)) {
      setRoleFormPermissions(roleFormPermissions.filter((p) => p !== permId));
    } else {
      setRoleFormPermissions([...roleFormPermissions, permId]);
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormName.trim()) return;

    try {
      if (selectedRoleForEdit) {
        rbacService.updateRole(selectedRoleForEdit.id, {
          name: roleFormName,
          description: roleFormDesc,
          permissions: roleFormPermissions
        });
        toast('Role Updated', `Updated permissions matrix for "${roleFormName}".`, 'system');
      } else {
        rbacService.createRole({
          name: roleFormName,
          description: roleFormDesc,
          badge: 'Custom Role',
          badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
          scope: 'DEPARTMENT',
          permissions: roleFormPermissions
        });
        toast('Custom Role Created', `New RBAC role "${roleFormName}" ready for assignment.`, 'system');
      }
      setIsRoleModalOpen(false);
      setRolesList(rbacService.getRoles());
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to save role configuration.', 'system');
    }
  };

  const handleCloneRole = (roleId: string) => {
    try {
      const cloned = rbacService.cloneRole(roleId, `${roleId.toUpperCase()} Copy`);
      setRolesList(rbacService.getRoles());
      toast('Role Cloned', `Cloned role definition "${cloned.name}".`, 'system');
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to clone role.', 'system');
    }
  };

  const handleDeleteRole = (roleId: string) => {
    try {
      rbacService.deleteRole(roleId);
      setRolesList(rbacService.getRoles());
      toast('Role Deleted', 'Custom role purged.', 'system');
    } catch (err: any) {
      toast('Error', err?.message || 'System roles cannot be deleted.', 'system');
    }
  };

  // Handlers for Finance
  const handleSaveFinanceConfig = async () => {
    setIsSavingFinance(true);
    try {
      await financeService.updateStripeConfig(
        { stripeSecretKey, stripePublishableKey, selectedCurrency },
        user || undefined
      );
      toast('Stripe Configuration Saved', 'Production payment pipeline and currency settings updated.', 'system');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to save Stripe credentials.', 'system');
    } finally {
      setIsSavingFinance(false);
    }
  };

  // Handlers for Multi-Tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      await tenantService.createOrganization(
        {
          name: newOrgName,
          slug: newOrgSlug || newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          tier: newOrgTier,
          maxStudents: Number(newOrgMaxStudents)
        },
        user || undefined
      );
      toast('Enterprise Tenant Created', `Partition "${newOrgName}" initialized.`, 'system');
      setIsNewOrgModalOpen(false);
      setNewOrgName('');
      setNewOrgSlug('');
      await loadAllTelemetry();
    } catch (err: any) {
      toast('Error', err?.message || 'Failed to create organization.', 'system');
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.college || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesDept = deptFilter === 'all' || u.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || (u.accountStatus || u.status) === statusFilter;
    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.description.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesAction = auditActionFilter === 'all' || log.action === auditActionFilter;
    return matchesSearch && matchesAction;
  });

  const exportAuditLogsAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tyc_global_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast('Audit Logs Exported', 'Downloaded global audit log archive.', 'system');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Level 1 Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border border-amber-500/30 dark:border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown className="w-56 h-56 text-amber-500" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                  Level 1 Root Command
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Enterprise Super Admin Suite
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Authenticated as <strong className="text-amber-600 dark:text-amber-400">{user?.email}</strong> &bull; Unrestricted Multi-Tenant RBAC Clearance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllTelemetry}
              isLoading={isLoading}
              className="text-xs bg-white dark:bg-[#0F172A] border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Telemetry
            </Button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total User Directory"
          value={usersList.length.toLocaleString()}
          subtitle={`${usersList.filter((u) => u.role === 'student').length} Enrolled Students`}
          icon={<Users className="w-5 h-5 text-emerald-500" />}
          iconBgColor="green"
        />

        <StatCard
          title="Super Admins & Staff"
          value={usersList.filter((u) => u.role === 'owner' || u.role === 'superadmin' || u.role === 'admin').length.toString()}
          subtitle="Operations & Security Tier"
          icon={<Crown className="w-5 h-5 text-amber-500" />}
          iconBgColor="orange"
        />

        <StatCard
          title="Platform GMV Revenue"
          value={`₹${((financeStats?.totalGMV || 48520000) / 10000000).toFixed(2)} Cr`}
          subtitle="INR Multi-Currency Active"
          icon={<DollarSign className="w-5 h-5 text-purple-500" />}
          iconBgColor="purple"
        />

        <StatCard
          title="Tenant Partitions"
          value={organizations.length.toString()}
          subtitle="Isolated Enterprise Tenants"
          icon={<Building2 className="w-5 h-5 text-blue-500" />}
          iconBgColor="blue"
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION: TAB ROUTING CONTENT                                              */}
      {/* ========================================================================= */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Health & Cloud Infrastructure */}
            <Card className="lg:col-span-2 p-6 space-y-6 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Global Cloud Infrastructure</h3>
                    <p className="text-xs text-slate-500">PostgreSQL RLS, Redis Cache & AI Tutor Cluster Status</p>
                  </div>
                </div>
                <Badge variant="green" size="sm" dot>Active 99.99% Uptime</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Database Queries</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">2.4k req/sec</div>
                  <div className="text-[10px] text-emerald-500 font-semibold">Postgres RLS Enforced</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">AI Tutor Engine</div>
                  <div className="text-lg font-black text-purple-600 dark:text-purple-400">Nemotron-3-70B</div>
                  <div className="text-[10px] text-slate-500">380ms avg response latency</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Security Firewall</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">0 Breaches</div>
                  <div className="text-[10px] text-slate-500">Zero Trust RBAC Layer</div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="pt-2 flex flex-wrap gap-2">
                <Button variant="primary" size="sm" onClick={() => navigate('/super-admin/rbac')}>
                  <KeyRound className="w-3.5 h-3.5 mr-1" />
                  Configure RBAC Roles
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/super-admin/users')}>
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Manage Admins & Directory
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/super-admin/audit')}>
                  <ScrollText className="w-3.5 h-3.5 mr-1" />
                  View Audit Logs
                </Button>
              </div>
            </Card>

            {/* Live Security Log Stream */}
            <Card className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Security Logs</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Stream</span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0f1523] border border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {log.target}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. RBAC & PERMISSIONS TAB */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                Role-Based Access Control (RBAC) Matrix Builder
              </h2>
              <p className="text-xs text-slate-500">
                Define security tiers, assign granular permissions, and build custom roles with server-enforced scoping.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={() => handleOpenRoleEditor()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Custom Role
            </Button>
          </div>

          {/* Roles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolesList.map((roleDef) => (
              <Card key={roleDef.id} className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleDef.badgeColor}`}>
                        {roleDef.badge}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {roleDef.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 uppercase font-mono">
                      {roleDef.scope} SCOPE
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                    {roleDef.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Assigned Permissions: <strong className="text-emerald-600 dark:text-emerald-400">{roleDef.permissions.length}</strong>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto no-scrollbar">
                      {roleDef.permissions.slice(0, 6).map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {p}
                        </span>
                      ))}
                      {roleDef.permissions.length > 6 && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                          +{roleDef.permissions.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenRoleEditor(roleDef)}
                    className="text-xs flex-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloneRole(roleDef.id)}
                    className="text-xs"
                    title="Clone Role"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  {!roleDef.isSystem && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRole(roleDef.id)}
                      className="text-xs text-rose-500 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50"
                      title="Delete Role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. USER & ADMIN MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Enterprise Directory & Administrator Governance
                </h3>
                <p className="text-xs text-slate-500">
                  Provision Admins, adjust department scope, suspend accounts, and reset user credentials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" onClick={() => setIsCreateUserModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Provision Admin / User
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Roles</option>
                <option value="owner">Super Admin / Owner</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                <option value="Global Operations">Global Operations</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="suspended">Suspended Accounts</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto no-scrollbar pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 pl-2">User Identity</th>
                    <th className="pb-3">Role & Scope</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Account Status</th>
                    <th className="pb-3 pr-2 text-right">Administrative Actions</th>
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

                      <td className="py-3.5">
                        <select
                          value={u.role}
                          disabled={updatingUserId === u.id || u.role === 'owner'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </td>

                      <td className="py-3.5 text-slate-600 dark:text-slate-300">
                        {u.department || 'Platform Wide'}
                      </td>

                      <td className="py-3.5">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(u.id, u.accountStatus || u.status || 'active')}
                          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold cursor-pointer uppercase transition-colors ${
                            (u.accountStatus || u.status) === 'suspended' || (u.accountStatus || u.status) === 'inactive'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 border border-rose-300 dark:border-rose-800'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-300 dark:border-emerald-800'
                          }`}
                        >
                          {u.accountStatus || u.status || 'active'}
                        </button>
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(u.id)}
                            className="text-[11px] py-1 px-2 text-slate-600 dark:text-slate-300"
                            title="Reset Password"
                          >
                            Reset Pass
                          </Button>
                          {u.role !== 'owner' && u.role !== 'superadmin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-[11px] py-1 px-2 text-rose-500 border-rose-200 hover:bg-rose-50"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 4. GLOBAL AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-emerald-500" />
                  Global Chronological Audit Explorer
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable audit records tracking all administrative, security, course governance, and payment actions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportAuditLogsAsJSON}>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export Audit Log (JSON)
                </Button>
              </div>
            </div>

            {/* Audit Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs by target, actor, description..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Action Types</option>
                <option value="role_change">Role Clearance Modifications</option>
                <option value="course_approve">Course Approvals</option>
                <option value="job_approve">Career Job Approvals</option>
                <option value="student_csv_import">CSV Bulk Imports</option>
                <option value="resource_override_grant">Resource Overrides</option>
                <option value="system_config_change">Infrastructure & Settings</option>
              </select>
            </div>

            {/* Audit Log Entries Table */}
            <div className="overflow-x-auto no-scrollbar pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 pl-2">Timestamp</th>
                    <th className="pb-3">Actor & Role</th>
                    <th className="pb-3">Action Target</th>
                    <th className="pb-3">Audit Details</th>
                    <th className="pb-3 pr-2 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pl-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                      </td>

                      <td className="py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{log.userName}</div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase">{log.userRole}</span>
                      </td>

                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {log.target}
                      </td>

                      <td className="py-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-md">
                        {log.description}
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 5. GLOBAL FINANCE & STRIPE TAB */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Global Stripe Gateway & Multi-Currency Engine
              </h3>
              <p className="text-xs text-slate-500">
                Root Stripe API configurations, currency settlement (INR/USD), and enterprise pricing rules. (Super Admin Only)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stripe Secret Key (Production)
                  </label>
                  <input
                    type="password"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Platform Settlement Currency
                  </label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Multi-Currency Auto Conversion</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    International payments in USD/EUR are dynamically converted at spot rate into INR platform payouts.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveFinanceConfig}
                isLoading={isSavingFinance}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Stripe Credentials
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 6. MULTI-TENANT & SETTINGS TAB */}
      {(activeTab === 'settings' || activeTab === 'security') && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6 bg-white dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Multi-Tenant Partitioning & Organization Allocations
                </h3>
                <p className="text-xs text-slate-500">
                  Provision isolated tenant workspaces with dedicated quotas and department administrators.
                </p>
              </div>

              <Button variant="primary" size="sm" onClick={() => setIsNewOrgModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Create Enterprise Tenant
              </Button>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizations.map((org) => (
                <div key={org.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{org.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">Slug: {org.slug}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {org.tier}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Student Capacity</span>
                      <strong className="text-slate-900 dark:text-white">{org.studentCount} / {org.maxStudents}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Departments</span>
                      <strong className="text-slate-900 dark:text-white">{org.departments?.length || 2} Active</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: CREATE USER, RBAC ROLE BUILDER, CREATE ORG                        */}
      {/* ========================================================================= */}

      {/* 1. Create User Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        title="Provision Administrator / User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
            <Input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <Input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="elena.rostova@tyc.dev"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Role Clearance</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="superadmin">Super Admin</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
              <select
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                <option value="Global Operations">Global Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Password</label>
            <Input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. RBAC Role Matrix Builder Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={selectedRoleForEdit ? `Configure Role: ${selectedRoleForEdit.name}` : 'Create Custom RBAC Role'}
      >
        <form onSubmit={handleSaveRole} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Role Name</label>
            <Input
              value={roleFormName}
              onChange={(e) => setRoleFormName(e.target.value)}
              placeholder="e.g. Senior Course Director"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
            <Input
              value={roleFormDesc}
              onChange={(e) => setRoleFormDesc(e.target.value)}
              placeholder="Description of role clearance scope..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Assign Permissions ({roleFormPermissions.length} selected)
            </label>

            {ALL_PERMISSION_GROUPS.map((group) => (
              <div key={group.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>{group.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{group.description}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.permissions.map((perm) => {
                    const isChecked = roleFormPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2 p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : 'bg-white dark:bg-[#0D121F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[11px] truncate">{perm.label}</div>
                          <div className="text-[9.5px] text-slate-400 line-clamp-1">{perm.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Role Matrix
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Create Tenant Modal */}
      <Modal
        isOpen={isNewOrgModalOpen}
        onClose={() => setIsNewOrgModalOpen(false)}
        title="Provision Enterprise Organization Tenant"
      >
        <form onSubmit={handleCreateTenant} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Organization Name</label>
            <Input
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="e.g. Oxford AI Institute"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subdomain Slug</label>
            <Input
              value={newOrgSlug}
              onChange={(e) => setNewOrgSlug(e.target.value)}
              placeholder="oxford-ai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Tier</label>
              <select
                value={newOrgTier}
                onChange={(e) => setNewOrgTier(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Global Partner">Global Partner</option>
                <option value="Academic">Academic</option>
                <option value="Starter">Starter</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Student Quota</label>
              <Input
                type="number"
                value={newOrgMaxStudents}
                onChange={(e) => setNewOrgMaxStudents(Number(e.target.value))}
                min={100}
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewOrgModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision Tenant
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
