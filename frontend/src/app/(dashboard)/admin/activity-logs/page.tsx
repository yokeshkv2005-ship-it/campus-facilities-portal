'use client';

import React, { useState } from 'react';
import { getActivityLogs, getUserById } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import { PageHeader } from '@/components/ui/SharedComponents';
import { Activity, Search, LogIn, BookOpen, CheckCircle, XCircle, Building2, DollarSign, FileText } from 'lucide-react';

export default function AdminActivityLogsPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const logs = getActivityLogs();
  const filtered = logs.filter(l => {
    const u = getUserById(l.user_id);
    const matchSearch = !search || l.description.toLowerCase().includes(search.toLowerCase()) || u?.name.toLowerCase().includes(search.toLowerCase());
    const matchModule = !moduleFilter || l.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const modules = [...new Set(logs.map(l => l.module))];

  const getIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) return <LogIn className="w-4 h-4 text-blue-500" />;
    if (action.includes('approve')) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (action.includes('reject')) return <XCircle className="w-4 h-4 text-red-500" />;
    if (action.includes('cancel')) return <XCircle className="w-4 h-4 text-orange-500" />;
    if (action.includes('facility') || action.includes('create_facility') || action.includes('update_facility')) return <Building2 className="w-4 h-4 text-purple-500" />;
    if (action.includes('fine')) return <DollarSign className="w-4 h-4 text-amber-500" />;
    if (action.includes('booking')) return <BookOpen className="w-4 h-4 text-cyan-500" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="Track all system actions and activities" />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300" />
          </div>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none">
            <option value="">All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400">No activity logs found</div>
          ) : filtered.map(l => {
            const u = getUserById(l.user_id);
            return (
              <div key={l.log_id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(l.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{l.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{u?.name}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-400">{l.module}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-400">{formatDateTime(l.created_at)}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded-md uppercase">{l.action}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
