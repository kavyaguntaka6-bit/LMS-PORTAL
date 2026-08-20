import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { X, CheckCheck, Bell, Award, BookOpen, Calendar, Briefcase, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isOpen, setIsOpen } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certificate':
        return <Award className="w-4 h-4 text-tyc-green" />;
      case 'workshop':
      case 'hackathon':
        return <Calendar className="w-4 h-4 text-tyc-orange" />;
      case 'career':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'course':
      case 'quiz':
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-tyc-green" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white border-l border-tyc-border shadow-modal flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-tyc-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-tyc-text" />
              <h3 className="text-sm font-semibold text-tyc-text">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="green" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-[11px] text-tyc-green hover:underline flex items-center gap-1 mr-2 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-tyc-border/60">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-xs text-tyc-muted">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.actionUrl) {
                      setIsOpen(false);
                      navigate(n.actionUrl);
                    }
                  }}
                  className={clsx(
                    'p-4 transition-colors cursor-pointer text-left',
                    n.read ? 'bg-white hover:bg-tyc-bg/60' : 'bg-tyc-green-soft/30 hover:bg-tyc-green-soft/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-tyc-border shrink-0 shadow-subtle">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-tyc-text truncate">{n.title}</span>
                        <span className="text-[10px] text-tyc-muted shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-tyc-muted leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-tyc-border bg-tyc-bg text-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
            >
              Notification Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
