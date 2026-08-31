'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getFacilityById, getFacilityTypes, getBookings } from '@/lib/mockData';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { formatDate, formatTime } from '@/lib/utils';
import { MapPin, Users, Building2, CheckCircle, BookOpen, Calendar, ArrowLeft, Wifi, Wind, Monitor, Mic } from 'lucide-react';

export default function FacilityDetailsPage() {
  const params = useParams();
  const facilityId = parseInt(params.id as string);
  const facility = getFacilityById(facilityId);
  const facilityTypes = getFacilityTypes();

  if (!facility) {
    return <div className="text-center py-20 text-slate-400"><p className="text-lg font-medium">Facility not found</p></div>;
  }

  const typeName = facilityTypes.find(t => t.facility_type_id === facility.facility_type_id)?.type_name || '';
  const upcomingBookings = getBookings().filter(
    b => b.facility_id === facilityId && (b.status === 'approved' || b.status === 'pending') && new Date(b.booking_date) >= new Date()
  ).sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()).slice(0, 5);

  const amenityIcons: Record<string, React.ReactNode> = {
    'Wi-Fi': <Wifi className="w-4 h-4" />, 'AC': <Wind className="w-4 h-4" />,
    'Projector': <Monitor className="w-4 h-4" />, 'Mic System': <Mic className="w-4 h-4" />,
  };

  const gradients = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-violet-500', 'from-amber-400 to-orange-500', 'from-cyan-400 to-blue-500', 'from-rose-400 to-pink-500', 'from-indigo-400 to-purple-500', 'from-teal-400 to-emerald-500', 'from-orange-400 to-red-500', 'from-violet-400 to-purple-500'];

  return (
    <div>
      <div className="mb-6">
        <Link href="/facilities" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Facilities
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className={`h-64 rounded-2xl bg-gradient-to-br ${gradients[(facilityId - 1) % gradients.length]} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-24 h-24 text-white/30" />
            </div>
            <div className="absolute top-4 right-4"><StatusBadge status={facility.availability_status} /></div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{facility.facility_name}</h1>
                <p className="text-sm text-blue-600 font-medium mt-1">{typeName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Capacity: {facility.capacity}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {facility.location}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">{facility.description}</p>

            {/* Amenities */}
            <h3 className="font-semibold text-slate-800 mb-3">Amenities & Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {facility.amenities.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  {amenityIcons[a] || <CheckCircle className="w-3.5 h-3.5" />} {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Book This Facility</h3>
            <div className="space-y-3">
              <Link href={`/book?facility=${facility.facility_id}`} className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> Book Now
              </Link>
            </div>
          </div>

          {/* Upcoming bookings */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Upcoming Schedule</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingBookings.length === 0 ? (
                <div className="px-6 py-6 text-center text-sm text-slate-400">No upcoming bookings</div>
              ) : upcomingBookings.map((b) => (
                <div key={b.booking_id} className="px-6 py-3">
                  <p className="text-sm font-medium text-slate-700">{b.event_title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(b.booking_date)} • {formatTime(b.start_time)} - {formatTime(b.end_time)}
                  </p>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
