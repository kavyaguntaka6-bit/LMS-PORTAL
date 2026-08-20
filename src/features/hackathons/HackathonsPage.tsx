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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-tyc-text tracking-tight">
          Global Engineering Hackathons
        </h1>
        <p className="text-xs sm:text-sm text-tyc-muted max-w-2xl">
          Build high-impact AI, Full-stack, and Systems software in 48-hour sprints with developer teams worldwide.
        </p>
      </div>

      {/* Featured Hackathon Banner */}
      <div className="bg-white border border-tyc-border rounded-2xl overflow-hidden shadow-subtle grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="relative aspect-[16/9] lg:aspect-auto bg-gray-900 overflow-hidden">
          <img src={hack.banner} alt={hack.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute top-4 left-4">
            <Badge variant="orange" size="sm">{hack.status} Hackathon</Badge>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-tyc-orange uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Prize Pool: {hack.prizePool}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-tyc-text">{hack.title}</h2>
            <p className="text-xs text-tyc-muted leading-relaxed">{hack.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-tyc-bg rounded-xl border border-tyc-border text-center text-xs">
            <div>
              <div className="text-base font-bold text-tyc-text">{hack.participantsCount.toLocaleString()}</div>
              <div className="text-[10px] text-tyc-muted">Hackers Registered</div>
            </div>
            <div>
              <div className="text-base font-bold text-tyc-green">{hack.teamsCount}</div>
              <div className="text-[10px] text-tyc-muted">Teams Formed</div>
            </div>
            <div>
              <div className="text-base font-bold text-tyc-orange">{hack.startDate}</div>
              <div className="text-[10px] text-tyc-muted">Kickoff Date</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-tyc-muted font-medium">Eligibility: {hack.eligibility}</span>
            {hack.isRegistered ? (
              <Badge variant="green" size="md">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Enrolled in Hackathon
              </Badge>
            ) : (
              <Button variant="primary" size="md" onClick={handleRegister}>
                Register Team Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column: Problem Statement Tracks on Left, Live Leaderboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tracks */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-tyc-text">Hackathon Problem Tracks</h3>
          <div className="space-y-3">
            {hack.problemStatements.map((ps) => (
              <Card key={ps.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-tyc-text">{ps.title}</h4>
                  <Badge variant="green" size="sm">{ps.track}</Badge>
                </div>
                <p className="text-xs text-tyc-muted leading-relaxed">{ps.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-tyc-text flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-500" />
            Previous Sprint Leaderboard
          </h3>
          <Card className="p-4 divide-y divide-tyc-border/60 space-y-3">
            {hack.leaderboard?.map((item) => (
              <div key={item.rank} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    item.rank === 1 ? 'bg-amber-100 text-amber-700' : item.rank === 2 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    #{item.rank}
                  </span>
                  <div>
                    <div className="font-bold text-tyc-text">{item.teamName}</div>
                    <div className="text-[11px] text-tyc-muted">{item.projectTitle}</div>
                  </div>
                </div>
                <span className="font-bold text-tyc-green">{item.score} / 100</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
