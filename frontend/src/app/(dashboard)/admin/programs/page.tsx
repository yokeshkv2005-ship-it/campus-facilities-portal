'use client';

import React, { useState } from 'react';
import { getPrograms, getFacilityById, getUserById, getDepartmentById, addProgram, updateProgram, deleteProgram, getFacilities, getDepartments, getUsers } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/utils';
import { StatusBadge, PageHeader, Modal, ConfirmDialog } from '@/components/ui/SharedComponents';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProgramsPage() {
  const facilities = getFacilities();
  const departments = getDepartments();
  const allUsers = getUsers();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', organizer_id: 2, department_id: 1, facility_id: 0 as number | null, program_date: '', start_time: '', end_time: '', expected_audience: '', status: 'draft' as 'draft' | 'scheduled' | 'completed' | 'cancelled' });

  const programs = getPrograms().sort((a, b) => new Date(b.program_date).getTime() - new Date(a.program_date).getTime());
  const filtered = programs.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ title: '', description: '', organizer_id: 2, department_id: 1, facility_id: null, program_date: '', start_time: '', end_time: '', expected_audience: '', status: 'draft' });
    setEditId(null); setShowForm(true);
  };

  const openEdit = (id: number) => {
    const p = programs.find(x => x.program_id === id);
    if (!p) return;
    setForm({ title: p.title, description: p.description, organizer_id: p.organizer_id, department_id: p.department_id, facility_id: p.facility_id, program_date: p.program_date, start_time: p.start_time, end_time: p.end_time, expected_audience: String(p.expected_audience), status: p.status });
    setEditId(id); setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title || !form.program_date) { toast.error('Fill required fields'); return; }
    const data = { ...form, expected_audience: parseInt(form.expected_audience) || 0 };
    if (editId) { updateProgram(editId, data); toast.success('Program updated'); }
    else { addProgram(data); toast.success('Program added'); }
    setShowForm(false); setRefreshKey(k => k + 1);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProgram(deleteId); setDeleteId(null); setRefreshKey(k => k + 1);
    toast.success('Program deleted');
  };

  return (
    <div key={refreshKey}>
      <PageHeader title="Program Management" subtitle="Manage campus programs and events" actions={
        <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"><Plus className="w-4 h-4" /> Add Program</button>
      } />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Title</th><th className="px-6 py-3">Organizer</th><th className="px-6 py-3">Dept</th><th className="px-6 py-3">Facility</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Time</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const organizer = getUserById(p.organizer_id);
                const facility = getFacilityById(p.facility_id || 0);
                const dept = getDepartmentById(p.department_id);
                return (
                  <tr key={p.program_id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{p.title}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{organizer?.name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{dept?.department_code}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{facility?.facility_name || '—'}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatDate(p.program_date)}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{formatTime(p.start_time)}-{formatTime(p.end_time)}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(p.program_id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(p.program_id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editId ? 'Edit Program' : 'Add Program'} size="lg">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Title *</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Department</label><select value={form.department_id} onChange={e => setForm({ ...form, department_id: parseInt(e.target.value) })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none">{departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Facility</label><select value={form.facility_id || ''} onChange={e => setForm({ ...form, facility_id: e.target.value ? parseInt(e.target.value) : null })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none"><option value="">-- None --</option>{facilities.map(f => <option key={f.facility_id} value={f.facility_id}>{f.facility_name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Date *</label><input type="date" value={form.program_date} onChange={e => setForm({ ...form, program_date: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Expected Audience</label><input type="number" value={form.expected_audience} onChange={e => setForm({ ...form, expected_audience: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label><input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">End Time</label><input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none resize-none" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button><button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium">{editId ? 'Update' : 'Add'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Program" message="Are you sure?" confirmText="Delete" variant="danger" />
    </div>
  );
}
