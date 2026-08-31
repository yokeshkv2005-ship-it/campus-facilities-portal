'use client';

import React, { useState } from 'react';
import { getBookings, getFacilityById, getUserById } from '@/lib/mockData';
import { formatTime } from '@/lib/utils';
import { PageHeader, Modal, StatusBadge } from '@/components/ui/SharedComponents';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  const bookings = getBookings().filter(b => b.status === 'approved' || b.status === 'completed');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.booking_date === dateStr);
  };

  const isToday = (day: number) => {
    const t = new Date();
    return t.getDate() === day && t.getMonth() === month && t.getFullYear() === year;
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const eventColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

  return (
    <div>
      <PageHeader title="Calendar" subtitle="View scheduled events and bookings" />

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-lg font-semibold text-slate-800 min-w-[200px] text-center">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button onClick={today} className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors">Today</button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const events = day ? getEventsForDate(day) : [];
            return (
              <div key={i} className={`min-h-[100px] md:min-h-[120px] border-b border-r border-slate-100 p-1.5 ${!day ? 'bg-slate-50/50' : 'hover:bg-blue-50/30'} transition-colors`}>
                {day && (
                  <>
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 2).map((ev, j) => (
                        <button
                          key={ev.booking_id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] md:text-xs text-white font-medium truncate ${eventColors[j % eventColors.length]} hover:opacity-80 transition-opacity`}
                        >
                          {ev.event_title}
                        </button>
                      ))}
                      {events.length > 2 && (
                        <p className="text-[10px] text-blue-600 font-medium px-1">+{events.length - 2} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event detail modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
        {selectedEvent && (() => {
          const facility = getFacilityById(selectedEvent.facility_id);
          const organizer = getUserById(selectedEvent.user_id);
          return (
            <div className="space-y-3">
              <div><p className="text-xs text-slate-400">Event</p><p className="text-base font-semibold text-slate-800">{selectedEvent.event_title}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-slate-400">Facility</p><p className="text-sm text-slate-700">{facility?.facility_name}</p></div>
                <div><p className="text-xs text-slate-400">Date</p><p className="text-sm text-slate-700">{selectedEvent.booking_date}</p></div>
                <div><p className="text-xs text-slate-400">Time</p><p className="text-sm text-slate-700">{formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}</p></div>
                <div><p className="text-xs text-slate-400">Organizer</p><p className="text-sm text-slate-700">{organizer?.name || selectedEvent.organizer_name}</p></div>
                <div><p className="text-xs text-slate-400">Participants</p><p className="text-sm text-slate-700">{selectedEvent.participants_count}</p></div>
                <div><p className="text-xs text-slate-400">Status</p><StatusBadge status={selectedEvent.status} /></div>
              </div>
              {selectedEvent.description && <div><p className="text-xs text-slate-400">Description</p><p className="text-sm text-slate-600">{selectedEvent.description}</p></div>}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
