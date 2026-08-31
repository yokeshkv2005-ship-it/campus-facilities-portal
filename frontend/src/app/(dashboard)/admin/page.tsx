'use client';

import React from 'react';
import Link from 'next/link';
import { getUsers, getFacilities, getBookings, getPrograms, getFines, getActivityLogs, getFacilityById, getUserById, getDepartmentById } from '@/lib/mockData';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils';
import { StatCard, StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { Users, Building2, ClipboardList, Clock, CheckCircle, XCircle, Calendar, DollarSign, Activity, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const users = getUsers();
  const facilities = getFacilities();
  const bookings = getBookings();
  const programs = getPrograms();
  const fines = getFines();
  const logs = getActivityLogs().slice(0, 8);

  const students = users.filter(u => u.role === 'student').length;
  const staff = users.filter(u => u.role === 'staff').length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const approved = bookings.filter(b => b.status === 'approved').length;
  const rejected = bookings.filter(b => b.status === 'rejected').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const upcoming = programs.filter(p => p.status === 'scheduled' && new Date(p.program_date) >= new Date()).length;
  const totalFines = fines.reduce((s, f) => s + f.amount, 0);
  const availableFacilities = facilities.filter(f => f.availability_status === 'available').length;

  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

  // Simple chart data for mock bar chart
  const facilityUsage = facilities.slice(0, 6).map(f => ({
    name: f.facility_name.split(' ').slice(0, 2).join(' '),
    count: bookings.filter(b => b.facility_id === f.facility_id).length,
  }));
  const maxUsage = Math.max(...facilityUsage.map(f => f.count), 1);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Campus Facilities Booking Management Overview" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={users.length} icon={<Users className="w-6 h-6" />} color="blue" trend={`${students} students, ${staff} staff`} />
        <StatCard title="Total Facilities" value={facilities.length} icon={<Building2 className="w-6 h-6" />} color="teal" trend={`${availableFacilities} available`} />
        <StatCard title="Pending Requests" value={pending} icon={<Clock className="w-6 h-6" />} color="amber" />
        <StatCard title="Approved Bookings" value={approved} icon={<CheckCircle className="w-6 h-6" />} color="green" />
        <StatCard title="Rejected Bookings" value={rejected} icon={<XCircle className="w-6 h-6" />} color="red" />
        <StatCard title="Cancelled" value={cancelled} icon={<XCircle className="w-6 h-6" />} color="purple" />
        <StatCard title="Upcoming Programs" value={upcoming} icon={<Calendar className="w-6 h-6" />} color="indigo" />
        <StatCard title="Total Fines" value={`₹${totalFines}`} icon={<DollarSign className="w-6 h-6" />} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Booking Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Booking Requests</h2>
            <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Facility</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => {
                  const u = getUserById(b.user_id);
                  const f = getFacilityById(b.facility_id);
                  return (
                    <tr key={b.booking_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{u?.name?.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-slate-700">{u?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{b.event_title}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-500">{f?.facility_name}</td>
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
          {/* Facility Usage - simple bar chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Facility Usage</h2>
            <div className="space-y-3">
              {facilityUsage.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium truncate">{f.name}</span>
                    <span className="text-slate-400">{f.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(f.count / maxUsage) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/bookings', label: 'Review Requests', icon: <ClipboardList className="w-4 h-4" />, count: pending },
                { href: '/admin/facilities', label: 'Manage Facilities', icon: <Building2 className="w-4 h-4" /> },
                { href: '/admin/users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
                { href: '/admin/reports', label: 'View Reports', icon: <TrendingUp className="w-4 h-4" /> },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">{a.icon}</div>
                    {a.label}
                  </div>
                  {a.count !== undefined && a.count > 0 && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{a.count}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Recent Activity</h2>
              <Link href="/admin/activity-logs" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {logs.slice(0, 5).map((l) => {
                const u = getUserById(l.user_id);
                return (
                  <div key={l.log_id} className="px-6 py-3">
                    <p className="text-sm text-slate-700">{l.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{u?.name} • {formatDateTime(l.created_at)}</p>
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
