'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getFacilities, getFacilityTypes } from '@/lib/mockData';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { Search, Filter, MapPin, Users, Building2, Eye, BookOpen } from 'lucide-react';

export default function FacilitiesPage() {
  const facilities = getFacilities();
  const facilityTypes = getFacilityTypes();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = facilities.filter((f) => {
    const matchSearch = f.facility_name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || f.facility_type_id === parseInt(typeFilter);
    const matchStatus = !statusFilter || f.availability_status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const getTypeName = (id: number) => facilityTypes.find(t => t.facility_type_id === id)?.type_name || '';

  // Generate placeholder gradient based on facility id
  const gradients = [
    'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-violet-500',
    'from-amber-400 to-orange-500', 'from-cyan-400 to-blue-500', 'from-rose-400 to-pink-500',
    'from-indigo-400 to-purple-500', 'from-teal-400 to-emerald-500', 'from-orange-400 to-red-500',
    'from-violet-400 to-purple-500',
  ];

  return (
    <div>
      <PageHeader
        title="Campus Facilities"
        subtitle="Browse and book available campus facilities"
        actions={
          <Link href="/book" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Book Now
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search facilities..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none">
            <option value="">All Types</option>
            {facilityTypes.map(t => <option key={t.facility_type_id} value={t.facility_type_id}>{t.type_name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Facility Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((f, idx) => (
          <div key={f.facility_id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
            {/* Image placeholder */}
            <div className={`h-44 bg-gradient-to-br ${gradients[idx % gradients.length]} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white/40" />
              </div>
              <div className="absolute top-3 right-3">
                <StatusBadge status={f.availability_status} />
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{f.facility_name}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{getTypeName(f.facility_type_id)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {f.capacity} seats</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {f.location}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{f.description}</p>
              <div className="flex gap-2">
                <Link href={`/facilities/${f.facility_id}`} className="flex-1 text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Details
                </Link>
                <Link href={`/book?facility=${f.facility_id}`} className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No facilities found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
