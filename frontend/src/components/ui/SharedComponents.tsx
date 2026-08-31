'use client';

import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ========== Status Badge ==========
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize', getStatusColor(status))}>
      {status}
    </span>
  );
}

// ========== Dashboard Stat Card ==========
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, color = 'blue' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-pink-600',
    purple: 'from-purple-500 to-violet-600',
    cyan: 'from-cyan-500 to-blue-600',
    indigo: 'from-indigo-500 to-purple-600',
    teal: 'from-teal-500 to-emerald-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-2 font-medium', trendUp ? 'text-emerald-600' : 'text-red-500')}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform', colorMap[color] || colorMap.blue)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ========== Modal ==========
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200', sizeMap[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ========== Confirm Dialog ==========
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }: ConfirmDialogProps) {
  if (!isOpen) return null;

  const icons = {
    danger: <AlertTriangle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const btnColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-200',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-200',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
          {icons[variant]}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={cn('px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors focus:ring-2', btnColors[variant])}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Empty State ==========
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

// ========== Loading Spinner ==========
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// ========== Page Header ==========
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
