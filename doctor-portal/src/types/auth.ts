export type UserRole = 'doctor' | 'patient' | 'pharmacy' | 'pathology' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Doctor extends User {
  role: 'doctor';
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number; // years
  clinicName?: string;
  clinicAddress?: string;
  phoneNumber: string;
  consultationFee?: number;
  availability: {
    days: string[];
    timeSlots: { start: string; end: string }[];
  };
  isVerified: boolean;
  patients: string[]; // patient UIDs
  totalConsultations: number;
  rating: number;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  phoneNumber?: string;
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  assignedDoctor?: string; // doctor UID
}

export interface PharmacyUser extends User {
  role: 'pharmacy';
  pharmacyName: string;
  licenseNumber: string;
  address: string;
  phoneNumber: string;
}

export interface PathologyUser extends User {
  role: 'pathology';
  labName: string;
  licenseNumber: string;
  registrationNumber: string;
  accreditation: string[]; // NABL, CAP, ISO certifications
  address: string;
  phoneNumber: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  services: string[]; // Blood tests, Urine tests, etc.
  operatingHours: {
    start: string;
    end: string;
    days: string[];
  };
  homeCollection: boolean;
  emergencyServices: boolean;
  reportDeliveryMethods: string[]; // Email, SMS, Physical, Portal
  averageTurnaroundTime: number; // hours
  totalTestsCompleted: number;
  rating: number;
  isNABLAccredited: boolean;
  establishedYear: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  // Role-specific fields will be added based on role selection
  [key: string]: any;
}

export interface DoctorSignupData extends SignupData {
  role: 'doctor';
  displayName: string;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  clinicName?: string;
  clinicAddress?: string;
  phoneNumber: string;
  consultationFee?: number;
}

// Queue management types
export interface PatientQueue {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentTime: Date;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  symptoms?: string;
  notes?: string;
  estimatedDuration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  scheduledTime: Date;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency';
  symptoms?: string;
  prescription?: string;
  diagnosis?: string;
  notes?: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  callSessionId?: string; // for video consultations
  createdAt: Date;
  updatedAt: Date;
}
