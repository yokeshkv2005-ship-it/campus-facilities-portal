'use client';

import React from 'react';
import { getDepartments, getUsers } from '@/lib/mockData';
import { StatusBadge, PageHeader } from '@/components/ui/SharedComponents';
import { Building, Users } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const departments = getDepartments();
  const users = getUsers();

  return (
    <div>
      <PageHeader title="Departments" subtitle="Campus departments overview" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(d => {
          const deptUsers = users.filter(u => u.department_id === d.department_id);
          const staff = deptUsers.filter(u => u.role === 'staff').length;
          const students = deptUsers.filter(u => u.role === 'student').length;
          return (
            <div key={d.department_id} className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <Building className="w-6 h-6" />
                </div>
                <StatusBadge status={d.status} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{d.department_name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-3">{d.department_code}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {staff} staff</span>
                <span>{students} students</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
