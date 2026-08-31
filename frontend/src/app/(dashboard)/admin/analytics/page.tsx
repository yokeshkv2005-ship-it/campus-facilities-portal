'use client';

import React from 'react';
import { getBookings, getFacilities, getUsers, getFines, getDepartments } from '@/lib/mockData';
import { PageHeader, StatCard } from '@/components/ui/SharedComponents';
import { BarChart3, TrendingUp, Building2, Users, Clock, Calendar, Percent, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const bookings = getBookings();
  const facilities = getFacilities();
  const users = getUsers();
  const departments = getDepartments();

  const total = bookings.length;
  const approved = bookings.filter(b => b.status === 'approved' || b.status === 'completed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Most used facility
  const facilityBookingCounts = facilities.map(f => ({ name: f.facility_name, count: bookings.filter(b => b.facility_id === f.facility_id).length }));
  const mostUsed = facilityBookingCounts.sort((a, b) => b.count - a.count)[0];
  const leastUsed = facilityBookingCounts.sort((a, b) => a.count - b.count)[0];

  // Most active department
  const deptCounts = departments.map(d => ({ name: d.department_code, count: bookings.filter(b => b.department_id === d.department_id).length }));
  const mostActiveDept = deptCounts.sort((a, b) => b.count - a.count)[0];

  // Peak time analysis
  const hourCounts: Record<string, number> = {};
  bookings.forEach(b => { const h = b.start_time.split(':')[0]; hourCounts[h] = (hourCounts[h] || 0) + 1; });
  const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];
  const peakTimeLabel = peakHour ? `${parseInt(peakHour[0]) % 12 || 12}:00 ${parseInt(peakHour[0]) >= 12 ? 'PM' : 'AM'}` : 'N/A';

  // Utilization per facility
  const utilizationData = facilities.map(f => {
    const fb = bookings.filter(b => b.facility_id === f.facility_id && (b.status === 'approved' || b.status === 'completed'));
    const totalHours = fb.reduce((sum, b) => {
      const start = parseInt(b.start_time.split(':')[0]) + parseInt(b.start_time.split(':')[1]) / 60;
      const end = parseInt(b.end_time.split(':')[0]) + parseInt(b.end_time.split(':')[1]) / 60;
      return sum + (end - start);
    }, 0);
    const maxHours = 10 * 30; // 10 hours per day * 30 days
    return { name: f.facility_name.split(' ').slice(0, 2).join(' '), percent: Math.min(100, Math.round((totalHours / maxHours) * 100)) };
  });

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Campus facility usage analytics and insights" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={<TrendingUp className="w-6 h-6" />} color="green" />
        <StatCard title="Cancellation Rate" value={`${cancellationRate}%`} icon={<Percent className="w-6 h-6" />} color="red" />
        <StatCard title="Peak Booking Time" value={peakTimeLabel} icon={<Clock className="w-6 h-6" />} color="purple" />
        <StatCard title="Active Users" value={users.filter(u => u.status === 'active').length} icon={<Users className="w-6 h-6" />} color="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Key Insights */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {[
              { label: 'Most Used Facility', value: mostUsed?.name || 'N/A', sub: `${mostUsed?.count || 0} bookings`, icon: <Building2 className="w-5 h-5 text-blue-500" /> },
              { label: 'Least Used Facility', value: leastUsed?.name || 'N/A', sub: `${leastUsed?.count || 0} bookings`, icon: <Building2 className="w-5 h-5 text-slate-400" /> },
              { label: 'Most Active Department', value: mostActiveDept?.name || 'N/A', sub: `${mostActiveDept?.count || 0} bookings`, icon: <Users className="w-5 h-5 text-purple-500" /> },
              { label: 'Total Active Facilities', value: `${facilities.filter(f => f.availability_status === 'available').length}/${facilities.length}`, sub: 'Currently available', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
                <span className="text-xs text-slate-400">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Utilization */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Facility Utilization %</h3>
          <div className="space-y-3">
            {utilizationData.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{f.name}</span>
                  <span className="text-slate-400 font-semibold">{f.percent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${f.percent > 60 ? 'bg-emerald-500' : f.percent > 30 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${f.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend - simple visual */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Monthly Booking Trend</h3>
        <div className="flex items-end gap-3 h-48">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => {
            const count = Math.floor(Math.random() * 15) + 2;
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 font-medium">{count}</span>
                <div className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg transition-all" style={{ height: `${(count / 17) * 100}%` }} />
                <span className="text-[10px] text-slate-500">{m}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
