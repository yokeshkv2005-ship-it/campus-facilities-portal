'use client';

import React, { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '@/lib/mockData';
import { PageHeader } from '@/components/ui/SharedComponents';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettingsState] = useState(getSettings());

  const handleChange = (key: string, value: string) => {
    setSettingsState(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
  };

  const handleSave = () => {
    settings.forEach(s => updateSetting(s.setting_key, s.setting_value));
    toast.success('Settings saved successfully');
  };

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Configure booking rules, fines, and system preferences" actions={
        <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      } />

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-blue-500" /> Booking & Fine Rules</h3>
          <div className="space-y-4">
            {settings.filter(s => s.setting_key !== 'INSTITUTION_NAME' && s.setting_key !== 'ENABLE_NOTIFICATIONS').map(s => (
              <div key={s.setting_key} className="grid sm:grid-cols-3 gap-2 items-center">
                <div>
                  <label className="text-sm font-medium text-slate-700">{s.setting_key.replace(/_/g, ' ').replace(/\b\w/g, c => c)}</label>
                  <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                </div>
                <input
                  type={s.setting_value.includes('.') || !isNaN(Number(s.setting_value)) ? 'number' : 'text'}
                  value={s.setting_value}
                  onChange={(e) => handleChange(s.setting_key, e.target.value)}
                  className="sm:col-span-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">System Information</h3>
          <div className="space-y-4">
            {settings.filter(s => s.setting_key === 'INSTITUTION_NAME' || s.setting_key === 'ENABLE_NOTIFICATIONS').map(s => (
              <div key={s.setting_key} className="grid sm:grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-slate-700">{s.setting_key.replace(/_/g, ' ').replace(/\b\w/g, c => c)}</label>
                {s.setting_key === 'ENABLE_NOTIFICATIONS' ? (
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => handleChange(s.setting_key, s.setting_value === 'true' ? 'false' : 'true')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${s.setting_value === 'true' ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${s.setting_value === 'true' ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ) : (
                  <input type="text" value={s.setting_value} onChange={(e) => handleChange(s.setting_key, e.target.value)} className="sm:col-span-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
