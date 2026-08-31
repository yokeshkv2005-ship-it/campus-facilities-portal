'use client';

import React, { useState } from 'react';
import { getFacilities, getFacilityTypes, addFacility, updateFacility, deleteFacility, addActivityLog } from '@/lib/mockData';
import { StatusBadge, PageHeader, Modal, ConfirmDialog } from '@/components/ui/SharedComponents';
import { Search, Plus, Edit, Trash2, Building2, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFacilitiesPage() {
  const facilityTypes = getFacilityTypes();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({ facility_name: '', facility_type_id: 1, capacity: '', location: '', description: '', availability_status: 'available' as const, image: '', amenities: '' });

  const facilities = getFacilities();
  const filtered = facilities.filter(f => !search || f.facility_name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ facility_name: '', facility_type_id: 1, capacity: '', location: '', description: '', availability_status: 'available', image: '', amenities: '' });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (id: number) => {
    const f = facilities.find(x => x.facility_id === id);
    if (!f) return;
    setForm({ facility_name: f.facility_name, facility_type_id: f.facility_type_id, capacity: String(f.capacity), location: f.location, description: f.description, availability_status: f.availability_status, image: f.image, amenities: f.amenities.join(', ') });
    setEditId(id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.facility_name || !form.capacity || !form.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    const data = { facility_name: form.facility_name, facility_type_id: form.facility_type_id, capacity: parseInt(form.capacity), location: form.location, description: form.description, availability_status: form.availability_status as 'available' | 'maintenance' | 'unavailable', image: form.image || '/facilities/default.jpg', amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean) };
    if (editId) {
      updateFacility(editId, data);
      addActivityLog({ user_id: 1, action: 'update_facility', module: 'Facilities', description: `Updated facility: ${form.facility_name}` });
      toast.success('Facility updated');
    } else {
      addFacility(data);
      addActivityLog({ user_id: 1, action: 'create_facility', module: 'Facilities', description: `Created facility: ${form.facility_name}` });
      toast.success('Facility added');
    }
    setShowForm(false);
    setRefreshKey(k => k + 1);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const f = facilities.find(x => x.facility_id === deleteId);
    deleteFacility(deleteId);
    addActivityLog({ user_id: 1, action: 'delete_facility', module: 'Facilities', description: `Deleted facility: ${f?.facility_name}` });
    setDeleteId(null);
    setRefreshKey(k => k + 1);
    toast.success('Facility deleted');
  };

  const gradients = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-violet-500', 'from-amber-400 to-orange-500', 'from-cyan-400 to-blue-500', 'from-rose-400 to-pink-500', 'from-indigo-400 to-purple-500', 'from-teal-400 to-emerald-500', 'from-orange-400 to-red-500', 'from-violet-400 to-purple-500'];

  return (
    <div key={refreshKey}>
      <PageHeader title="Facility Management" subtitle="Add, edit, and manage campus facilities" actions={
        <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      } />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search facilities..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((f, idx) => (
          <div key={f.facility_id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all group">
            <div className={`h-36 bg-gradient-to-br ${gradients[idx % gradients.length]} relative`}>
              <div className="absolute inset-0 flex items-center justify-center"><Building2 className="w-12 h-12 text-white/30" /></div>
              <div className="absolute top-3 right-3"><StatusBadge status={f.availability_status} /></div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-slate-800 mb-1">{f.facility_name}</h3>
              <p className="text-xs text-blue-600 font-medium mb-2">{facilityTypes.find(t => t.facility_type_id === f.facility_type_id)?.type_name}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {f.capacity}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {f.location}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(f.facility_id)} className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteId(f.facility_id)} className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editId ? 'Edit Facility' : 'Add New Facility'} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Name *</label><input type="text" value={form.facility_name} onChange={e => setForm({ ...form, facility_name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Type *</label><select value={form.facility_type_id} onChange={e => setForm({ ...form, facility_type_id: parseInt(e.target.value) })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none">{facilityTypes.map(t => <option key={t.facility_type_id} value={t.facility_type_id}>{t.type_name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label><input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Location *</label><input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select value={form.availability_status} onChange={e => setForm({ ...form, availability_status: e.target.value as any })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none"><option value="available">Available</option><option value="maintenance">Maintenance</option><option value="unavailable">Unavailable</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label><input type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="Comma separated" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none" /></div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg transition-all">{editId ? 'Update' : 'Add'} Facility</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Facility" message="Are you sure you want to delete this facility? This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
}
