'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2, CalendarCheck, Shield, Bell, BarChart3, Clock, Users,
  CheckCircle, ArrowRight, Zap, BookOpen, Star, ChevronRight, MapPin,
} from 'lucide-react';

const features = [
  { icon: <Building2 className="w-6 h-6" />, title: 'Easy Facility Booking', desc: 'Browse and book campus facilities with just a few clicks. View details, capacity, and amenities.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Real-Time Availability', desc: 'Check real-time availability of facilities before booking. No more scheduling conflicts.' },
  { icon: <CalendarCheck className="w-6 h-6" />, title: 'Smart Scheduling', desc: 'Intelligent scheduling system that prevents double bookings and overlapping events.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Admin Approval', desc: 'Secure approval workflow with document verification and admin review process.' },
  { icon: <Bell className="w-6 h-6" />, title: 'Instant Notifications', desc: 'Stay updated with real-time notifications for booking status, approvals, and reminders.' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Reports & Analytics', desc: 'Comprehensive reports and analytics for facility utilization and booking trends.' },
];

const steps = [
  { num: '01', title: 'Browse Facilities', desc: 'Explore available campus facilities with detailed information and images.' },
  { num: '02', title: 'Check Availability', desc: 'Select your preferred date and time to check if the facility is available.' },
  { num: '03', title: 'Submit Booking', desc: 'Fill in the event details, upload documents and submit your booking request.' },
  { num: '04', title: 'Get Approved', desc: 'Admin reviews your request, verifies documents and approves the booking.' },
];

const facilities = [
  { name: 'Main Auditorium', type: 'Auditorium', capacity: 500, icon: <Building2 className="w-8 h-8" /> },
  { name: 'Seminar Hall A', type: 'Seminar Hall', capacity: 120, icon: <Users className="w-8 h-8" /> },
  { name: 'Smart Classroom 1', type: 'Smart Classroom', capacity: 40, icon: <BookOpen className="w-8 h-8" /> },
  { name: 'Innovation Lab', type: 'Innovation Lab', capacity: 25, icon: <Zap className="w-8 h-8" /> },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Karpagam Academy Logo" 
              width={160} 
              height={40} 
              className="object-contain h-10 w-auto"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#facilities" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">Facilities</a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
        {/* Transparent Overlay */}
        <div className="absolute inset-0 z-0 bg-slate-900/70 backdrop-blur-[2px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold rounded-full mb-6 backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-blue-300" />
            Smart Campus Management System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Campus Facilities
            <br />
            <span className="text-blue-400">
              Booking & Scheduling
            </span>
            <br />
            Portal
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            A smart digital platform for managing campus facilities, bookings, schedules and programs efficiently. Streamline your campus operations with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-900/50 transition-all text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#facilities" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm backdrop-blur-md">
              Explore Facilities <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[{ num: '10+', label: 'Facilities' }, { num: '500+', label: 'Bookings' }, { num: '50+', label: 'Programs' }, { num: '100%', label: 'Digital' }].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4">
                <p className="text-2xl font-bold text-white">{s.num}</p>
                <p className="text-xs text-blue-200 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Features</p>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Everything You Need</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powerful tools designed to streamline campus facility management from booking to analytics.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Preview */}
      <section id="facilities" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Our Facilities</p>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Available Campus Facilities</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Explore our well-equipped facilities available for booking.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f) => (
              <div key={f.name} className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all duration-300 text-center group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{f.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{f.type}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 font-medium">
                  <Users className="w-3.5 h-3.5" /> {f.capacity} seats
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              View All Facilities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Process</p>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Simple four-step process to book a campus facility.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="bg-white rounded-2xl border border-slate-200/80 p-6 relative hover:shadow-lg transition-all">
                <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mb-3">{s.num}</div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">Join the smart campus management revolution. Register now and start booking facilities seamlessly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="px-7 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:shadow-xl transition-all text-sm">
              Create Account
            </Link>
            <Link href="/login" className="px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">CampusBook</span>
            </div>
            <p className="text-sm">© 2026 Campus Facilities Booking Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
