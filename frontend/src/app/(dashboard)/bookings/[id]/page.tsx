'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getBookingById, getFacilityById, getUserById, getDepartmentById } from '@/lib/mockData';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Building2, User, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = parseInt(params.id as string);
  const booking = getBookingById(bookingId);

  if (!booking) {
    return <div className="text-center py-20 text-slate-400"><p className="text-lg font-medium">Booking not found</p></div>;
  }

  const facility = getFacilityById(booking.facility_id);
  const user = getUserById(booking.user_id);
  const department = getDepartmentById(booking.department_id);

  const timelineSteps = [
    { label: 'Submitted', date: booking.created_at, done: true, icon: <CheckCircle className="w-4 h-4" /> },
    { label: 'Under Review', date: booking.status !== 'pending' ? booking.updated_at : null, done: booking.status !== 'pending', icon: <Clock className="w-4 h-4" /> },
    { label: booking.status === 'rejected' ? 'Rejected' : booking.status === 'cancelled' ? 'Cancelled' : 'Approved', date: ['approved', 'rejected', 'cancelled'].includes(booking.status) ? booking.updated_at : null, done: ['approved', 'rejected', 'cancelled', 'completed'].includes(booking.status), icon: booking.status === 'rejected' ? <XCircle className="w-4 h-4" /> : booking.status === 'cancelled' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div>
      <Link href="/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Booking #{booking.booking_id}</h1>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Booking Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-400 mb-0.5">Event Title</p><p className="text-sm font-medium text-slate-700">{booking.event_title}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Purpose</p><p className="text-sm font-medium text-slate-700">{booking.purpose}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Date</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" />{formatDate(booking.booking_date)}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Time</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" />{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Participants</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-500" />{booking.participants_count}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Organizer</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-500" />{booking.organizer_name}</p></div>
            </div>
            {booking.description && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-600">{booking.description}</p>
              </div>
            )}
          </div>

          {/* Facility Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Facility Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-400 mb-0.5">Facility</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-blue-500" />{facility?.facility_name}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Location</p><p className="text-sm font-medium text-slate-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" />{facility?.location}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Capacity</p><p className="text-sm font-medium text-slate-700">{facility?.capacity} seats</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Department</p><p className="text-sm font-medium text-slate-700">{department?.department_name}</p></div>
            </div>
          </div>

          {/* Document */}
          {booking.document_name && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Uploaded Document</h3>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{booking.document_name}</p>
                  <p className="text-xs text-slate-500">Verification: <StatusBadge status={booking.document_verification || 'pending'} /></p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Remarks */}
          {booking.admin_remarks && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Admin Remarks</h3>
              <div className={`p-4 rounded-xl border ${booking.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className="text-sm text-slate-700">{booking.admin_remarks}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Booking Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? (step.label === 'Rejected' || step.label === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600') : 'bg-slate-100 text-slate-400'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.done ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-slate-400">{formatDateTime(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Submitted By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {booking.fine_amount > 0 && (
            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
              <h3 className="font-semibold text-orange-800 mb-2">Fine Applied</h3>
              <p className="text-2xl font-bold text-orange-700">₹{booking.fine_amount}</p>
              <p className="text-xs text-orange-600 mt-1">Cancellation penalty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
