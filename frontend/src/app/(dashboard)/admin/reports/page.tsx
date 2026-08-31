'use client';

import React from 'react';
import { getBookings, getFacilities, getUsers, getFines, getDepartments, getFacilityById, getDepartmentById } from '@/lib/mockData';
import { PageHeader, StatCard } from '@/components/ui/SharedComponents';
import { BarChart3, TrendingUp, Building2, Users, DollarSign } from 'lucide-react';

export default function AdminReportsPage() {
  const bookings = getBookings();
  const facilities = getFacilities();
  const users = getUsers();
  const fines = getFines();
  const departments = getDepartments();

  const total = bookings.length;
  const approved = bookings.filter(b => b.status === 'approved').length;
  const rejected = bookings.filter(b => b.status === 'rejected').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  const totalFines = fines.reduce((s, f) => s + f.amount, 0);
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Facility usage
  const facilityUsage = facilities.map(f => ({
    name: f.facility_name,
    count: bookings.filter(b => b.facility_id === f.facility_id).length,
  })).sort((a, b) => b.count - a.count);
  const maxFacUsage = Math.max(...facilityUsage.map(f => f.count), 1);

  // Department usage
  const deptUsage = departments.map(d => ({
    name: d.department_code,
    count: bookings.filter(b => b.department_id === d.department_id).length,
  })).sort((a, b) => b.count - a.count);
  const maxDeptUsage = Math.max(...deptUsage.map(d => d.count), 1);

  // Status breakdown
  const statuses = [
    { label: 'Approved', count: approved, color: 'bg-emerald-500' },
    { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: 'bg-amber-500' },
    { label: 'Rejected', count: rejected, color: 'bg-red-500' },
    { label: 'Cancelled', count: cancelled, color: 'bg-purple-500' },
    { label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Comprehensive booking and facility reports" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={total} icon={<BarChart3 className="w-6 h-6" />} color="blue" />
        <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={<TrendingUp className="w-6 h-6" />} color="green" />
        <StatCard title="Cancellation Rate" value={`${cancellationRate}%`} icon={<TrendingUp className="w-6 h-6" />} color="red" />
        <StatCard title="Total Fines" value={`₹${totalFines}`} icon={<DollarSign className="w-6 h-6" />} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Facility Usage */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /> Facility Usage</h3>
          <div className="space-y-3">
            {facilityUsage.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium truncate max-w-[200px]">{f.name}</span>
                  <span className="text-slate-400">{f.count} bookings</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(f.count / maxFacUsage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Usage */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Department-wise Bookings</h3>
          <div className="space-y-3">
            {deptUsage.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{d.name}</span>
                  <span className="text-slate-400">{d.count} bookings</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" style={{ width: `${(d.count / maxDeptUsage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6">
        <h3 className="font-semibold text-slate-800 mb-4">Booking Status Breakdown</h3>
        <div className="flex items-center gap-1 h-8 rounded-full overflow-hidden mb-4">
          {statuses.map((s, i) => s.count > 0 && (
            <div key={i} className={`h-full ${s.color} transition-all`} style={{ width: `${(s.count / total) * 100}%` }} title={`${s.label}: ${s.count}`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {statuses.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-sm text-slate-600">{s.label}: <span className="font-semibold">{s.count}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Booking Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Facility</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Approved</th>
                <th className="px-6 py-3">Rejected</th>
                <th className="px-6 py-3">Cancelled</th>
                <th className="px-6 py-3">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map(f => {
                const fb = bookings.filter(b => b.facility_id === f.facility_id);
                const fa = fb.filter(b => b.status === 'approved' || b.status === 'completed').length;
                const fr = fb.filter(b => b.status === 'rejected').length;
                const fc = fb.filter(b => b.status === 'cancelled').length;
                const util = fb.length > 0 ? Math.round((fa / fb.length) * 100) : 0;
                return (
                  <tr key={f.facility_id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-700">{f.facility_name}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{fb.length}</td>
                    <td className="px-6 py-3 text-sm text-emerald-600 font-medium">{fa}</td>
                    <td className="px-6 py-3 text-sm text-red-600">{fr}</td>
                    <td className="px-6 py-3 text-sm text-purple-600">{fc}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{util}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
