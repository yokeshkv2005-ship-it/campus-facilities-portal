'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingsByUser, getFacilities, getPrograms, getNotificationsByUser, getFacilityById, getDepartmentById } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/utils';
import { StatCard, StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { ClipboardList, Clock, CheckCircle, Calendar, Building2, CalendarCheck, BookOpen, Bell, ArrowRight } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const bookings = getBookingsByUser(user.user_id);
  const facilities = getFacilities().filter(f => f.availability_status === 'available');
  const programs = getPrograms().filter(p => p.status === 'scheduled' && new Date(p.program_date) >= new Date());
  const notifications = getNotificationsByUser(user.user_id).filter(n => !n.is_read).slice(0, 5);
  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const approved = bookings.filter(b => b.status === 'approved').length;
  const upcoming = programs.length;

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}!`} subtitle="Here's an overview of your campus activity" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={total} icon={<ClipboardList className="w-6 h-6" />} color="blue" />
        <StatCard title="Pending Bookings" value={pending} icon={<Clock className="w-6 h-6" />} color="amber" />
        <StatCard title="Approved Bookings" value={approved} icon={<CheckCircle className="w-6 h-6" />} color="green" />
        <StatCard title="Upcoming Programs" value={upcoming} icon={<Calendar className="w-6 h-6" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Bookings</h2>
            <Link href="/bookings" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Facility</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">No bookings yet</td></tr>
                ) : recentBookings.map((b) => {
                  const facility = getFacilityById(b.facility_id);
                  return (
                    <tr key={b.booking_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link href={`/bookings/${b.booking_id}`} className="text-sm font-medium text-slate-700 hover:text-blue-600">{b.event_title}</Link>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-500">{facility?.facility_name || '-'}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(b.booking_date)}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/book', icon: <BookOpen className="w-5 h-5" />, label: 'Book Facility', color: 'from-blue-500 to-indigo-600' },
                { href: '/facilities', icon: <Building2 className="w-5 h-5" />, label: 'View Facilities', color: 'from-emerald-500 to-teal-600' },
                { href: '/calendar', icon: <CalendarCheck className="w-5 h-5" />, label: 'Calendar', color: 'from-purple-500 to-violet-600' },
                { href: '/bookings', icon: <ClipboardList className="w-5 h-5" />, label: 'My Bookings', color: 'from-amber-500 to-orange-600' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {a.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-600">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Notifications</h2>
              <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="px-6 py-6 text-center text-sm text-slate-400">All caught up!</div>
              ) : notifications.map((n) => (
                <div key={n.notification_id} className="px-6 py-3 hover:bg-slate-50/50">
                  <p className="text-sm font-medium text-slate-700">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Programs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Upcoming Programs</h2>
              <Link href="/programs" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {programs.length === 0 ? (
                <div className="px-6 py-6 text-center text-sm text-slate-400">No upcoming programs</div>
              ) : programs.slice(0, 4).map((p) => {
                const facility = getFacilityById(p.facility_id || 0);
                return (
                  <div key={p.program_id} className="px-6 py-3 hover:bg-slate-50/50">
                    <p className="text-sm font-medium text-slate-700">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{facility?.facility_name} • {formatDate(p.program_date)} • {formatTime(p.start_time)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
