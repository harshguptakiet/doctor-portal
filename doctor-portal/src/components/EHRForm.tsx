import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Search,
  AlertCircle,
  Stethoscope,
  Pill,
  FileText,
  Save,
  Clock,
  User,
  Activity,
  Thermometer,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import type { 
  EHRFormData, 
  PrescribedMedicine, 
  Medicine, 
  CommonDisease,
  DosageTemplate 
} from '../types/ehr';
import ehrService from '../services/ehrService';

interface EHRFormProps {
  patientInfo: {
    id: string;
    firstName: string;
    lastName: string;
    age?: number;
    gender?: string;
    phone?: string;
    email?: string;
  };
  doctorInfo: {
    uid: string;
    displayName: string;
    specialization?: string;
    licenseNumber?: string;
  };
  consultationId?: string;
  onSave: (ehrId: string) => void;
  onCancel: () => void;
}

const EHRForm: React.FC<EHRFormProps> = ({
  patientInfo,
  doctorInfo,
  consultationId,
  onSave,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<EHRFormData>({
    patientId: patientInfo.id,
    consultationId,
    
    // Chief complaint
    complaint: '',
    complaintDuration: '',
    complaintSeverity: 'Mild',
    complaintDescription: '',
    
    // Vital signs
    vitalSigns: {},
    
    // Diagnosis
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    diagnosisType: 'Suspected',
    diagnosisNotes: '',
    
    // Treatment
    prescriptions: [],
    lifestyleRecommendations: [],
    
    // Follow up
    followUpRequired: false,
    followUpTimeframe: '',
    followUpInstructions: '',
    
    // Tests and referrals
    recommendedTests: [],
    testsUrgent: false,
    referrals: [],
    
    // Notes
    clinicalNotes: '',
    patientEducation: ''
  });

  // Component state
  const [currentTab, setCurrentTab] = useState<'complaint' | 'vitals' | 'diagnosis' | 'prescriptions' | 'followup' | 'notes'>('complaint');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Medicine search state
  const [medicineSearch, setMedicineSearch] = useState('');
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  
  // Common data
  const [commonDiseases] = useState<CommonDisease[]>(ehrService.getCommonDiseases());
  const [dosageTemplates] = useState<DosageTemplate[]>(ehrService.getDosageTemplates());

  // Load initial medicine data
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const medicines = await ehrService.searchMedicines('');
        setAvailableMedicines(medicines);
      } catch (error) {
        console.error('Error loading medicines:', error);
      }
    };
    loadMedicines();
  }, []);

  // Search medicines
  const searchMedicines = async (searchTerm: string) => {
    try {
      const medicines = await ehrService.searchMedicines(searchTerm);
      setAvailableMedicines(medicines);
    } catch (error) {
      console.error('Error searching medicines:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!formData.complaint.trim()) {
        throw new Error('Chief complaint is required');
      }
      if (!formData.primaryDiagnosis.trim()) {
        throw new Error('Primary diagnosis is required');
      }

      // Create EHR
      const ehrId = await ehrService.createEHR(formData, doctorInfo, patientInfo);
      
      setSuccess('Electronic Health Record created successfully!');
      setTimeout(() => {
        onSave(ehrId);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save EHR');
    } finally {
      setLoading(false);
    }
  };

  // Add prescription
  const addPrescription = (medicine: Medicine, template?: DosageTemplate) => {
    const newPrescription: PrescribedMedicine = {
      medicineId: medicine.id,
      medicineName: medicine.medicineName,
      genericName: medicine.genericName,
      dosage: template?.dosage || '',
      frequency: template?.frequency || '',
      duration: template?.duration || '',
      instructions: template?.instructions || '',
      quantity: 0,
      isAvailable: medicine.stockQuantity > 0,
      stockQuantity: medicine.stockQuantity,
      unitPrice: medicine.unitPrice
    };

    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, newPrescription]
    }));
    
    setShowMedicineSearch(false);
    setMedicineSearch('');
  };

  // Remove prescription
  const removePrescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  // Update prescription
  const updatePrescription = (index: number, field: keyof PrescribedMedicine, value: any) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map((prescription, i) => 
        i === index ? { ...prescription, [field]: value } : prescription
      )
    }));
  };

  // Tabs configuration
  const tabs = [
    { key: 'complaint', label: 'Chief Complaint', icon: <User size={16} /> },
    { key: 'vitals', label: 'Vital Signs', icon: <Activity size={16} /> },
    { key: 'diagnosis', label: 'Diagnosis', icon: <Stethoscope size={16} /> },
    { key: 'prescriptions', label: 'Prescriptions', icon: <Pill size={16} /> },
    { key: 'followup', label: 'Follow-up', icon: <Calendar size={16} /> },
    { key: 'notes', label: 'Notes', icon: <FileText size={16} /> }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Create Electronic Health Record</h2>
            <div className="text-blue-100">
              <p className="mb-1">
                <strong>Patient:</strong> {patientInfo.firstName} {patientInfo.lastName}
                {patientInfo.age && `, Age: ${patientInfo.age}`}
                {patientInfo.gender && `, ${patientInfo.gender}`}
              </p>
              <p>
                <strong>Doctor:</strong> {doctorInfo.displayName}
                {doctorInfo.specialization && ` (${doctorInfo.specialization})`}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-blue-100 hover:text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                currentTab === tab.key
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Chief Complaint Tab */}
        {currentTab === 'complaint' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chief Complaint *
              </label>
              <input
                type="text"
                value={formData.complaint}
                onChange={(e) => setFormData(prev => ({ ...prev, complaint: e.target.value }))}
                placeholder="What brings the patient in today?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.complaintDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, complaintDuration: e.target.value }))}
                  placeholder="e.g., 3 days, 2 weeks"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={formData.complaintSeverity}
                  onChange={(e) => setFormData(prev => ({ ...prev, complaintSeverity: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                value={formData.complaintDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, complaintDescription: e.target.value }))}
                rows={4}
                placeholder="Detailed description of symptoms, onset, triggers, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Vital Signs Tab */}
        {currentTab === 'vitals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Thermometer size={16} className="inline mr-1" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vitalSigns.temperature || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, temperature: parseFloat(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart size={16} className="inline mr-1" />
                  Heart Rate (BPM)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.heartRate || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, heartRate: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BP Systolic (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.bloodPressureSystolic || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, bloodPressureSystolic: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BP Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.bloodPressureDiastolic || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, bloodPressureDiastolic: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vitalSigns.weight || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, weight: parseFloat(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.height || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, height: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen Sat (%)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.oxygenSaturation || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, oxygenSaturation: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.vitalSigns.bloodSugar || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vitalSigns: { ...prev.vitalSigns, bloodSugar: parseInt(e.target.value) || undefined }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Diagnosis Tab */}
        {currentTab === 'diagnosis' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Diagnosis *
              </label>
              <input
                type="text"
                value={formData.primaryDiagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryDiagnosis: e.target.value }))}
                placeholder="Enter primary diagnosis"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Common Diseases Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Common Diagnoses (Quick Select)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {commonDiseases.slice(0, 8).map((disease) => (
                  <button
                    key={disease.name}
                    onClick={() => setFormData(prev => ({ ...prev, primaryDiagnosis: disease.name }))}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium text-sm">{disease.name}</div>
                    <div className="text-xs text-gray-500">{disease.category}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Type
                </label>
                <select
                  value={formData.diagnosisType}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosisType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Suspected">Suspected</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rule out">Rule out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Notes
              </label>
              <textarea
                value={formData.diagnosisNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosisNotes: e.target.value }))}
                rows={4}
                placeholder="Additional diagnostic notes, differential diagnosis, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {currentTab === 'prescriptions' && (
          <div className="space-y-6">
            {/* Add Medicine Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Prescribed Medications</h3>
              <button
                onClick={() => setShowMedicineSearch(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Medicine Search Modal */}
            {showMedicineSearch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Search & Add Medicine</h3>
                      <button
                        onClick={() => setShowMedicineSearch(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={medicineSearch}
                        onChange={(e) => {
                          setMedicineSearch(e.target.value);
                          searchMedicines(e.target.value);
                        }}
                        placeholder="Search medicines..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {availableMedicines.map((medicine) => {
                      const template = dosageTemplates.find(t => 
                        t.medicine.toLowerCase().includes(medicine.medicineName.toLowerCase())
                      );
                      
                      return (
                        <div
                          key={medicine.id}
                          className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium">{medicine.medicineName}</h4>
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  medicine.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {medicine.stockQuantity > 0 ? (
                                    <><CheckCircle size={12} className="inline mr-1" />In Stock ({medicine.stockQuantity})</>
                                  ) : (
                                    <><AlertTriangle size={12} className="inline mr-1" />Out of Stock</>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-2">
                                <div><strong>Generic:</strong> {medicine.genericName}</div>
                                <div><strong>Category:</strong> {medicine.category}</div>
                                <div><strong>Price:</strong> ₹{medicine.unitPrice}</div>
                              </div>

                              {template && (
                                <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded">
                                  <strong>Suggested:</strong> {template.dosage}, {template.frequency}, {template.duration}
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => addPrescription(medicine, template)}
                              className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {availableMedicines.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No medicines found. Try a different search term.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Prescribed Medicines List */}
            {formData.prescriptions.length > 0 ? (
              <div className="space-y-4">
                {formData.prescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-lg">{prescription.medicineName}</h4>
                        <p className="text-sm text-gray-600">{prescription.genericName}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${
                          prescription.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {prescription.isAvailable ? (
                            <><CheckCircle size={12} className="mr-1" />Available ({prescription.stockQuantity})</>
                          ) : (
                            <><AlertTriangle size={12} className="mr-1" />Out of Stock</>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removePrescription(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={prescription.dosage}
                          onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={prescription.frequency}
                          onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                          placeholder="e.g., Twice daily"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={prescription.duration}
                          onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={prescription.quantity}
                          onChange={(e) => updatePrescription(index, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={prescription.instructions}
                        onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                        placeholder="e.g., Take after meals"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No medicines prescribed yet. Click "Add Medicine" to start.
              </div>
            )}
          </div>
        )}

        {/* Follow-up Tab */}
        {currentTab === 'followup' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="followUpRequired"
                checked={formData.followUpRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                Follow-up Required
              </label>
            </div>

            {formData.followUpRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Timeframe
                  </label>
                  <select
                    value={formData.followUpTimeframe}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpTimeframe: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select timeframe</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Instructions
              </label>
              <textarea
                value={formData.followUpInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpInstructions: e.target.value }))}
                rows={3}
                placeholder="Special instructions for follow-up visit"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle Recommendations
              </label>
              <textarea
                value={formData.lifestyleRecommendations.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  lifestyleRecommendations: e.target.value.split(',').map(r => r.trim()).filter(r => r) 
                }))}
                rows={3}
                placeholder="Diet, exercise, lifestyle changes (separate with commas)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {currentTab === 'notes' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Notes
              </label>
              <textarea
                value={formData.clinicalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                rows={6}
                placeholder="Additional clinical observations, examination findings, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Education
              </label>
              <textarea
                value={formData.patientEducation}
                onChange={(e) => setFormData(prev => ({ ...prev, patientEducation: e.target.value }))}
                rows={4}
                placeholder="Information provided to patient about condition, treatment, warning signs, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              <div className="text-sm text-green-700">{success}</div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <Clock size={16} className="inline mr-1" />
            Auto-saving draft...
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.complaint.trim() || !formData.primaryDiagnosis.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{loading ? 'Saving...' : 'Save EHR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EHRForm;
