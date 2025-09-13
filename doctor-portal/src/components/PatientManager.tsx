import React, { useState, useMemo } from 'react';
import { UserPlus, Upload } from 'lucide-react';
import PatientSearch from './PatientSearch';
import PatientTable from './PatientTable';
import type { Patient } from './PatientTable';

interface PatientManagerProps {
  initialPatients: Patient[];
}

const PatientManager: React.FC<PatientManagerProps> = ({ initialPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'walk-in'>('all');

  // Filter patients based on search and filter criteria
  const filteredPatients = useMemo(() => {
    return initialPatients.filter(patient => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesFilter = filterType === 'all' || patient.registrationType === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [initialPatients, searchTerm, filterType]);

  // Handle search changes
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: 'all' | 'online' | 'walk-in') => {
    setFilterType(newFilter);
  };

  // Handle patient actions
  const handlePatientAction = (action: string, patientId: string) => {
    console.log(`Action: ${action} for patient: ${patientId}`);
    // Implement your action logic here
    switch (action) {
      case 'view':
        // Navigate to patient details
        break;
      case 'edit':
        // Open edit modal
        break;
      case 'call':
        // Initiate call
        break;
      case 'more':
        // Show more options menu
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive patient management system</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition">
            <Upload size={16} />
            Import Patient List
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition">
            <UserPlus size={16} />
            Add New Patient
          </button>
        </div>
      </div>

      {/* Patient management interface */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <PatientSearch
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          initialSearchTerm={searchTerm}
          initialFilter={filterType}
        />
        
        <PatientTable
          patients={filteredPatients}
          onPatientAction={handlePatientAction}
        />
      </div>
    </div>
  );
};

export default PatientManager;