'use client';

import React from 'react';
import { getPrograms, getFacilityById, getUserById, getDepartmentById } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/utils';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function ProgramsPage() {
  const programs = getPrograms().sort((a, b) => new Date(b.program_date).getTime() - new Date(a.program_date).getTime());

  return (
    <div>
      <PageHeader title="Programs" subtitle="View scheduled programs and events" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => {
          const facility = getFacilityById(p.facility_id || 0);
          const organizer = getUserById(p.organizer_id);
          const dept = getDepartmentById(p.department_id);
          return (
            <div key={p.program_id} className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {formatDate(p.program_date)}</div>
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-blue-500" /> {formatTime(p.start_time)} - {formatTime(p.end_time)}</div>
                {facility && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {facility.facility_name}</div>}
                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-blue-500" /> {p.expected_audience} expected</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{organizer?.name}</span>
                <span>{dept?.department_code}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
