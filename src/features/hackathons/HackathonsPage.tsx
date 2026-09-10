import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useLMS } from '../../context/LMSContext';
import { hackathonService } from '../../services/api';
import {
  Trophy,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Medal,
  Layers,
  Code2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockHackathons } from '../../services/mockData';
import { Hackathon } from '../../types';

export const HackathonsPage: React.FC = () => {
  const { toast } = useNotifications();
  const { triggerCelebration } = useLMS();
  const [hackathons, setHackathons] = useState<Hackathon[]>(mockHackathons);

  const hack = hackathons[0];

  const handleRegister = async () => {
    await hackathonService.register(hack.id);
    setHackathons(prev => prev.map(h => h.id === hack.id ? { ...h, isRegistered: true, participantsCount: h.participantsCount + 1 } : h));
    triggerCelebration();
    toast('Registered for Hackathon!', 'You are enrolled in the global sprint.', 'hackathon');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Global Hackathons' }]} />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Global Engineering Hackathons
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Build high-impact AI, Full-stack, and Systems software in 48-hour sprints with developer teams worldwide.
        </p>
      </div>

      {/* Featured Hackathon Banner */}
      <div className="bg-white dark:bg-[#0D121F] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="relative aspect-[16/9] lg:aspect-auto bg-slate-900 overflow-hidden">
          <img src={hack.banner} alt={hack.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute top-4 left-4">
            <Badge variant="orange" size="sm">{hack.status} Hackathon</Badge>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Prize Pool: {hack.prizePool}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{hack.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hack.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-gradient-to-r from-orange-50/80 via-emerald-50/80 to-amber-50/80 dark:from-[#161F30] dark:via-[#161F30] dark:to-[#161F30] rounded-2xl border border-orange-200/80 dark:border-slate-800 text-center text-xs">
            <div>
              <div className="text-base font-black text-slate-900 dark:text-white">{hack.participantsCount.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Hackers Registered</div>
            </div>
            <div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{hack.teamsCount}</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Teams Formed</div>
            </div>
            <div>
              <div className="text-base font-black text-orange-600 dark:text-orange-400">{hack.startDate}</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Kickoff Date</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Eligibility: {hack.eligibility}</span>
            {hack.isRegistered ? (
              <Badge variant="green" size="md">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Enrolled in Hackathon
              </Badge>
            ) : (
              <Button variant="primary" size="md" onClick={handleRegister} className="shadow-md">
                Register for Hackathon
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tracks & Judges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 bg-emerald-50/70 dark:bg-[#0D121F] border-emerald-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Submission Challenge Tracks</h3>
          </div>
          <div className="space-y-2.5">
            {hack.problemStatements.map((t) => (
              <div key={t.id} className="p-3 bg-white/90 dark:bg-[#161F30] rounded-xl border border-emerald-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs">
                <span>{t.track}: {t.title}</span>
                <Badge variant="green" size="sm">Open</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-amber-50/70 dark:bg-[#0D121F] border-amber-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Evaluation Criteria</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <div className="flex items-start gap-2">
              <span className="font-black text-emerald-600 dark:text-emerald-400">40%</span>
              <span><strong>Architectural Rigor:</strong> Clean code, unit tests, and production error handling.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-black text-emerald-600 dark:text-emerald-400">30%</span>
              <span><strong>Impact & Novelty:</strong> Originality of the problem statement addressed.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-black text-emerald-600 dark:text-emerald-400">30%</span>
              <span><strong>Working Demo:</strong> Public GitHub repository and live deployed link.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
