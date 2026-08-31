// Mock Data for Campus Facilities Booking Portal
// This file provides the initial seed data and LocalStorage persistence utilities

export interface User {
  user_id: number;
  role: 'admin' | 'staff' | 'student';
  department_id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  status: 'active' | 'inactive';
  avatar?: string;
  created_at: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  department_code: string;
  status: 'active' | 'inactive';
}

export interface FacilityType {
  facility_type_id: number;
  type_name: string;
}

export interface Facility {
  facility_id: number;
  facility_type_id: number;
  facility_name: string;
  capacity: number;
  location: string;
  description: string;
  availability_status: 'available' | 'maintenance' | 'unavailable';
  image: string;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  facility_id: number;
  program_id: number | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  participants_count: number;
  purpose: string;
  event_title: string;
  organizer_name: string;
  department_id: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  admin_remarks: string;
  fine_amount: number;
  document_name?: string;
  document_type?: string;
  document_verification?: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Program {
  program_id: number;
  title: string;
  description: string;
  organizer_id: number;
  department_id: number;
  facility_id: number | null;
  program_date: string;
  start_time: string;
  end_time: string;
  expected_audience: number;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  booking_id: number | null;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface Fine {
  fine_id: number;
  booking_id: number;
  user_id: number;
  reason: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'waived';
  issued_at: string;
  paid_at: string | null;
}

export interface Cancellation {
  cancellation_id: number;
  booking_id: number;
  cancelled_by: number;
  reason: string;
  penalty_amount: number;
  cancelled_at: string;
}

export interface ActivityLog {
  log_id: number;
  user_id: number;
  action: string;
  module: string;
  description: string;
  created_at: string;
}

export interface SystemSetting {
  setting_key: string;
  setting_value: string;
  description: string;
}

// ============ SEED DATA ============

const seedDepartments: Department[] = [
  { department_id: 1, department_name: 'Computer Applications', department_code: 'MCA', status: 'active' },
  { department_id: 2, department_name: 'Computer Science', department_code: 'CS', status: 'active' },
  { department_id: 3, department_name: 'Information Technology', department_code: 'IT', status: 'active' },
  { department_id: 4, department_name: 'Electronics & Communication', department_code: 'EC', status: 'active' },
  { department_id: 5, department_name: 'Mechanical Engineering', department_code: 'ME', status: 'active' },
  { department_id: 6, department_name: 'Civil Engineering', department_code: 'CE', status: 'active' },
];

const seedFacilityTypes: FacilityType[] = [
  { facility_type_id: 1, type_name: 'Auditorium' },
  { facility_type_id: 2, type_name: 'Seminar Hall' },
  { facility_type_id: 3, type_name: 'Laboratory' },
  { facility_type_id: 4, type_name: 'Smart Classroom' },
  { facility_type_id: 5, type_name: 'Conference Hall' },
  { facility_type_id: 6, type_name: 'Innovation Lab' },
];

const seedUsers: User[] = [
  { user_id: 1, role: 'admin', department_id: 1, name: 'Dr. Rajesh Kumar', email: 'admin@campus.com', password: 'admin123', phone: '9876543210', status: 'active', created_at: '2025-01-15T09:00:00' },
  { user_id: 2, role: 'staff', department_id: 1, name: 'Prof. Anitha Menon', email: 'staff@campus.com', password: 'staff123', phone: '9876543211', status: 'active', created_at: '2025-02-10T09:00:00' },
  { user_id: 3, role: 'student', department_id: 1, name: 'Arun Sharma', email: 'student@campus.com', password: 'student123', phone: '9876543212', status: 'active', created_at: '2025-03-05T09:00:00' },
  { user_id: 4, role: 'staff', department_id: 2, name: 'Prof. Suresh Nair', email: 'suresh@campus.com', password: 'staff123', phone: '9876543213', status: 'active', created_at: '2025-02-15T09:00:00' },
  { user_id: 5, role: 'staff', department_id: 3, name: 'Prof. Lakshmi Priya', email: 'lakshmi@campus.com', password: 'staff123', phone: '9876543214', status: 'active', created_at: '2025-02-20T09:00:00' },
  { user_id: 6, role: 'staff', department_id: 4, name: 'Prof. Mohan Das', email: 'mohan@campus.com', password: 'staff123', phone: '9876543215', status: 'active', created_at: '2025-03-01T09:00:00' },
  { user_id: 7, role: 'staff', department_id: 2, name: 'Prof. Deepa Krishnan', email: 'deepa@campus.com', password: 'staff123', phone: '9876543216', status: 'active', created_at: '2025-03-10T09:00:00' },
  { user_id: 8, role: 'student', department_id: 2, name: 'Priya Rajan', email: 'priya@campus.com', password: 'student123', phone: '9876543217', status: 'active', created_at: '2025-04-01T09:00:00' },
  { user_id: 9, role: 'student', department_id: 3, name: 'Karthik Nambiar', email: 'karthik@campus.com', password: 'student123', phone: '9876543218', status: 'active', created_at: '2025-04-05T09:00:00' },
  { user_id: 10, role: 'student', department_id: 1, name: 'Sneha Thomas', email: 'sneha@campus.com', password: 'student123', phone: '9876543219', status: 'active', created_at: '2025-04-10T09:00:00' },
  { user_id: 11, role: 'student', department_id: 4, name: 'Vishnu Prasad', email: 'vishnu@campus.com', password: 'student123', phone: '9876543220', status: 'active', created_at: '2025-04-15T09:00:00' },
  { user_id: 12, role: 'student', department_id: 2, name: 'Amala George', email: 'amala@campus.com', password: 'student123', phone: '9876543221', status: 'active', created_at: '2025-05-01T09:00:00' },
  { user_id: 13, role: 'student', department_id: 3, name: 'Rahul Menon', email: 'rahul@campus.com', password: 'student123', phone: '9876543222', status: 'active', created_at: '2025-05-10T09:00:00' },
  { user_id: 14, role: 'student', department_id: 1, name: 'Divya Pillai', email: 'divya@campus.com', password: 'student123', phone: '9876543223', status: 'active', created_at: '2025-05-15T09:00:00' },
  { user_id: 15, role: 'student', department_id: 4, name: 'Ajith Kumar', email: 'ajith@campus.com', password: 'student123', phone: '9876543224', status: 'active', created_at: '2025-06-01T09:00:00' },
  { user_id: 16, role: 'student', department_id: 5, name: 'Meera Subramaniam', email: 'meera@campus.com', password: 'student123', phone: '9876543225', status: 'active', created_at: '2025-06-05T09:00:00' },
];

const seedFacilities: Facility[] = [
  { facility_id: 1, facility_type_id: 1, facility_name: 'Main Auditorium', capacity: 500, location: 'Block A, Ground Floor', description: 'State-of-the-art auditorium with advanced sound system, stage lighting, and seating for 500. Ideal for convocations, cultural events, and large-scale presentations.', availability_status: 'available', image: '/facilities/auditorium.jpg', amenities: ['Sound System', 'Projector', 'Stage Lighting', 'AC', 'Wi-Fi', 'Podium'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 2, facility_type_id: 2, facility_name: 'Seminar Hall A', capacity: 120, location: 'Block B, 2nd Floor', description: 'Modern seminar hall equipped with projector, whiteboard and comfortable seating for academic seminars and workshops.', availability_status: 'available', image: '/facilities/seminar-a.jpg', amenities: ['Projector', 'Whiteboard', 'AC', 'Wi-Fi', 'Mic System'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 3, facility_type_id: 2, facility_name: 'Seminar Hall B', capacity: 100, location: 'Block B, 3rd Floor', description: 'Well-equipped seminar hall with video conferencing capabilities, suitable for guest lectures and departmental events.', availability_status: 'available', image: '/facilities/seminar-b.jpg', amenities: ['Projector', 'Video Conferencing', 'AC', 'Wi-Fi'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 4, facility_type_id: 3, facility_name: 'S2 Laboratory', capacity: 60, location: 'Block C, 1st Floor', description: 'Advanced computing laboratory with high-performance workstations, suitable for programming labs and hackathons.', availability_status: 'available', image: '/facilities/lab-s2.jpg', amenities: ['Workstations', 'Projector', 'AC', 'High-Speed Internet'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 5, facility_type_id: 3, facility_name: 'S3 Laboratory', capacity: 50, location: 'Block C, 2nd Floor', description: 'Networking and hardware laboratory with specialized equipment for practical sessions and project work.', availability_status: 'available', image: '/facilities/lab-s3.jpg', amenities: ['Workstations', 'Networking Equipment', 'AC', 'Internet'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 6, facility_type_id: 4, facility_name: 'Smart Classroom 1', capacity: 40, location: 'Block B, 1st Floor', description: 'Technology-enhanced classroom with smart board, recording setup, and interactive learning tools.', availability_status: 'available', image: '/facilities/smart-1.jpg', amenities: ['Smart Board', 'Recording System', 'AC', 'Wi-Fi', 'Document Camera'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 7, facility_type_id: 4, facility_name: 'Smart Classroom 2', capacity: 35, location: 'Block D, 1st Floor', description: 'Interactive smart classroom with digital podium, LED display and collaborative learning space.', availability_status: 'available', image: '/facilities/smart-2.jpg', amenities: ['LED Display', 'Digital Podium', 'AC', 'Wi-Fi'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 8, facility_type_id: 5, facility_name: 'Conference Hall', capacity: 30, location: 'Admin Block, 3rd Floor', description: 'Executive conference hall with U-shaped seating, video conferencing, and presentation facilities for meetings and discussions.', availability_status: 'available', image: '/facilities/conference.jpg', amenities: ['Video Conferencing', 'Projector', 'AC', 'Whiteboard', 'Wi-Fi'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 9, facility_type_id: 6, facility_name: 'Innovation Lab', capacity: 25, location: 'Block E, Ground Floor', description: 'Collaborative innovation space with 3D printers, prototyping tools, and flexible workspace for student projects and research.', availability_status: 'available', image: '/facilities/innovation.jpg', amenities: ['3D Printer', 'Prototyping Tools', 'AC', 'Wi-Fi', 'Workbenches'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
  { facility_id: 10, facility_type_id: 3, facility_name: 'Computer Laboratory', capacity: 80, location: 'Block C, Ground Floor', description: 'Large computer laboratory with 80 systems, suitable for large batch programming sessions, exams, and workshops.', availability_status: 'available', image: '/facilities/comp-lab.jpg', amenities: ['Desktop Systems', 'Projector', 'AC', 'High-Speed Internet', 'Printer'], created_at: '2025-01-01T00:00:00', updated_at: '2025-01-01T00:00:00' },
];

// Generate dates relative to "today"
function getDateStr(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const seedBookings: Booking[] = [
  { booking_id: 1001, user_id: 2, facility_id: 1, program_id: null, booking_date: getDateStr(3), start_time: '09:00', end_time: '12:00', participants_count: 200, purpose: 'Annual Technical Symposium', event_title: 'TechFest 2026', organizer_name: 'Prof. Anitha Menon', department_id: 1, description: 'Annual technical symposium featuring guest speakers and student project exhibitions.', status: 'approved', admin_remarks: 'Approved. Please ensure cleanup after event.', fine_amount: 0, document_name: 'techfest_invite.pdf', document_type: 'application/pdf', document_verification: 'verified', created_at: '2025-07-01T10:00:00', updated_at: '2025-07-02T14:00:00' },
  { booking_id: 1002, user_id: 3, facility_id: 2, program_id: null, booking_date: getDateStr(5), start_time: '14:00', end_time: '16:00', participants_count: 80, purpose: 'MCA Project Presentation', event_title: 'MCA Project Demo Day', organizer_name: 'Arun Sharma', department_id: 1, description: 'Final year MCA students presenting their projects to faculty panel.', status: 'pending', admin_remarks: '', fine_amount: 0, document_name: 'project_demo_notice.pdf', document_type: 'application/pdf', document_verification: 'pending', created_at: '2025-07-10T11:00:00', updated_at: '2025-07-10T11:00:00' },
  { booking_id: 1003, user_id: 4, facility_id: 8, program_id: null, booking_date: getDateStr(2), start_time: '10:00', end_time: '12:00', participants_count: 25, purpose: 'Department Meeting', event_title: 'CS Department Review', organizer_name: 'Prof. Suresh Nair', department_id: 2, description: 'Quarterly department review meeting for Computer Science faculty.', status: 'approved', admin_remarks: 'Approved.', fine_amount: 0, created_at: '2025-07-05T09:00:00', updated_at: '2025-07-06T10:00:00' },
  { booking_id: 1004, user_id: 5, facility_id: 6, program_id: null, booking_date: getDateStr(7), start_time: '09:00', end_time: '11:00', participants_count: 35, purpose: 'Workshop', event_title: 'AI/ML Workshop', organizer_name: 'Prof. Lakshmi Priya', department_id: 3, description: 'Hands-on workshop on AI and Machine Learning fundamentals.', status: 'pending', admin_remarks: '', fine_amount: 0, document_name: 'aiml_workshop.pdf', document_type: 'application/pdf', document_verification: 'pending', created_at: '2025-07-12T08:00:00', updated_at: '2025-07-12T08:00:00' },
  { booking_id: 1005, user_id: 8, facility_id: 4, program_id: null, booking_date: getDateStr(-5), start_time: '14:00', end_time: '17:00', participants_count: 50, purpose: 'Coding Competition', event_title: 'Code Sprint 2026', organizer_name: 'Priya Rajan', department_id: 2, description: 'Inter-departmental coding competition.', status: 'completed', admin_remarks: 'Event completed successfully.', fine_amount: 0, created_at: '2025-06-20T10:00:00', updated_at: '2025-06-28T17:00:00' },
  { booking_id: 1006, user_id: 9, facility_id: 3, program_id: null, booking_date: getDateStr(-2), start_time: '10:00', end_time: '13:00', participants_count: 60, purpose: 'Guest Lecture', event_title: 'Industry Expert Talk', organizer_name: 'Karthik Nambiar', department_id: 3, description: 'Guest lecture by industry expert on Cloud Computing.', status: 'rejected', admin_remarks: 'Facility under maintenance on that date. Please reschedule.', fine_amount: 0, created_at: '2025-06-25T09:00:00', updated_at: '2025-06-26T11:00:00' },
  { booking_id: 1007, user_id: 2, facility_id: 9, program_id: null, booking_date: getDateStr(10), start_time: '09:00', end_time: '17:00', participants_count: 20, purpose: 'Hackathon', event_title: 'Innovation Hackathon', organizer_name: 'Prof. Anitha Menon', department_id: 1, description: '24-hour innovation hackathon for MCA students.', status: 'approved', admin_remarks: 'Approved. Overnight access granted.', fine_amount: 0, document_name: 'hackathon_invite.pdf', document_type: 'application/pdf', document_verification: 'verified', created_at: '2025-07-15T10:00:00', updated_at: '2025-07-16T09:00:00' },
  { booking_id: 1008, user_id: 10, facility_id: 2, program_id: null, booking_date: getDateStr(-10), start_time: '11:00', end_time: '13:00', participants_count: 100, purpose: 'Seminar', event_title: 'Cybersecurity Awareness', organizer_name: 'Sneha Thomas', department_id: 1, description: 'Awareness seminar on cybersecurity best practices.', status: 'cancelled', admin_remarks: '', fine_amount: 50, created_at: '2025-06-10T08:00:00', updated_at: '2025-06-12T10:00:00' },
];

const seedPrograms: Program[] = [
  { program_id: 1, title: 'TechFest 2026', description: 'Annual technical symposium', organizer_id: 2, department_id: 1, facility_id: 1, program_date: getDateStr(3), start_time: '09:00', end_time: '12:00', expected_audience: 200, status: 'scheduled', created_at: '2025-07-02T14:00:00' },
  { program_id: 2, title: 'CS Department Review', description: 'Quarterly department review meeting', organizer_id: 4, department_id: 2, facility_id: 8, program_date: getDateStr(2), start_time: '10:00', end_time: '12:00', expected_audience: 25, status: 'scheduled', created_at: '2025-07-06T10:00:00' },
  { program_id: 3, title: 'Innovation Hackathon', description: 'Innovation hackathon for MCA students', organizer_id: 2, department_id: 1, facility_id: 9, program_date: getDateStr(10), start_time: '09:00', end_time: '17:00', expected_audience: 20, status: 'scheduled', created_at: '2025-07-16T09:00:00' },
  { program_id: 4, title: 'Code Sprint 2026', description: 'Inter-departmental coding competition', organizer_id: 8, department_id: 2, facility_id: 4, program_date: getDateStr(-5), start_time: '14:00', end_time: '17:00', expected_audience: 50, status: 'completed', created_at: '2025-06-21T10:00:00' },
];

const seedNotifications: Notification[] = [
  { notification_id: 1, user_id: 2, booking_id: 1001, title: 'Booking Approved', message: 'Your booking for Main Auditorium on ' + getDateStr(3) + ' has been approved.', notification_type: 'booking_approved', is_read: false, created_at: '2025-07-02T14:00:00' },
  { notification_id: 2, user_id: 3, booking_id: 1002, title: 'Booking Submitted', message: 'Your booking request for Seminar Hall A has been submitted successfully.', notification_type: 'booking_submitted', is_read: false, created_at: '2025-07-10T11:00:00' },
  { notification_id: 3, user_id: 1, booking_id: 1002, title: 'New Booking Request', message: 'Arun Sharma has submitted a booking request for Seminar Hall A.', notification_type: 'booking_submitted', is_read: false, created_at: '2025-07-10T11:01:00' },
  { notification_id: 4, user_id: 1, booking_id: 1004, title: 'New Booking Request', message: 'Prof. Lakshmi Priya has submitted a booking request for Smart Classroom 1.', notification_type: 'booking_submitted', is_read: false, created_at: '2025-07-12T08:01:00' },
  { notification_id: 5, user_id: 9, booking_id: 1006, title: 'Booking Rejected', message: 'Your booking for Seminar Hall B has been rejected. Reason: Facility under maintenance.', notification_type: 'booking_rejected', is_read: true, created_at: '2025-06-26T11:00:00' },
  { notification_id: 6, user_id: 10, booking_id: 1008, title: 'Fine Generated', message: 'A fine of ₹50 has been generated for late cancellation of your booking.', notification_type: 'fine_generated', is_read: false, created_at: '2025-06-12T10:00:00' },
];

const seedFines: Fine[] = [
  { fine_id: 1, booking_id: 1008, user_id: 10, reason: 'Late cancellation of booking', amount: 50, status: 'unpaid', issued_at: '2025-06-12T10:00:00', paid_at: null },
];

const seedCancellations: Cancellation[] = [
  { cancellation_id: 1, booking_id: 1008, cancelled_by: 10, reason: 'Unable to attend due to personal reasons.', penalty_amount: 50, cancelled_at: '2025-06-12T10:00:00' },
];

const seedActivityLogs: ActivityLog[] = [
  { log_id: 1, user_id: 1, action: 'login', module: 'Auth', description: 'Admin logged in', created_at: '2025-07-01T09:00:00' },
  { log_id: 2, user_id: 2, action: 'create_booking', module: 'Bookings', description: 'Created booking #1001 for Main Auditorium', created_at: '2025-07-01T10:00:00' },
  { log_id: 3, user_id: 1, action: 'approve_booking', module: 'Bookings', description: 'Approved booking #1001 for TechFest 2026', created_at: '2025-07-02T14:00:00' },
  { log_id: 4, user_id: 3, action: 'create_booking', module: 'Bookings', description: 'Created booking #1002 for Seminar Hall A', created_at: '2025-07-10T11:00:00' },
  { log_id: 5, user_id: 1, action: 'reject_booking', module: 'Bookings', description: 'Rejected booking #1006 for Seminar Hall B', created_at: '2025-06-26T11:00:00' },
  { log_id: 6, user_id: 10, action: 'cancel_booking', module: 'Bookings', description: 'Cancelled booking #1008 for Seminar Hall A', created_at: '2025-06-12T10:00:00' },
  { log_id: 7, user_id: 1, action: 'generate_fine', module: 'Fines', description: 'Generated fine of ₹50 for user Sneha Thomas', created_at: '2025-06-12T10:01:00' },
  { log_id: 8, user_id: 5, action: 'create_booking', module: 'Bookings', description: 'Created booking #1004 for Smart Classroom 1', created_at: '2025-07-12T08:00:00' },
];

const seedSettings: SystemSetting[] = [
  { setting_key: 'LATE_BOOKING_THRESHOLD_HOURS', setting_value: '24', description: 'Minimum hours before event for a normal booking (less than this = late booking)' },
  { setting_key: 'LATE_BOOKING_FINE', setting_value: '50', description: 'Fine amount (₹) for late booking' },
  { setting_key: 'LATE_CANCELLATION_THRESHOLD_HOURS', setting_value: '48', description: 'Hours before event where cancellation incurs a fine' },
  { setting_key: 'CANCELLATION_FINE', setting_value: '100', description: 'Fine (₹) for late cancellation' },
  { setting_key: 'VERY_LATE_CANCELLATION_THRESHOLD_HOURS', setting_value: '12', description: 'Hours before event for very late cancellation' },
  { setting_key: 'VERY_LATE_CANCELLATION_FINE', setting_value: '200', description: 'Fine (₹) for very late cancellation' },
  { setting_key: 'MAX_BOOKING_DAYS_AHEAD', setting_value: '90', description: 'Maximum days in advance a booking can be made' },
  { setting_key: 'ENABLE_NOTIFICATIONS', setting_value: 'true', description: 'Enable/disable notification system' },
  { setting_key: 'INSTITUTION_NAME', setting_value: 'National Institute of Technology', description: 'Institution name displayed in the system' },
];

// ============ LOCAL STORAGE HELPERS ============

const STORAGE_KEYS = {
  USERS: 'cfb_users',
  DEPARTMENTS: 'cfb_departments',
  FACILITY_TYPES: 'cfb_facility_types',
  FACILITIES: 'cfb_facilities',
  BOOKINGS: 'cfb_bookings',
  PROGRAMS: 'cfb_programs',
  NOTIFICATIONS: 'cfb_notifications',
  FINES: 'cfb_fines',
  CANCELLATIONS: 'cfb_cancellations',
  ACTIVITY_LOGS: 'cfb_activity_logs',
  SETTINGS: 'cfb_settings',
  CURRENT_USER: 'cfb_current_user',
  INITIALIZED: 'cfb_initialized',
};

function getFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  if (data) {
    try { return JSON.parse(data); } catch { return fallback; }
  }
  return fallback;
}

function setToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeMockData(): void {
  if (typeof window === 'undefined') return;
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  setToStorage(STORAGE_KEYS.DEPARTMENTS, seedDepartments);
  setToStorage(STORAGE_KEYS.FACILITY_TYPES, seedFacilityTypes);
  setToStorage(STORAGE_KEYS.USERS, seedUsers);
  setToStorage(STORAGE_KEYS.FACILITIES, seedFacilities);
  setToStorage(STORAGE_KEYS.BOOKINGS, seedBookings);
  setToStorage(STORAGE_KEYS.PROGRAMS, seedPrograms);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, seedNotifications);
  setToStorage(STORAGE_KEYS.FINES, seedFines);
  setToStorage(STORAGE_KEYS.CANCELLATIONS, seedCancellations);
  setToStorage(STORAGE_KEYS.ACTIVITY_LOGS, seedActivityLogs);
  setToStorage(STORAGE_KEYS.SETTINGS, seedSettings);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export function resetMockData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  initializeMockData();
}

// ============ DATA ACCESS FUNCTIONS ============

// --- Users ---
export function getUsers(): User[] { return getFromStorage<User>(STORAGE_KEYS.USERS, seedUsers); }
export function getUserById(id: number): User | undefined { return getUsers().find(u => u.user_id === id); }
export function updateUser(id: number, data: Partial<User>): User | undefined {
  const users = getUsers();
  const idx = users.findIndex(u => u.user_id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...data };
  setToStorage(STORAGE_KEYS.USERS, users);
  return users[idx];
}
export function addUser(data: Omit<User, 'user_id' | 'created_at'>): User {
  const users = getUsers();
  const newUser: User = { ...data, user_id: Math.max(0, ...users.map(u => u.user_id)) + 1, created_at: new Date().toISOString() };
  users.push(newUser);
  setToStorage(STORAGE_KEYS.USERS, users);
  return newUser;
}

// --- Departments ---
export function getDepartments(): Department[] { return getFromStorage<Department>(STORAGE_KEYS.DEPARTMENTS, seedDepartments); }
export function getDepartmentById(id: number): Department | undefined { return getDepartments().find(d => d.department_id === id); }

// --- Facility Types ---
export function getFacilityTypes(): FacilityType[] { return getFromStorage<FacilityType>(STORAGE_KEYS.FACILITY_TYPES, seedFacilityTypes); }

// --- Facilities ---
export function getFacilities(): Facility[] { return getFromStorage<Facility>(STORAGE_KEYS.FACILITIES, seedFacilities); }
export function getFacilityById(id: number): Facility | undefined { return getFacilities().find(f => f.facility_id === id); }
export function addFacility(data: Omit<Facility, 'facility_id' | 'created_at' | 'updated_at'>): Facility {
  const facilities = getFacilities();
  const newFac: Facility = { ...data, facility_id: Math.max(0, ...facilities.map(f => f.facility_id)) + 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  facilities.push(newFac);
  setToStorage(STORAGE_KEYS.FACILITIES, facilities);
  return newFac;
}
export function updateFacility(id: number, data: Partial<Facility>): Facility | undefined {
  const facilities = getFacilities();
  const idx = facilities.findIndex(f => f.facility_id === id);
  if (idx === -1) return undefined;
  facilities[idx] = { ...facilities[idx], ...data, updated_at: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.FACILITIES, facilities);
  return facilities[idx];
}
export function deleteFacility(id: number): boolean {
  const facilities = getFacilities();
  const filtered = facilities.filter(f => f.facility_id !== id);
  if (filtered.length === facilities.length) return false;
  setToStorage(STORAGE_KEYS.FACILITIES, filtered);
  return true;
}

// --- Availability Check ---
export function checkAvailability(facilityId: number, date: string, startTime: string, endTime: string, excludeBookingId?: number): boolean {
  const bookings = getBookings();
  const conflicting = bookings.filter(b => {
    if (excludeBookingId && b.booking_id === excludeBookingId) return false;
    if (b.facility_id !== facilityId) return false;
    if (b.booking_date !== date) return false;
    if (b.status === 'cancelled' || b.status === 'rejected') return false;
    // Check time overlap
    return b.start_time < endTime && b.end_time > startTime;
  });
  return conflicting.length === 0;
}

// --- Bookings ---
export function getBookings(): Booking[] { return getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS, seedBookings); }
export function getBookingById(id: number): Booking | undefined { return getBookings().find(b => b.booking_id === id); }
export function getBookingsByUser(userId: number): Booking[] { return getBookings().filter(b => b.user_id === userId); }
export function addBooking(data: Omit<Booking, 'booking_id' | 'status' | 'admin_remarks' | 'fine_amount' | 'created_at' | 'updated_at'>): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...data,
    booking_id: Math.max(0, ...bookings.map(b => b.booking_id)) + 1,
    status: 'pending',
    admin_remarks: '',
    fine_amount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  bookings.push(newBooking);
  setToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return newBooking;
}
export function updateBooking(id: number, data: Partial<Booking>): Booking | undefined {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.booking_id === id);
  if (idx === -1) return undefined;
  bookings[idx] = { ...bookings[idx], ...data, updated_at: new Date().toISOString() };
  setToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[idx];
}

// --- Programs ---
export function getPrograms(): Program[] { return getFromStorage<Program>(STORAGE_KEYS.PROGRAMS, seedPrograms); }
export function getProgramById(id: number): Program | undefined { return getPrograms().find(p => p.program_id === id); }
export function addProgram(data: Omit<Program, 'program_id' | 'created_at'>): Program {
  const programs = getPrograms();
  const newProg: Program = { ...data, program_id: Math.max(0, ...programs.map(p => p.program_id)) + 1, created_at: new Date().toISOString() };
  programs.push(newProg);
  setToStorage(STORAGE_KEYS.PROGRAMS, programs);
  return newProg;
}
export function updateProgram(id: number, data: Partial<Program>): Program | undefined {
  const programs = getPrograms();
  const idx = programs.findIndex(p => p.program_id === id);
  if (idx === -1) return undefined;
  programs[idx] = { ...programs[idx], ...data };
  setToStorage(STORAGE_KEYS.PROGRAMS, programs);
  return programs[idx];
}
export function deleteProgram(id: number): boolean {
  const programs = getPrograms();
  const filtered = programs.filter(p => p.program_id !== id);
  if (filtered.length === programs.length) return false;
  setToStorage(STORAGE_KEYS.PROGRAMS, filtered);
  return true;
}

// --- Notifications ---
export function getNotifications(): Notification[] { return getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS, seedNotifications); }
export function getNotificationsByUser(userId: number): Notification[] { return getNotifications().filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); }
export function getUnreadCount(userId: number): number { return getNotificationsByUser(userId).filter(n => !n.is_read).length; }
export function addNotification(data: Omit<Notification, 'notification_id' | 'created_at'>): Notification {
  const notifications = getNotifications();
  const newNotif: Notification = { ...data, notification_id: Math.max(0, ...notifications.map(n => n.notification_id)) + 1, created_at: new Date().toISOString() };
  notifications.push(newNotif);
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return newNotif;
}
export function markNotificationRead(id: number): void {
  const notifications = getNotifications();
  const idx = notifications.findIndex(n => n.notification_id === id);
  if (idx !== -1) { notifications[idx].is_read = true; setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }
}
export function markAllNotificationsRead(userId: number): void {
  const notifications = getNotifications();
  notifications.forEach(n => { if (n.user_id === userId) n.is_read = true; });
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// --- Fines ---
export function getFines(): Fine[] { return getFromStorage<Fine>(STORAGE_KEYS.FINES, seedFines); }
export function getFinesByUser(userId: number): Fine[] { return getFines().filter(f => f.user_id === userId); }
export function addFine(data: Omit<Fine, 'fine_id' | 'issued_at' | 'paid_at'>): Fine {
  const fines = getFines();
  const newFine: Fine = { ...data, fine_id: Math.max(0, ...fines.map(f => f.fine_id)) + 1, issued_at: new Date().toISOString(), paid_at: null };
  fines.push(newFine);
  setToStorage(STORAGE_KEYS.FINES, fines);
  return newFine;
}
export function updateFine(id: number, data: Partial<Fine>): Fine | undefined {
  const fines = getFines();
  const idx = fines.findIndex(f => f.fine_id === id);
  if (idx === -1) return undefined;
  fines[idx] = { ...fines[idx], ...data };
  setToStorage(STORAGE_KEYS.FINES, fines);
  return fines[idx];
}

// --- Cancellations ---
export function getCancellations(): Cancellation[] { return getFromStorage<Cancellation>(STORAGE_KEYS.CANCELLATIONS, seedCancellations); }
export function addCancellation(data: Omit<Cancellation, 'cancellation_id' | 'cancelled_at'>): Cancellation {
  const cancellations = getCancellations();
  const newCancel: Cancellation = { ...data, cancellation_id: Math.max(0, ...cancellations.map(c => c.cancellation_id)) + 1, cancelled_at: new Date().toISOString() };
  cancellations.push(newCancel);
  setToStorage(STORAGE_KEYS.CANCELLATIONS, cancellations);
  return newCancel;
}

// --- Activity Logs ---
export function getActivityLogs(): ActivityLog[] { return getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS, seedActivityLogs).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); }
export function addActivityLog(data: Omit<ActivityLog, 'log_id' | 'created_at'>): ActivityLog {
  const logs = getActivityLogs();
  const newLog: ActivityLog = { ...data, log_id: Math.max(0, ...logs.map(l => l.log_id)) + 1, created_at: new Date().toISOString() };
  logs.push(newLog);
  setToStorage(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  return newLog;
}

// --- System Settings ---
export function getSettings(): SystemSetting[] { return getFromStorage<SystemSetting>(STORAGE_KEYS.SETTINGS, seedSettings); }
export function getSetting(key: string): string | undefined { return getSettings().find(s => s.setting_key === key)?.setting_value; }
export function updateSetting(key: string, value: string): void {
  const settings = getSettings();
  const idx = settings.findIndex(s => s.setting_key === key);
  if (idx !== -1) { settings[idx].setting_value = value; setToStorage(STORAGE_KEYS.SETTINGS, settings); }
}

// --- Auth Helpers ---
export function loginUser(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
  if (user) {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
    addActivityLog({ user_id: user.user_id, action: 'login', module: 'Auth', description: `${user.name} logged in` });
  }
  return user || null;
}
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (data) { try { return JSON.parse(data); } catch { return null; } }
  return null;
}
export function logoutUser(): void {
  const user = getCurrentUser();
  if (user) { addActivityLog({ user_id: user.user_id, action: 'logout', module: 'Auth', description: `${user.name} logged out` }); }
  if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// --- Fine Calculation ---
export function calculateCancellationPenalty(bookingDate: string, startTime: string): number {
  const settings = getSettings();
  const lateThreshold = parseInt(settings.find(s => s.setting_key === 'LATE_CANCELLATION_THRESHOLD_HOURS')?.setting_value || '48');
  const lateFine = parseFloat(settings.find(s => s.setting_key === 'CANCELLATION_FINE')?.setting_value || '100');
  const veryLateThreshold = parseInt(settings.find(s => s.setting_key === 'VERY_LATE_CANCELLATION_THRESHOLD_HOURS')?.setting_value || '12');
  const veryLateFine = parseFloat(settings.find(s => s.setting_key === 'VERY_LATE_CANCELLATION_FINE')?.setting_value || '200');

  const eventDateTime = new Date(`${bookingDate}T${startTime}`);
  const now = new Date();
  const hoursUntilEvent = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilEvent <= veryLateThreshold) return veryLateFine;
  if (hoursUntilEvent <= lateThreshold) return lateFine;
  return 0;
}

export function calculateLateBookingFine(bookingDate: string, startTime: string): number {
  const settings = getSettings();
  const threshold = parseInt(settings.find(s => s.setting_key === 'LATE_BOOKING_THRESHOLD_HOURS')?.setting_value || '24');
  const fine = parseFloat(settings.find(s => s.setting_key === 'LATE_BOOKING_FINE')?.setting_value || '50');

  const eventDateTime = new Date(`${bookingDate}T${startTime}`);
  const now = new Date();
  const hoursUntilEvent = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilEvent < threshold && hoursUntilEvent > 0) return fine;
  return 0;
}
