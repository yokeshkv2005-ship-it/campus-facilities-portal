'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getFacilities, getDepartments, addBooking, checkAvailability, addNotification, addActivityLog, addProgram, calculateLateBookingFine, getFacilityById } from '@/lib/mockData';
import { PageHeader } from '@/components/ui/SharedComponents';
import { BookOpen, Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AmPmTimePicker = ({ value, onChange, error }: { value: string, onChange: (v: string) => void, error?: string }) => {
  const [hour, min] = value ? value.split(':') : ['10', '00'];
  let h = parseInt(hour || '10');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  const handleHourChange = (newH: string) => {
    let nh = parseInt(newH);
    if (ampm === 'PM' && nh !== 12) nh += 12;
    if (ampm === 'AM' && nh === 12) nh = 0;
    onChange(`${nh.toString().padStart(2, '0')}:${min}`);
  }

  const handleMinChange = (newM: string) => {
    onChange(`${hour}:${newM}`);
  }

  const handleAmPmChange = (newAmPm: string) => {
    let nh = parseInt(hour);
    if (newAmPm === 'PM' && nh < 12) nh += 12;
    if (newAmPm === 'AM' && nh >= 12) nh -= 12;
    onChange(`${nh.toString().padStart(2, '0')}:${min}`);
  }

  return (
    <div className="flex gap-1 sm:gap-1.5 items-center">
      <select value={h.toString()} onChange={(e) => handleHourChange(e.target.value)} className={`flex-1 min-w-0 px-2 py-2 sm:py-2.5 border rounded-xl text-xs sm:text-sm focus:ring-2 outline-none bg-white ${error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => <option key={num} value={num.toString()}>{num.toString().padStart(2, '0')}</option>)}
      </select>
      <span className="self-center font-bold text-slate-400 text-xs sm:text-sm">:</span>
      <select value={min} onChange={(e) => handleMinChange(e.target.value)} className={`flex-1 min-w-0 px-2 py-2 sm:py-2.5 border rounded-xl text-xs sm:text-sm focus:ring-2 outline-none bg-white ${error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}>
        {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={ampm} onChange={(e) => handleAmPmChange(e.target.value)} className={`flex-1 min-w-0 px-2 py-2 sm:py-2.5 border rounded-xl text-xs sm:text-sm focus:ring-2 outline-none bg-white font-medium text-slate-700 ${error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}

export default function BookFacilityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilities = getFacilities().filter(f => f.availability_status === 'available');
  const departments = getDepartments();

  const [form, setForm] = useState({
    facility_id: parseInt(searchParams.get('facility') || '0') || (facilities[0]?.facility_id || 0),
    event_title: '',
    department_id: user?.department_id || 1,
    booking_date: '',
    start_time: '10:00',
    end_time: '11:00',
    participants_count: '',
    purpose: '',
    description: '',
    organizer_name: user?.name || '',
  });
  const [document, setDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availStatus, setAvailStatus] = useState<'idle' | 'available' | 'unavailable'>('idle');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedFacility = getFacilityById(form.facility_id);

  // Check availability when relevant fields change
  useEffect(() => {
    if (form.facility_id && form.booking_date && form.start_time && form.end_time && form.end_time > form.start_time) {
      const available = checkAvailability(form.facility_id, form.booking_date, form.start_time, form.end_time);
      setAvailStatus(available ? 'available' : 'unavailable');
    } else {
      setAvailStatus('idle');
    }
  }, [form.facility_id, form.booking_date, form.start_time, form.end_time]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.event_title.trim()) errs.event_title = 'Event title is required';
    if (!form.booking_date) errs.booking_date = 'Date is required';
    else {
      const today = new Date().toISOString().split('T')[0];
      if (form.booking_date < today) errs.booking_date = 'Date cannot be in the past';
    }
    if (!form.start_time) errs.start_time = 'Start time is required';
    if (!form.end_time) errs.end_time = 'End time is required';
    else if (form.end_time <= form.start_time) errs.end_time = 'End time must be after start time';
    if (!form.participants_count) errs.participants_count = 'Number of participants is required';
    else if (selectedFacility && parseInt(form.participants_count) > selectedFacility.capacity) {
      errs.participants_count = `Cannot exceed facility capacity of ${selectedFacility.capacity}`;
    }
    if (!form.purpose.trim()) errs.purpose = 'Purpose is required';
    if (!form.organizer_name.trim()) errs.organizer_name = 'Organizer name is required';
    if (availStatus === 'unavailable') errs.availability = 'Facility is not available for the selected time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setLoading(true);

    setTimeout(() => {
      // Create program first
      const program = addProgram({
        title: form.event_title,
        description: form.description,
        organizer_id: user.user_id,
        department_id: form.department_id,
        facility_id: form.facility_id,
        program_date: form.booking_date,
        start_time: form.start_time,
        end_time: form.end_time,
        expected_audience: parseInt(form.participants_count),
        status: 'draft',
      });

      // Calculate late booking fine
      const lateFine = calculateLateBookingFine(form.booking_date, form.start_time);

      // Create booking
      const booking = addBooking({
        user_id: user.user_id,
        facility_id: form.facility_id,
        program_id: program.program_id,
        booking_date: form.booking_date,
        start_time: form.start_time,
        end_time: form.end_time,
        participants_count: parseInt(form.participants_count),
        purpose: form.purpose,
        event_title: form.event_title,
        organizer_name: form.organizer_name,
        department_id: form.department_id,
        description: form.description,
        document_name: document?.name,
        document_type: document?.type,
        document_verification: document ? 'pending' : undefined,
      });

      // Notification to user
      addNotification({
        user_id: user.user_id,
        booking_id: booking.booking_id,
        title: 'Booking Submitted',
        message: `Your booking for ${selectedFacility?.facility_name} on ${form.booking_date} has been submitted successfully.`,
        notification_type: 'booking_submitted',
        is_read: false,
      });

      // Notification to admin (user_id = 1)
      addNotification({
        user_id: 1,
        booking_id: booking.booking_id,
        title: 'New Booking Request',
        message: `${user.name} has submitted a booking request for ${selectedFacility?.facility_name}.`,
        notification_type: 'booking_submitted',
        is_read: false,
      });

      // Activity log
      addActivityLog({
        user_id: user.user_id,
        action: 'create_booking',
        module: 'Bookings',
        description: `Created booking #${booking.booking_id} for ${selectedFacility?.facility_name}`,
      });

      setLoading(false);
      setShowSuccess(true);
    }, 800);
  };

  const updateField = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center max-w-md shadow-xl">
          <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Booking Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">Your booking request has been submitted successfully. The admin will review and approve your request.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/bookings')} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
              View My Bookings
            </button>
            <button onClick={() => { setShowSuccess(false); setForm({ ...form, event_title: '', booking_date: '', start_time: '10:00', end_time: '11:00', participants_count: '', purpose: '', description: '' }); setDocument(null); }} className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Book a Facility" subtitle="Fill in the details to submit a booking request" />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Facility & Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Facility *</label>
              <select value={form.facility_id} onChange={(e) => updateField('facility_id', parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                {facilities.map(f => <option key={f.facility_id} value={f.facility_id}>{f.facility_name} (Capacity: {f.capacity})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <input type="date" value={form.booking_date} onChange={(e) => updateField('booking_date', e.target.value)} min={new Date().toISOString().split('T')[0]} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none ${errors.booking_date ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.booking_date && <p className="text-xs text-red-500 mt-1">{errors.booking_date}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time *</label>
                <AmPmTimePicker value={form.start_time} onChange={(v) => updateField('start_time', v)} error={errors.start_time} />
                {errors.start_time && <p className="text-xs text-red-500 mt-1">{errors.start_time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time *</label>
                <AmPmTimePicker value={form.end_time} onChange={(v) => updateField('end_time', v)} error={errors.end_time} />
                {errors.end_time && <p className="text-xs text-red-500 mt-1">{errors.end_time}</p>}
              </div>
            </div>
          </div>

          {/* Availability indicator */}
          {availStatus !== 'idle' && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${availStatus === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {availStatus === 'available' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {availStatus === 'available' ? 'Facility is available for the selected time slot.' : 'Facility is NOT available for the selected time slot. Please choose a different time.'}
            </div>
          )}
          {errors.availability && <p className="text-xs text-red-500 mt-2">{errors.availability}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Event Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Event / Program Title *</label>
              <input type="text" value={form.event_title} onChange={(e) => updateField('event_title', e.target.value)} placeholder="e.g., Annual Tech Symposium" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none ${errors.event_title ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.event_title && <p className="text-xs text-red-500 mt-1">{errors.event_title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organizer Name *</label>
              <input type="text" value={form.organizer_name} onChange={(e) => updateField('organizer_name', e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none ${errors.organizer_name ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.organizer_name && <p className="text-xs text-red-500 mt-1">{errors.organizer_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
              <select value={form.department_id} onChange={(e) => updateField('department_id', parseInt(e.target.value))} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expected Participants *</label>
              <input type="number" value={form.participants_count} onChange={(e) => updateField('participants_count', e.target.value)} placeholder="Enter number" min="1" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none ${errors.participants_count ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.participants_count && <p className="text-xs text-red-500 mt-1">{errors.participants_count}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purpose *</label>
              <input type="text" value={form.purpose} onChange={(e) => updateField('purpose', e.target.value)} placeholder="e.g., Seminar, Workshop, Meeting" className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 outline-none ${errors.purpose ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`} />
              {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} placeholder="Additional details about the event..." className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Document Upload</h3>
          <p className="text-sm text-slate-500 mb-4">Upload invitation letter, program notice, or event approval document (PDF, DOC, DOCX, JPG, PNG - Max 5MB)</p>
          {!document ? (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500 font-medium">Click to upload or drag & drop</span>
              <span className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 5MB)</span>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => { if (e.target.files?.[0]) setDocument(e.target.files[0]); }} />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{document.name}</p>
                <p className="text-xs text-slate-500">{(document.size / 1024).toFixed(1)} KB</p>
              </div>
              <button type="button" onClick={() => setDocument(null)} className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200/50 transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><BookOpen className="w-4 h-4" /> Submit Booking Request</>}
          </button>
        </div>
      </form>
    </div>
  );
}
