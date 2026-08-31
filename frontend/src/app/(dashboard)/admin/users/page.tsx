'use client';

import React, { useState } from 'react';
import { getUsers, getDepartmentById, updateUser } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { Search, Users as UsersIcon, Edit, ShieldCheck, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const users = getUsers();
  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (userId: number, current: string) => {
    const newStatus = current === 'active' ? 'inactive' : 'active';
    updateUser(userId, { status: newStatus as 'active' | 'inactive' });
    setRefreshKey(k => k + 1);
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  return (
    <div key={refreshKey}>
      <PageHeader title="User Management" subtitle={`${users.length} registered users`} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => {
                const dept = getDepartmentById(u.department_id);
                return (
                  <tr key={u.user_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{u.name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{u.email}</td>
                    <td className="px-6 py-3.5"><span className="capitalize text-sm text-slate-600 font-medium">{u.role}</span></td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{dept?.department_code}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{u.phone}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={u.status} /></td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => toggleStatus(u.user_id, u.status)}
                        className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'}`}
                        title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {u.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </button>
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
