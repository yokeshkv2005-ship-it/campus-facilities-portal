'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificationsByUser, markNotificationRead, markAllNotificationsRead } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import { PageHeader } from '@/components/ui/SharedComponents';
import { Bell, Check, CheckCheck, BookOpen, AlertTriangle, DollarSign, Calendar, FileText } from 'lucide-react';

export default function NotificationsPage() {
  const { user, refreshUnreadCount } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  if (!user) return null;

  const notifications = getNotificationsByUser(user.user_id);
  const unread = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = (id: number) => {
    markNotificationRead(id);
    refreshUnreadCount();
    setRefreshKey(k => k + 1);
  };

  const handleMarkAll = () => {
    markAllNotificationsRead(user.user_id);
    refreshUnreadCount();
    setRefreshKey(k => k + 1);
  };

  const getIcon = (type: string) => {
    if (type.includes('approved')) return <CheckCheck className="w-5 h-5 text-emerald-500" />;
    if (type.includes('rejected')) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (type.includes('cancelled')) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (type.includes('fine')) return <DollarSign className="w-5 h-5 text-amber-500" />;
    if (type.includes('schedule')) return <Calendar className="w-5 h-5 text-purple-500" />;
    if (type.includes('document')) return <FileText className="w-5 h-5 text-cyan-500" />;
    return <BookOpen className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div key={refreshKey}>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        actions={unread > 0 ? (
          <button onClick={handleMarkAll} className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        ) : undefined}
      />

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No notifications yet</p>
            <p className="text-sm text-slate-400 mt-1">You&apos;ll be notified about booking updates here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className={`px-6 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                onClick={() => !n.is_read && handleMarkRead(n.notification_id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {getIcon(n.notification_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.is_read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                    {!n.is_read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDateTime(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
