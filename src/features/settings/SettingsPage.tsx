import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  User as UserIcon,
  Bell,
  Save,
  Globe,
  Sparkles
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/shared/SocialIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Breadcrumb } from '../../components/shared/Breadcrumb';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { setIsOnboardingOpen } = useLMS();
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account & Learning Settings</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Manage your public profile, career targets, and telemetry preferences.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Card 1: Personal Info */}
        <Card className="p-6 space-y-5 shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <UserIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Information</h3>
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
              helperText="Managed by corporate / university SSO"
            />
          </div>

          <Input
            label="Primary Career Target"
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Developer Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </Card>

        {/* Card 2: Connected Accounts */}
        <Card className="p-6 space-y-5 shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Public Links</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Profile URL"
              leftIcon={<GithubIcon className="w-4 h-4" />}
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <Input
              label="LinkedIn Profile URL"
              leftIcon={<LinkedinIcon className="w-4 h-4" />}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
        </Card>

        {/* Card 3: Notification Preferences */}
        <Card className="p-6 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email & Dispatch Alerts</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Assignment Feedback & Marks Dispatches</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Receive emails when an instructor grades your capstone</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={workshopReminders}
                onChange={(e) => setWorkshopReminders(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Live Workshop & Hackathon Reminders</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Get alerted 1 hour before scheduled masterclasses</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={(e) => setJobAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Hiring Partner Matching Alerts</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Get alerted when your skills match a partner job opening</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Card 4: Course Recommendations & Learning Preferences */}
        <Card className="p-6 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personalized Course Recommendations</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Update Preferences & Retake Survey
            </Button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Update your topics of interest, current skill level, and primary career goals. Our recommendation engine will recalculate and suggest tailored courses for your curriculum without affecting already completed courses.
          </p>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
