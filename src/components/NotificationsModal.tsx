import React from 'react';
import { useCivic } from '../context/CivicContext';
import { Bell, X, Check, ArrowRight } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationsAsRead,
    openDetail,
  } = useCivic();

  if (!isNotificationsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 sm:pr-8 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Civic activity notifications"
      onClick={() => setNotificationsOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-[#0C1320] border border-[rgba(160,190,220,0.14)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,220,0.14)]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#42E8F5]" />
            <h3 className="font-bold text-sm text-[#F4F7FC]">Civic Radar Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-[11px] font-mono text-[#42E8F5] hover:underline flex items-center gap-1"
              aria-label="Mark all notifications as read"
            >
              <Check className="w-3 h-3" />
              <span>Mark read</span>
            </button>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-[#A6B4C8] hover:text-[#F4F7FC] p-1 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="py-2 divide-y divide-[rgba(160,190,220,0.14)] max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#A6B4C8]/70">No alerts right now</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`py-3 px-1 transition-colors ${!n.read ? 'bg-[#42E8F5]/10 border border-[#42E8F5]/25 rounded-lg px-2' : ''}`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A6B4C8] mb-1">
                  <span className="text-[#F4F7FC] font-medium">{n.title}</span>
                  <span className="text-[10px]">{n.date}</span>
                </div>
                <p className="text-xs text-[#A6B4C8] leading-snug">{n.message}</p>
                {n.issueId && (
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      openDetail(n.issueId!);
                    }}
                    className="mt-2 text-[11px] text-[#42E8F5] hover:underline flex items-center gap-1 font-mono font-medium"
                  >
                    <span>Inspect {n.issueId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
