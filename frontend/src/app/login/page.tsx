'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success(result.message);
        // Re-check the user from context after login
        const userData = JSON.parse(localStorage.getItem('cfb_current_user') || '{}');
        router.push(userData.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Campus Facilities<br />Booking Portal
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Manage campus facility bookings, schedules and programs with our smart digital platform.
          </p>
          <div className="mt-12 space-y-4">
            {['Real-time availability checking', 'Smart scheduling & conflict detection', 'Comprehensive reports & analytics'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-blue-100">
                <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">CampusBook</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-8">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">Register</Link>
            </p>
          </div>

          {/* Quick login cards */}
          <div className="mt-6">
            <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wider font-medium">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Admin', email: 'admin@campus.com', pw: 'admin123', color: 'from-red-500 to-pink-600' },
                { label: 'Staff', email: 'staff@campus.com', pw: 'staff123', color: 'from-blue-500 to-indigo-600' },
                { label: 'Student', email: 'student@campus.com', pw: 'student123', color: 'from-emerald-500 to-teal-600' },
              ].map((demo) => (
                <button
                  key={demo.label}
                  onClick={() => quickLogin(demo.email, demo.pw)}
                  className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <span className="text-xs font-bold text-white">{demo.label[0]}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{demo.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{demo.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
