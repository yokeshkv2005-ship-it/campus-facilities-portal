'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDepartments } from '@/lib/mockData';
import { Building2, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const departments = getDepartments();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department_id: 1, role: 'student' as 'staff' | 'student', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: form.name, email: form.email, phone: form.phone,
        department_id: form.department_id, role: form.role, password: form.password,
      });
      if (result.success) {
        toast.success(result.message);
        router.push('/login');
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    }, 500);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">CampusBook</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
          <p className="text-sm text-slate-500 mb-6">Register to start booking campus facilities</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Enter your full name" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="10-digit number" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                <select value={form.department_id} onChange={(e) => updateField('department_id', parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
                  {departments.map((d) => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                <select value={form.role} onChange={(e) => updateField('role', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
                  <option value="student">Student</option>
                  <option value="staff">Staff / Faculty</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Min 6 characters" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none transition-all pr-10 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter password" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none transition-all ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
