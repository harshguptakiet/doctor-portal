import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { 
  EHR, 
  EHRSummary, 
  EHRFormData, 
  Medicine, 
  CommonDisease, 
  DosageTemplate 
} from '../types/ehr';

class EHRService {
  // Collection names
  private readonly EHR_COLLECTION = 'electronic_health_records';

  /**
   * Check if EHR already exists for this consultation
   */
  async checkExistingEHR(patientId: string, consultationId?: string): Promise<boolean> {
    try {
      let q = query(
        collection(db, this.EHR_COLLECTION),
        where('patientId', '==', patientId)
      );
      
      if (consultationId) {
        q = query(
          collection(db, this.EHR_COLLECTION),
          where('patientId', '==', patientId),
          where('consultationId', '==', consultationId)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Error checking existing EHR:', error);
      return false;
    }
  }

  /**
   * Create a new Electronic Health Record
   */
  async createEHR(formData: EHRFormData, doctorInfo: any, patientInfo: any): Promise<string> {
    try {
      // Check if EHR already exists for this consultation
      if (formData.consultationId) {
        const existingEHR = await this.checkExistingEHR(formData.patientId, formData.consultationId);
        if (existingEHR) {
          throw new Error('EHR already exists for this consultation. Please update the existing record instead.');
        }
      }
      
      // Prepare EHR document
      const ehrDoc: Omit<EHR, 'id'> = {
        patientId: formData.patientId,
        doctorId: doctorInfo.uid,
        consultationId: formData.consultationId,
        
        // Consultation metadata
        consultationDate: serverTimestamp() as any,
        consultationType: 'Video Call',
        
        // Patient information snapshot
        patientInfo: {
          name: patientInfo.name || `${patientInfo.firstName} ${patientInfo.lastName}`,
          age: patientInfo.age || 0,
          gender: patientInfo.gender || 'Not specified',
          phone: patientInfo.phone,
          email: patientInfo.email
        },
        
        // Doctor information
        doctorInfo: {
          name: doctorInfo.displayName || doctorInfo.name,
          specialization: doctorInfo.specialization,
          license: doctorInfo.licenseNumber
        },
        
        // Medical information
        chiefComplaint: {
          complaint: formData.complaint,
          duration: formData.complaintDuration,
          severity: formData.complaintSeverity,
          description: formData.complaintDescription
        },
        
        vitalSigns: formData.vitalSigns,
        
        diagnosis: {
          primary: formData.primaryDiagnosis,
          secondary: formData.secondaryDiagnoses.filter(d => d.trim() !== ''),
          diagnosisType: formData.diagnosisType,
          notes: formData.diagnosisNotes
        },
        
        treatmentPlan: {
          medications: formData.prescriptions,
          lifestyle: formData.lifestyleRecommendations.filter(r => r.trim() !== ''),
          followUp: {
            required: formData.followUpRequired,
            timeframe: formData.followUpTimeframe,
            instructions: formData.followUpInstructions
          },
          tests: formData.recommendedTests.length > 0 ? {
            recommended: formData.recommendedTests,
            urgent: formData.testsUrgent
          } : undefined,
          referrals: formData.referrals
        },
        
        // Additional notes
        clinicalNotes: formData.clinicalNotes,
        patientEducation: formData.patientEducation,
        
        // Status and metadata
        status: 'Completed',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, this.EHR_COLLECTION), ehrDoc);
      
      console.log('✅ EHR created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating EHR:', error);
      throw new Error(`Failed to create EHR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing EHR
   */
  async updateEHR(ehrId: string, formData: Partial<EHRFormData>): Promise<void> {
    try {
      const ehrRef = doc(db, this.EHR_COLLECTION, ehrId);
      
      // Prepare update data
      const updateData: any = {
        updatedAt: serverTimestamp()
      };

      // Add fields that are being updated
      if (formData.complaint) {
        updateData['chiefComplaint.complaint'] = formData.complaint;
      }
      if (formData.primaryDiagnosis) {
        updateData['diagnosis.primary'] = formData.primaryDiagnosis;
      }
      if (formData.prescriptions) {
        updateData['treatmentPlan.medications'] = formData.prescriptions;
      }
      
      await updateDoc(ehrRef, updateData);
      
      console.log('✅ EHR updated successfully:', ehrId);
    } catch (error) {
      console.error('❌ Error updating EHR:', error);
      throw new Error(`Failed to update EHR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get EHR by ID
   */
  async getEHRById(ehrId: string): Promise<EHR | null> {
    try {
      const ehrRef = doc(db, this.EHR_COLLECTION, ehrId);
      const ehrSnap = await getDoc(ehrRef);
      
      if (ehrSnap.exists()) {
        return {
          id: ehrSnap.id,
          ...ehrSnap.data()
        } as EHR;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error fetching EHR:', error);
      throw new Error(`Failed to fetch EHR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all EHRs for a patient
   */
  async getPatientEHRs(patientId: string): Promise<EHRSummary[]> {
    try {
      const q = query(
        collection(db, this.EHR_COLLECTION),
        where('patientId', '==', patientId),
        orderBy('consultationDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ehrs: EHRSummary[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as EHR;
        ehrs.push({
          id: doc.id,
          patientId: data.patientId,
          patientName: data.patientInfo.name,
          consultationDate: data.consultationDate instanceof Timestamp 
            ? data.consultationDate.toDate() 
            : new Date(data.consultationDate),
          primaryDiagnosis: data.diagnosis.primary,
          doctorName: data.doctorInfo.name,
          status: data.status,
          prescriptionCount: data.treatmentPlan.medications.length
        });
      });
      
      return ehrs;
    } catch (error) {
      console.error('❌ Error fetching patient EHRs:', error);
      throw new Error(`Failed to fetch patient EHRs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all EHRs created by a doctor
   */
  async getDoctorEHRs(doctorId: string, limitCount: number = 50): Promise<EHRSummary[]> {
    try {
      const q = query(
        collection(db, this.EHR_COLLECTION),
        where('doctorId', '==', doctorId),
        orderBy('consultationDate', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const ehrs: EHRSummary[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as EHR;
        ehrs.push({
          id: doc.id,
          patientId: data.patientId,
          patientName: data.patientInfo.name,
          consultationDate: data.consultationDate instanceof Timestamp 
            ? data.consultationDate.toDate() 
            : new Date(data.consultationDate),
          primaryDiagnosis: data.diagnosis.primary,
          doctorName: data.doctorInfo.name,
          status: data.status,
          prescriptionCount: data.treatmentPlan.medications.length
        });
      });
      
      return ehrs;
    } catch (error) {
      console.error('❌ Error fetching doctor EHRs:', error);
      throw new Error(`Failed to fetch doctor EHRs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check medicine availability in pharmacy stock
   */
  async checkMedicineAvailability(medicineNames: string[]): Promise<Medicine[]> {
    try {
      // First try to load from demo data
      const demoMedicines = await this.loadDemoMedicines();
      
      // Filter medicines that match the requested names
      const availableMedicines = demoMedicines.filter(medicine => 
        medicineNames.some(name => 
          medicine.medicineName.toLowerCase().includes(name.toLowerCase()) ||
          medicine.genericName.toLowerCase().includes(name.toLowerCase())
        )
      );

      return availableMedicines;
    } catch (error) {
      console.error('❌ Error checking medicine availability:', error);
      return [];
    }
  }

  /**
   * Load demo medicines from CSV file
   */
  private async loadDemoMedicines(): Promise<Medicine[]> {
    try {
      const response = await fetch('/demo-medicines.csv');
      const csvText = await response.text();
      
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const medicines: Medicine[] = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        return {
          id: `med-${index + 1}`,
          medicineName: values[headers.indexOf('Medicine Name')] || '',
          genericName: values[headers.indexOf('Generic Name')] || '',
          category: values[headers.indexOf('Category')] || '',
          manufacturer: values[headers.indexOf('Manufacturer')] || '',
          unitPrice: parseFloat(values[headers.indexOf('Unit Price')]) || 0,
          stockQuantity: parseInt(values[headers.indexOf('Stock Quantity')]) || 0,
          expiryDate: values[headers.indexOf('Expiry Date')] || '',
          prescriptionRequired: values[headers.indexOf('Prescription Required')]?.toLowerCase() === 'yes' || true,
          description: values[headers.indexOf('Description')] || ''
        };
      });

      return medicines;
    } catch (error) {
      console.error('❌ Error loading demo medicines:', error);
      return [];
    }
  }

  /**
   * Search medicines by name or category
   */
  async searchMedicines(searchTerm: string): Promise<Medicine[]> {
    try {
      const medicines = await this.loadDemoMedicines();
      
      if (!searchTerm) return medicines.slice(0, 20); // Return first 20 if no search term
      
      const filtered = medicines.filter(medicine =>
        medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filtered.slice(0, 10); // Return top 10 matches
    } catch (error) {
      console.error('❌ Error searching medicines:', error);
      return [];
    }
  }

  /**
   * Get common diseases for quick selection
   */
  getCommonDiseases(): CommonDisease[] {
    return [
      {
        name: 'Upper Respiratory Tract Infection',
        category: 'Infectious',
        icdCode: 'J06.9',
        commonSymptoms: ['Cough', 'Sore throat', 'Runny nose', 'Fever'],
        recommendedTests: ['Complete Blood Count', 'Throat swab']
      },
      {
        name: 'Hypertension',
        category: 'Chronic',
        icdCode: 'I10',
        commonSymptoms: ['Headache', 'Dizziness', 'Chest pain'],
        recommendedTests: ['Blood pressure monitoring', 'ECG', 'Lipid profile']
      },
      {
        name: 'Type 2 Diabetes Mellitus',
        category: 'Chronic',
        icdCode: 'E11',
        commonSymptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
        recommendedTests: ['HbA1c', 'Fasting glucose', 'Lipid profile']
      },
      {
        name: 'Gastroenteritis',
        category: 'Acute',
        icdCode: 'K59.1',
        commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain'],
        recommendedTests: ['Stool examination', 'Blood electrolytes']
      },
      {
        name: 'Migraine',
        category: 'Chronic',
        icdCode: 'G43',
        commonSymptoms: ['Severe headache', 'Nausea', 'Light sensitivity'],
        recommendedTests: ['CT scan (if needed)', 'MRI (if needed)']
      },
      {
        name: 'Anxiety Disorder',
        category: 'Mental Health',
        icdCode: 'F41.9',
        commonSymptoms: ['Restlessness', 'Fatigue', 'Difficulty concentrating'],
        recommendedTests: ['Mental health assessment', 'Thyroid function']
      },
      {
        name: 'Allergic Rhinitis',
        category: 'Chronic',
        icdCode: 'J30.9',
        commonSymptoms: ['Sneezing', 'Runny nose', 'Itchy eyes'],
        recommendedTests: ['Allergy testing', 'IgE levels']
      },
      {
        name: 'Back Pain',
        category: 'Acute',
        icdCode: 'M54.9',
        commonSymptoms: ['Lower back pain', 'Muscle stiffness'],
        recommendedTests: ['X-ray', 'MRI (if chronic)']
      }
    ];
  }

  /**
   * Get dosage templates for common medications
   */
  getDosageTemplates(): DosageTemplate[] {
    return [
      {
        medicine: 'Paracetamol',
        condition: 'Fever/Pain',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '3-5 days',
        instructions: 'Take after meals'
      },
      {
        medicine: 'Amoxicillin',
        condition: 'Bacterial infection',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7-10 days',
        instructions: 'Complete the full course'
      },
      {
        medicine: 'Metformin',
        condition: 'Diabetes',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: 'Ongoing',
        instructions: 'Take with meals'
      },
      {
        medicine: 'Amlodipine',
        condition: 'Hypertension',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take at the same time daily'
      },
      {
        medicine: 'Omeprazole',
        condition: 'Acid reflux',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '2-4 weeks',
        instructions: 'Take before breakfast'
      }
    ];
  }

  /**
   * Listen to real-time updates for patient EHRs
   */
  onPatientEHRsChange(patientId: string, callback: (ehrs: EHRSummary[]) => void): () => void {
    const q = query(
      collection(db, this.EHR_COLLECTION),
      where('patientId', '==', patientId),
      orderBy('consultationDate', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const ehrs: EHRSummary[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as EHR;
        ehrs.push({
          id: doc.id,
          patientId: data.patientId,
          patientName: data.patientInfo.name,
          consultationDate: data.consultationDate instanceof Timestamp 
            ? data.consultationDate.toDate() 
            : new Date(data.consultationDate),
          primaryDiagnosis: data.diagnosis.primary,
          doctorName: data.doctorInfo.name,
          status: data.status,
          prescriptionCount: data.treatmentPlan.medications.length
        });
      });
      callback(ehrs);
    });
  }

  /**
   * Delete an EHR (soft delete by updating status)
   */
  async deleteEHR(ehrId: string): Promise<void> {
    try {
      const ehrRef = doc(db, this.EHR_COLLECTION, ehrId);
      await updateDoc(ehrRef, {
        status: 'Draft', // Soft delete by changing status
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ EHR deleted successfully:', ehrId);
    } catch (error) {
      console.error('❌ Error deleting EHR:', error);
      throw new Error(`Failed to delete EHR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create and export singleton instance
const ehrService = new EHRService();
export default ehrService;
