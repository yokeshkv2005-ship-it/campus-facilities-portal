import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'approved': case 'scheduled': case 'verified': case 'active': case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'rejected': case 'cancelled': case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'unpaid': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'waived': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
