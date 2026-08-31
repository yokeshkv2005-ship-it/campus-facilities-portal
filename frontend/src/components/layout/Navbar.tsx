'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificationsByUser, markNotificationRead, markAllNotificationsRead } from '@/lib/mockData';
import { formatDateTime, getInitials } from '@/lib/utils';
import { Bell, Search, Check, CheckCheck } from 'lucide-react';

export default function Navbar() {
  const { user, unreadCount, refreshUnreadCount } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const notifications = getNotificationsByUser(user.user_id).slice(0, 8);

  const handleMarkRead = (id: number) => {
    markNotificationRead(id);
    refreshUnreadCount();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(user.user_id);
    refreshUnreadCount();
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search facilities, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notification bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.notification_id}
                        className={`px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors ${
                          !notif.is_read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => handleMarkRead(notif.notification_id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${!notif.is_read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{formatDateTime(notif.created_at)}</p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href={user.role === 'admin' ? '/admin/notifications' : '/notifications'}
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-3 border-t border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>

          {/* User avatar */}
          <Link
            href={user.role === 'admin' ? '/admin' : '/profile'}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{getInitials(user.name)}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{user.name}</p>
              <p className="text-[11px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
