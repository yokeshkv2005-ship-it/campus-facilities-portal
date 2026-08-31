'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getBookings, getFacilityById, getUserById, getDepartmentById, updateBooking, updateProgram, addNotification, addActivityLog } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/utils';
import { StatusBadge, PageHeader, Modal } from '@/components/ui/SharedComponents';
import { Search, Eye, CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [viewTarget, setViewTarget] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const bookings = getBookings().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = bookings.filter(b => {
    const matchStatus = !statusFilter || b.status === statusFilter;
    const matchSearch = !search || b.event_title.toLowerCase().includes(search.toLowerCase()) || getUserById(b.user_id)?.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleApprove = (bookingId: number) => {
    const booking = bookings.find(b => b.booking_id === bookingId);
    if (!booking) return;
    updateBooking(bookingId, { status: 'approved', admin_remarks: 'Approved by admin.', document_verification: 'verified' });
    if (booking.program_id) updateProgram(booking.program_id, { status: 'scheduled' });
    addNotification({ user_id: booking.user_id, booking_id: bookingId, title: 'Booking Approved', message: `Your booking for ${getFacilityById(booking.facility_id)?.facility_name} on ${booking.booking_date} has been approved.`, notification_type: 'booking_approved', is_read: false });
    addActivityLog({ user_id: 1, action: 'approve_booking', module: 'Bookings', description: `Approved booking #${bookingId} for ${booking.event_title}` });
    setRefreshKey(k => k + 1);
    toast.success(`Booking #${bookingId} approved!`);
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    const booking = bookings.find(b => b.booking_id === rejectTarget);
    if (!booking) return;
    updateBooking(rejectTarget, { status: 'rejected', admin_remarks: rejectRemarks || 'Rejected by admin.', document_verification: 'rejected' });
    if (booking.program_id) updateProgram(booking.program_id, { status: 'cancelled' });
    addNotification({ user_id: booking.user_id, booking_id: rejectTarget, title: 'Booking Rejected', message: `Your booking for ${getFacilityById(booking.facility_id)?.facility_name} has been rejected. Reason: ${rejectRemarks || 'Rejected by admin.'}`, notification_type: 'booking_rejected', is_read: false });
    addActivityLog({ user_id: 1, action: 'reject_booking', module: 'Bookings', description: `Rejected booking #${rejectTarget}. Reason: ${rejectRemarks}` });
    setRejectTarget(null);
    setRejectRemarks('');
    setRefreshKey(k => k + 1);
    toast.success(`Booking #${rejectTarget} rejected.`);
  };

  const viewBooking = viewTarget ? bookings.find(b => b.booking_id === viewTarget) : null;
  const viewFacility = viewBooking ? getFacilityById(viewBooking.facility_id) : null;
  const viewUser = viewBooking ? getUserById(viewBooking.user_id) : null;

  return (
    <div key={refreshKey}>
      <PageHeader title="Booking Requests" subtitle="Review and manage facility booking requests" />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search bookings or users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Pending count banner */}
      {bookings.filter(b => b.status === 'pending').length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">{bookings.filter(b => b.status === 'pending').length} pending request(s) awaiting your review</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Facility</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Doc</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const u = getUserById(b.user_id);
                const f = getFacilityById(b.facility_id);
                return (
                  <tr key={b.booking_id} className={`hover:bg-slate-50/50 transition-colors ${b.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-600">#{b.booking_id}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">{u?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{u?.name}</p>
                          <p className="text-[11px] text-slate-400 capitalize">{u?.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-700 font-medium">{b.event_title}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{f?.facility_name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(b.booking_date)}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatTime(b.start_time)}-{formatTime(b.end_time)}</td>
                    <td className="px-6 py-3.5">{b.document_name ? <FileText className="w-4 h-4 text-blue-500" /> : <span className="text-xs text-slate-400">—</span>}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewTarget(b.booking_id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(b.booking_id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => setRejectTarget(b.booking_id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
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

      {/* Reject Modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title={`Reject Booking #${rejectTarget}`}>
        <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejecting this booking request.</p>
        <textarea value={rejectRemarks} onChange={(e) => setRejectRemarks(e.target.value)} rows={3} placeholder="Enter rejection reason / admin remarks..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none mb-4" />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setRejectTarget(null)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={handleReject} className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Reject Booking</button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={`Booking #${viewTarget}`} size="lg">
        {viewBooking && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><p className="text-xs text-slate-400">Event</p><p className="text-sm font-medium text-slate-700">{viewBooking.event_title}</p></div>
              <div><p className="text-xs text-slate-400">Status</p><StatusBadge status={viewBooking.status} /></div>
              <div><p className="text-xs text-slate-400">Facility</p><p className="text-sm text-slate-700">{viewFacility?.facility_name}</p></div>
              <div><p className="text-xs text-slate-400">Date</p><p className="text-sm text-slate-700">{formatDate(viewBooking.booking_date)}</p></div>
              <div><p className="text-xs text-slate-400">Time</p><p className="text-sm text-slate-700">{formatTime(viewBooking.start_time)} - {formatTime(viewBooking.end_time)}</p></div>
              <div><p className="text-xs text-slate-400">Participants</p><p className="text-sm text-slate-700">{viewBooking.participants_count}</p></div>
              <div><p className="text-xs text-slate-400">User</p><p className="text-sm text-slate-700">{viewUser?.name} ({viewUser?.email})</p></div>
              <div><p className="text-xs text-slate-400">Organizer</p><p className="text-sm text-slate-700">{viewBooking.organizer_name}</p></div>
              <div><p className="text-xs text-slate-400">Department</p><p className="text-sm text-slate-700">{getDepartmentById(viewBooking.department_id)?.department_name}</p></div>
              <div><p className="text-xs text-slate-400">Purpose</p><p className="text-sm text-slate-700">{viewBooking.purpose}</p></div>
            </div>
            {viewBooking.description && <div><p className="text-xs text-slate-400">Description</p><p className="text-sm text-slate-600">{viewBooking.description}</p></div>}
            {viewBooking.document_name && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-700">{viewBooking.document_name}</span>
                <StatusBadge status={viewBooking.document_verification || 'pending'} />
              </div>
            )}
            {viewBooking.admin_remarks && <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><p className="text-xs text-slate-400 mb-1">Admin Remarks</p><p className="text-sm text-slate-700">{viewBooking.admin_remarks}</p></div>}
            {viewBooking.status === 'pending' && (
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { handleApprove(viewBooking.booking_id); setViewTarget(null); }} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Approve</button>
                <button onClick={() => { setViewTarget(null); setRejectTarget(viewBooking.booking_id); }} className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
