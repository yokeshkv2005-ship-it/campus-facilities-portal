'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingsByUser, getFacilityById, getDepartmentById, updateBooking, addNotification, addActivityLog, addCancellation, addFine, calculateCancellationPenalty } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/utils';
import { StatusBadge, PageHeader, ConfirmDialog, EmptyState } from '@/components/ui/SharedComponents';
import { ClipboardList, Eye, XCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const { user, refreshUnreadCount } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null;

  const bookings = getBookingsByUser(user.user_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = bookings.filter(b => {
    const matchStatus = !statusFilter || b.status === statusFilter;
    const matchSearch = !search || b.event_title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancel = () => {
    if (!cancelTarget || !user) return;
    const booking = bookings.find(b => b.booking_id === cancelTarget);
    if (!booking) return;

    const penalty = calculateCancellationPenalty(booking.booking_date, booking.start_time);

    updateBooking(cancelTarget, { status: 'cancelled', fine_amount: penalty });

    addCancellation({ booking_id: cancelTarget, cancelled_by: user.user_id, reason: cancelReason || 'Cancelled by user', penalty_amount: penalty });

    if (penalty > 0) {
      addFine({ booking_id: cancelTarget, user_id: user.user_id, reason: 'Late cancellation penalty', amount: penalty, status: 'unpaid' });
      addNotification({ user_id: user.user_id, booking_id: cancelTarget, title: 'Fine Generated', message: `A fine of ₹${penalty} has been generated for late cancellation of booking #${cancelTarget}.`, notification_type: 'fine_generated', is_read: false });
    }

    addNotification({ user_id: user.user_id, booking_id: cancelTarget, title: 'Booking Cancelled', message: `Your booking #${cancelTarget} has been cancelled.${penalty > 0 ? ` A penalty of ₹${penalty} has been applied.` : ''}`, notification_type: 'booking_cancelled', is_read: false });
    addNotification({ user_id: 1, booking_id: cancelTarget, title: 'Booking Cancelled', message: `${user.name} cancelled booking #${cancelTarget}.`, notification_type: 'booking_cancelled', is_read: false });
    addActivityLog({ user_id: user.user_id, action: 'cancel_booking', module: 'Bookings', description: `Cancelled booking #${cancelTarget}` });

    refreshUnreadCount();
    setCancelTarget(null);
    setCancelReason('');
    setRefreshKey(k => k + 1);
    toast.success(`Booking cancelled.${penalty > 0 ? ` Penalty: ₹${penalty}` : ''}`);
  };

  return (
    <div key={refreshKey}>
      <PageHeader title="My Bookings" subtitle="View and manage your facility bookings" />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Facility</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">No bookings found</td></tr>
              ) : filtered.map((b) => {
                const facility = getFacilityById(b.facility_id);
                return (
                  <tr key={b.booking_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-600">#{b.booking_id}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{b.event_title}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{facility?.facility_name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(b.booking_date)}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatTime(b.start_time)} - {formatTime(b.end_time)}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/bookings/${b.booking_id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {(b.status === 'pending' || b.status === 'approved') && (
                          <button onClick={() => setCancelTarget(b.booking_id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Cancel">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Dialog */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCancelTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Cancel Booking</h3>
            <p className="text-sm text-slate-500 mb-4">Are you sure you want to cancel booking #{cancelTarget}? A cancellation penalty may apply based on timing.</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..." rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCancelTarget(null)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCancel} className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
