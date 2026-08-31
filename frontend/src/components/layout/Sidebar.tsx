'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Building2, CalendarDays, BookOpen, Bell, User, ClipboardList,
  Users, Settings, BarChart3, FileText, Activity, DollarSign, Building,
  ChevronLeft, ChevronRight, LogOut, Menu, X,
} from 'lucide-react';

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/facilities', label: 'Facilities', icon: Building2 },
  { href: '/book', label: 'Book Facility', icon: BookOpen },
  { href: '/bookings', label: 'My Bookings', icon: ClipboardList },
  { href: '/programs', label: 'Programs', icon: FileText },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/departments', label: 'Departments', icon: Building },
  { href: '/admin/facilities', label: 'Facilities', icon: Building2 },
  { href: '/admin/bookings', label: 'Booking Requests', icon: ClipboardList },
  { href: '/admin/programs', label: 'Programs', icon: FileText },
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/admin/fines', label: 'Fines', icon: DollarSign },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/activity-logs', label: 'Activity Logs', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const links = user.role === 'admin' ? adminLinks : userLinks;

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/admin' && href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-slate-700/50', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate">Campus Facilities</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Booking Portal</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-2',
                active
                  ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn('border-t border-slate-700/50 p-3', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3 mb-3 px-2', collapsed && 'justify-center px-0')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{user.name.charAt(0)}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 capitalize">{user.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => { logout(); setMobileOpen(false); }}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col transform transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-60'
      )}>
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 p-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-slate-600 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
}
