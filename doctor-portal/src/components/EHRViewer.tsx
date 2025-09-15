import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  User,
  Pill,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Heart,
  Thermometer,
  X,
  ChevronRight
} from 'lucide-react';
import type { EHR, EHRSummary } from '../types/ehr';
import ehrService from '../services/ehrService';

interface EHRViewerProps {
  patientId: string;
  patientName: string;
  onClose?: () => void;
  isModal?: boolean;
}

const EHRViewer: React.FC<EHRViewerProps> = ({
  patientId,
  patientName,
  onClose,
  isModal = false
}) => {
  const [ehrHistory, setEHRHistory] = useState<EHRSummary[]>([]);
  const [selectedEHR, setSelectedEHR] = useState<EHR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  // Load patient EHR history
  useEffect(() => {
    const loadEHRHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const history = await ehrService.getPatientEHRs(patientId);
        setEHRHistory(history);
      } catch (error) {
        console.error('Error loading EHR history:', error);
        setError('Failed to load patient records');
      } finally {
        setLoading(false);
      }
    };

    loadEHRHistory();
  }, [patientId]);

  // Load specific EHR details
  const loadEHRDetails = async (ehrId: string) => {
    try {
      setLoading(true);
      setError(null);
      const ehr = await ehrService.getEHRById(ehrId);
      if (ehr) {
        setSelectedEHR(ehr);
        setView('detail');
      } else {
        setError('EHR not found');
      }
    } catch (error) {
      console.error('Error loading EHR details:', error);
      setError('Failed to load EHR details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: EHR['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Signed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const containerClasses = isModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    : "w-full h-full";

  const contentClasses = isModal
    ? "bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden"
    : "bg-white h-full overflow-hidden";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {view === 'list' ? 'Electronic Health Records' : 'EHR Details'}
              </h2>
              <p className="text-blue-100">
                <strong>Patient:</strong> {patientName}
              </p>
              {view === 'detail' && selectedEHR && (
                <p className="text-blue-100 mt-1">
                  <strong>Consultation:</strong> {formatDate(
                    selectedEHR.consultationDate instanceof Date 
                      ? selectedEHR.consultationDate 
                      : (selectedEHR.consultationDate as any)?.toDate?.() || new Date()
                  )}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {view === 'detail' && (
                <button
                  onClick={() => setView('list')}
                  className="text-blue-100 hover:text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
                  title="Back to list"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-blue-100 hover:text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading patient records...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {!loading && !error && view === 'list' && (
            <div>
              {ehrHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Records Found</h3>
                  <p className="text-gray-500">No electronic health records have been created for this patient yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Consultation History ({ehrHistory.length} records)</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {ehrHistory.map((ehr) => (
                      <div
                        key={ehr.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => loadEHRDetails(ehr.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                {ehr.primaryDiagnosis}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ehr.status)}`}>
                                {ehr.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                <span>{formatDate(ehr.consultationDate)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <User size={16} className="mr-2 text-gray-400" />
                                <span>{ehr.doctorName}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Pill size={16} className="mr-2 text-gray-400" />
                                <span>{ehr.prescriptionCount} prescriptions</span>
                              </div>
                              
                              <div className="flex items-center">
                                <FileText size={16} className="mr-2 text-gray-400" />
                                <span>EHR #{ehr.id.slice(-6)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && view === 'detail' && selectedEHR && (
            <div className="space-y-6">
              {/* EHR Header */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedEHR.diagnosis.primary}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {selectedEHR.diagnosis.diagnosisType} diagnosis
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEHR.status)}`}>
                      {selectedEHR.status}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      EHR #{selectedEHR.id?.slice(-8)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Doctor:</span>
                    <p>{selectedEHR.doctorInfo.name}</p>
                    {selectedEHR.doctorInfo.specialization && (
                      <p className="text-gray-500">{selectedEHR.doctorInfo.specialization}</p>
                    )}
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Consultation Date:</span>
                    <p>{formatDate(
                      selectedEHR.consultationDate instanceof Date 
                        ? selectedEHR.consultationDate 
                        : (selectedEHR.consultationDate as any)?.toDate?.() || new Date()
                    )}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p>{selectedEHR.consultationType}</p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <User className="mr-2 text-blue-600" size={20} />
                  Chief Complaint
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Complaint:</span>
                    <p>{selectedEHR.chiefComplaint.complaint}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p>{selectedEHR.chiefComplaint.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Severity:</span>
                    <p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedEHR.chiefComplaint.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        selectedEHR.chiefComplaint.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedEHR.chiefComplaint.severity}
                      </span>
                    </p>
                  </div>
                </div>
                
                {selectedEHR.chiefComplaint.description && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="mt-1">{selectedEHR.chiefComplaint.description}</p>
                  </div>
                )}
              </div>

              {/* Vital Signs */}
              {selectedEHR.vitalSigns && Object.keys(selectedEHR.vitalSigns).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <Activity className="mr-2 text-green-600" size={20} />
                    Vital Signs
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedEHR.vitalSigns.temperature && (
                      <div className="flex items-center">
                        <Thermometer className="mr-2 text-red-500" size={16} />
                        <div>
                          <p className="font-medium">{selectedEHR.vitalSigns.temperature}°C</p>
                          <p className="text-sm text-gray-500">Temperature</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEHR.vitalSigns.heartRate && (
                      <div className="flex items-center">
                        <Heart className="mr-2 text-red-500" size={16} />
                        <div>
                          <p className="font-medium">{selectedEHR.vitalSigns.heartRate} BPM</p>
                          <p className="text-sm text-gray-500">Heart Rate</p>
                        </div>
                      </div>
                    )}
                    
                    {(selectedEHR.vitalSigns.bloodPressureSystolic && selectedEHR.vitalSigns.bloodPressureDiastolic) && (
                      <div className="flex items-center">
                        <Activity className="mr-2 text-purple-500" size={16} />
                        <div>
                          <p className="font-medium">
                            {selectedEHR.vitalSigns.bloodPressureSystolic}/{selectedEHR.vitalSigns.bloodPressureDiastolic} mmHg
                          </p>
                          <p className="text-sm text-gray-500">Blood Pressure</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEHR.vitalSigns.weight && (
                      <div className="flex items-center">
                        <User className="mr-2 text-blue-500" size={16} />
                        <div>
                          <p className="font-medium">{selectedEHR.vitalSigns.weight} kg</p>
                          <p className="text-sm text-gray-500">Weight</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Stethoscope className="mr-2 text-blue-600" size={20} />
                  Diagnosis
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Primary Diagnosis:</span>
                    <p className="mt-1">{selectedEHR.diagnosis.primary}</p>
                  </div>
                  
                  {selectedEHR.diagnosis.secondary && selectedEHR.diagnosis.secondary.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Secondary Diagnoses:</span>
                      <ul className="mt-1 list-disc list-inside">
                        {selectedEHR.diagnosis.secondary.map((diagnosis, index) => (
                          <li key={index}>{diagnosis}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedEHR.diagnosis.notes && (
                    <div>
                      <span className="font-medium text-gray-700">Clinical Notes:</span>
                      <p className="mt-1">{selectedEHR.diagnosis.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescribed Medications */}
              {selectedEHR.treatmentPlan.medications.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <Pill className="mr-2 text-green-600" size={20} />
                    Prescribed Medications ({selectedEHR.treatmentPlan.medications.length})
                  </h4>
                  
                  <div className="space-y-4">
                    {selectedEHR.treatmentPlan.medications.map((medication, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{medication.medicineName}</h5>
                            <p className="text-sm text-gray-600">{medication.genericName}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medication.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {medication.isAvailable ? (
                              <><CheckCircle size={12} className="inline mr-1" />Available</>
                            ) : (
                              <><AlertTriangle size={12} className="inline mr-1" />Out of Stock</>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Dosage:</span>
                            <p>{medication.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Frequency:</span>
                            <p>{medication.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span>
                            <p>{medication.duration}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Quantity:</span>
                            <p>{medication.quantity}</p>
                          </div>
                        </div>
                        
                        {medication.instructions && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">Instructions:</span>
                            <p>{medication.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up and Recommendations */}
              {(selectedEHR.treatmentPlan.followUp.required || selectedEHR.treatmentPlan.lifestyle.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <Calendar className="mr-2 text-purple-600" size={20} />
                    Follow-up & Recommendations
                  </h4>
                  
                  {selectedEHR.treatmentPlan.followUp.required && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-700">Follow-up Required:</span>
                      <p className="mt-1">
                        Yes, in {selectedEHR.treatmentPlan.followUp.timeframe}
                        {selectedEHR.treatmentPlan.followUp.instructions && (
                          <span className="block text-sm text-gray-600 mt-1">
                            {selectedEHR.treatmentPlan.followUp.instructions}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {selectedEHR.treatmentPlan.lifestyle.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Lifestyle Recommendations:</span>
                      <ul className="mt-1 list-disc list-inside">
                        {selectedEHR.treatmentPlan.lifestyle.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Clinical Notes */}
              {(selectedEHR.clinicalNotes || selectedEHR.patientEducation) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <FileText className="mr-2 text-gray-600" size={20} />
                    Additional Notes
                  </h4>
                  
                  {selectedEHR.clinicalNotes && (
                    <div className="mb-4">
                      <span className="font-medium text-gray-700">Clinical Notes:</span>
                      <p className="mt-1">{selectedEHR.clinicalNotes}</p>
                    </div>
                  )}
                  
                  {selectedEHR.patientEducation && (
                    <div>
                      <span className="font-medium text-gray-700">Patient Education:</span>
                      <p className="mt-1">{selectedEHR.patientEducation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Record Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>
                      Created: {formatDate(
                        selectedEHR.createdAt instanceof Date 
                          ? selectedEHR.createdAt 
                          : (selectedEHR.createdAt as any)?.toDate?.() || new Date()
                      )}
                    </span>
                  </div>
                  
                  {selectedEHR.signedAt && (
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      <span>
                        Signed: {formatDate(
                          selectedEHR.signedAt instanceof Date 
                            ? selectedEHR.signedAt 
                            : (selectedEHR.signedAt as any)?.toDate?.() || new Date()
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EHRViewer;
