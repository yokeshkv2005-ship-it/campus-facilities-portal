'use client';

import React, { useState } from 'react';
import { getFines, getUserById, getBookingById, updateFine } from '@/lib/mockData';
import { formatDate, formatDateTime } from '@/lib/utils';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { DollarSign, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFinesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fines = getFines();
  const filtered = fines.filter(f => !statusFilter || f.status === statusFilter);
  const totalUnpaid = fines.filter(f => f.status === 'unpaid').reduce((s, f) => s + f.amount, 0);
  const totalPaid = fines.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);

  const markPaid = (id: number) => {
    updateFine(id, { status: 'paid', paid_at: new Date().toISOString() });
    setRefreshKey(k => k + 1);
    toast.success('Fine marked as paid');
  };

  return (
    <div key={refreshKey}>
      <PageHeader title="Fine Management" subtitle="Manage booking fines and penalties" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
          <p className="text-sm text-slate-500">Total Fines</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalUnpaid + totalPaid}</p>
        </div>
        <div className="bg-orange-50 rounded-2xl border border-orange-200 p-5">
          <p className="text-sm text-orange-600">Unpaid</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">₹{totalUnpaid}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <p className="text-sm text-emerald-600">Collected</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalPaid}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none">
          <option value="">All Status</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="waived">Waived</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Booking</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">No fines found</td></tr>
              ) : filtered.map(f => {
                const u = getUserById(f.user_id);
                return (
                  <tr key={f.fine_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-600">#{f.fine_id}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-700">{u?.name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">#{f.booking_id}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{f.reason}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-slate-700">₹{f.amount}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={f.status} /></td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatDateTime(f.issued_at)}</td>
                    <td className="px-6 py-3.5">
                      {f.status === 'unpaid' && (
                        <button onClick={() => markPaid(f.fine_id)} className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                        </button>
                      )}
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
