'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDepartmentById, updateUser } from '@/lib/mockData';
import { PageHeader, Modal } from '@/components/ui/SharedComponents';
import { User, Mail, Phone, Building, Shield, Edit, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  if (!user) return null;
  const dept = getDepartmentById(user.department_id);

  const handleSave = () => {
    updateUser(user.user_id, { name: form.name, phone: form.phone });
    toast.success('Profile updated successfully');
    setEditing(false);
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          {/* Profile header */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-sm text-slate-500 capitalize">{user.role} • {dept?.department_name}</p>
              </div>
              <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5">
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-500" />
                <div><p className="text-xs text-slate-400">Email</p><p className="text-sm font-medium text-slate-700">{user.email}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Phone className="w-5 h-5 text-blue-500" />
                <div><p className="text-xs text-slate-400">Phone</p><p className="text-sm font-medium text-slate-700">{user.phone}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Building className="w-5 h-5 text-blue-500" />
                <div><p className="text-xs text-slate-400">Department</p><p className="text-sm font-medium text-slate-700">{dept?.department_name} ({dept?.department_code})</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Shield className="w-5 h-5 text-blue-500" />
                <div><p className="text-xs text-slate-400">Role</p><p className="text-sm font-medium text-slate-700 capitalize">{user.role}</p></div>
              </div>
            </div>

            <button onClick={() => setChangingPw(true)} className="mt-4 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={changingPw} onClose={() => setChangingPw(false)} title="Change Password">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input type="password" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input type="password" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input type="password" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
          <button onClick={() => { setChangingPw(false); toast.success('Password changed successfully'); }} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl text-sm">
            Update Password
          </button>
        </div>
      </Modal>
    </div>
  );
}
