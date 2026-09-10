import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { workshopService } from '../../services/api';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/shared/Breadcrumb';
import { mockWorkshops } from '../../services/mockData';
import { Workshop } from '../../types';

export const WorkshopsPage: React.FC = () => {
  const { toast } = useNotifications();
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);

  const handleRegister = async (wsId: string) => {
    await workshopService.register(wsId);
    setWorkshops(prev => prev.map(w => w.id === wsId ? { ...w, isRegistered: true, registeredCount: w.registeredCount + 1 } : w));
    toast('RSVP Confirmed!', 'Calendar invite & meeting link sent to your email.', 'workshop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: 'Live Masterclasses' }]} />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Live Engineering Masterclasses
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Interactive weekend deep-dives with principal staff engineers breaking down production systems architecture and real-time live coding.
        </p>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map((ws) => (
          <Card key={ws.id} className="p-6 space-y-5 shadow-sm dark:shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="green" size="sm">Live Session</Badge>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Free for TYC Members</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{ws.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ws.description}</p>

              {/* Speaker */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#161F30] rounded-2xl border border-slate-200 dark:border-slate-800">
                <img
                  src={ws.instructorAvatar}
                  alt={ws.instructorName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{ws.instructorName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{ws.instructorRole}</div>
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span>{ws.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{ws.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{ws.registeredCount} / {ws.capacity} Seats Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>{ws.resourcesCount} Code Assets Included</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {ws.isRegistered ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are Registered! Access Link Sent.</span>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => handleRegister(ws.id)}>
                  Reserve Free Seat
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
