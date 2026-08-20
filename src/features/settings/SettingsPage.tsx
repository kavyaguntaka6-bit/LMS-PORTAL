import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  User as UserIcon,
  Bell,
  Save,
  Globe
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/shared/SocialIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Breadcrumb } from '../../components/shared/Breadcrumb';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useNotifications();

  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || 'Full Stack AI Developer');
  const [bio, setBio] = useState(user?.bio || 'Aspiring Full Stack Engineer passionate about React 19 and generative AI.');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || 'https://github.com/alexrivera-tyc');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || 'https://linkedin.com/in/alexrivera-tech');

  // Preferences checkboxes
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [workshopReminders, setWorkshopReminders] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        careerGoal,
        bio,
        githubUrl,
        linkedinUrl
      });
      toast('Settings Saved', 'Your profile and learning preferences have been updated.', 'system');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Account Settings' }]} />
        <h1 className="text-2xl font-bold text-tyc-text tracking-tight">Account & Learning Settings</h1>
        <p className="text-xs text-tyc-muted">Manage your public profile, career targets, and telemetry preferences.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Card 1: Personal Info */}
        <Card className="p-6 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 border-b border-tyc-border pb-3">
            <UserIcon className="w-4 h-4 text-tyc-green" />
            <h3 className="text-sm font-bold text-tyc-text">Profile Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || 'alex@tyc.dev'}
              disabled
              helperText="Managed by university / corporate SSO"
            />
          </div>

          <Input
            label="Primary Career Target"
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-tyc-text mb-1">Developer Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs bg-white border border-tyc-border rounded-lg p-3 text-tyc-text focus:outline-none focus:border-tyc-green"
            />
          </div>
        </Card>

        {/* Card 2: Connected Accounts */}
        <Card className="p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2 border-b border-tyc-border pb-3">
            <Globe className="w-4 h-4 text-tyc-orange" />
            <h3 className="text-sm font-bold text-tyc-text">Connected Developer Profiles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              leftIcon={<GithubIcon className="w-4 h-4" />}
            />
            <Input
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              leftIcon={<LinkedinIcon className="w-4 h-4" />}
            />
          </div>
        </Card>

        {/* Card 3: Notification Preferences */}
        <Card className="p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2 border-b border-tyc-border pb-3">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-tyc-text">Notification Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-tyc-border text-tyc-green focus:ring-tyc-green"
              />
              <span className="text-tyc-text">Weekly Tech Dispatch & Architecture Breakdowns</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={workshopReminders}
                onChange={(e) => setWorkshopReminders(e.target.checked)}
                className="rounded border-tyc-border text-tyc-green focus:ring-tyc-green"
              />
              <span className="text-tyc-text">Live Masterclass & Hackathon Kickoff Reminders</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={(e) => setJobAlerts(e.target.checked)}
                className="rounded border-tyc-border text-tyc-green focus:ring-tyc-green"
              />
              <span className="text-tyc-text">Hiring Partner Matching Alerts (90%+ match)</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Profile & Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
