import { Timestamp } from 'firebase/firestore';

// Medicine interface that matches pharmacy inventory
export interface Medicine {
  id: string;
  medicineName: string;
  genericName: string;
  category: string;
  manufacturer: string;
  unitPrice: number;
  stockQuantity: number;
  expiryDate: string;
  prescriptionRequired: boolean;
  description?: string;
}

// Prescribed medicine with dosage and instructions
export interface PrescribedMedicine {
  medicineId: string;
  medicineName: string;
  genericName: string;
  dosage: string; // e.g., "500mg"
  frequency: string; // e.g., "Twice daily", "Once daily", "As needed"
  duration: string; // e.g., "7 days", "2 weeks", "Until symptoms improve"
  instructions: string; // e.g., "Take after meals", "Take on empty stomach"
  quantity: number; // Total tablets/capsules prescribed
  isAvailable: boolean; // Stock availability
  stockQuantity?: number;
  unitPrice?: number;
}

// Vital signs and measurements
export interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // beats per minute
  temperature?: number; // in Celsius
  weight?: number; // in kg
  height?: number; // in cm
  respiratoryRate?: number;
  oxygenSaturation?: number; // percentage
  bloodSugar?: number; // mg/dL
}

// Chief complaint and symptoms
export interface ChiefComplaint {
  complaint: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  description: string;
}

// Diagnosis information
export interface Diagnosis {
  primary: string; // Primary diagnosis
  secondary?: string[]; // Secondary diagnoses
  icdCode?: string; // ICD-10 code
  diagnosisType: 'Confirmed' | 'Suspected' | 'Rule out';
  notes?: string;
}

// Treatment plan
export interface TreatmentPlan {
  medications: PrescribedMedicine[];
  lifestyle: string[]; // Lifestyle recommendations
  followUp: {
    required: boolean;
    timeframe?: string; // e.g., "1 week", "2 weeks"
    instructions?: string;
  };
  tests?: {
    recommended: string[];
    urgent: boolean;
    instructions?: string;
  };
  referrals?: {
    specialist: string;
    reason: string;
    urgency: 'Routine' | 'Urgent' | 'ASAP';
  }[];
}

// Complete Electronic Health Record
export interface EHR {
  id?: string;
  patientId: string;
  doctorId: string;
  consultationId?: string; // Link to video call session
  
  // Consultation metadata
  consultationDate: Timestamp | Date;
  consultationType: 'Video Call' | 'In-Person' | 'Phone Call';
  duration?: number; // in minutes
  
  // Patient information (snapshot at time of consultation)
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    email?: string;
  };
  
  // Doctor information
  doctorInfo: {
    name: string;
    specialization?: string;
    license?: string;
  };
  
  // Medical information
  chiefComplaint: ChiefComplaint;
  vitalSigns?: VitalSigns;
  diagnosis: Diagnosis;
  treatmentPlan: TreatmentPlan;
  
  // Additional notes
  clinicalNotes?: string;
  patientEducation?: string;
  
  // Status and metadata
  status: 'Draft' | 'Completed' | 'Signed';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  signedAt?: Timestamp | Date;
}

// EHR summary for listing views
export interface EHRSummary {
  id: string;
  patientId: string;
  patientName: string;
  consultationDate: Date;
  primaryDiagnosis: string;
  doctorName: string;
  status: EHR['status'];
  prescriptionCount: number;
}

// Common diseases for quick selection
export interface CommonDisease {
  name: string;
  category: 'Infectious' | 'Chronic' | 'Acute' | 'Mental Health' | 'Other';
  icdCode?: string;
  commonSymptoms: string[];
  recommendedTests?: string[];
}

// Medicine dosage templates
export interface DosageTemplate {
  medicine: string;
  condition: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Form data for EHR creation
export interface EHRFormData {
  // Patient and consultation info (auto-filled)
  patientId: string;
  consultationId?: string;
  
  // Chief complaint
  complaint: string;
  complaintDuration: string;
  complaintSeverity: 'Mild' | 'Moderate' | 'Severe';
  complaintDescription: string;
  
  // Vital signs
  vitalSigns: VitalSigns;
  
  // Diagnosis
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  diagnosisType: 'Confirmed' | 'Suspected' | 'Rule out';
  diagnosisNotes: string;
  
  // Treatment
  prescriptions: PrescribedMedicine[];
  lifestyleRecommendations: string[];
  
  // Follow up
  followUpRequired: boolean;
  followUpTimeframe: string;
  followUpInstructions: string;
  
  // Tests and referrals
  recommendedTests: string[];
  testsUrgent: boolean;
  referrals: TreatmentPlan['referrals'];
  
  // Notes
  clinicalNotes: string;
  patientEducation: string;
}

