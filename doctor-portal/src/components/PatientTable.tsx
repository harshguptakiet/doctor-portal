import React from 'react';
import { Eye, Edit3, Phone, MoreHorizontal, MapPin } from 'lucide-react';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  patientId: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  location?: string;
  address?: string;
  lastVisitDate?: string;
  lastVisitTime?: string;
  lastVisitReason?: string;
  registrationType?: 'online' | 'walk-in';
  createdAt?: string;
}

interface PatientTableProps {
  patients: Patient[];
  onPatientAction: (action: string, patientId: string) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onPatientAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="rounded border-gray-300" title="Select all" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit Date & Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason for Last Visit</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {patients.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500 text-sm">
                No patients found matching your criteria.
              </td>
            </tr>
          )}
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-4">
                <input type="checkbox" className="rounded border-gray-300" title={`Select ${patient.firstName} ${patient.lastName}`} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                    {patient.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {patient.registrationType === 'online' ? 'M' : 'F'} | {patient.dateOfBirth}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-900 font-medium">{patient.patientId}</td>
              <td className="px-4 py-4 text-gray-600">{patient.phone}</td>
              <td className="px-4 py-4">
                <div className="text-gray-600 truncate max-w-[200px]">{patient.email}</div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={12} />
                  {patient.location}
                </div>
              </td>
              <td className="px-4 py-4 text-gray-600">
                <div>{patient.lastVisitDate} | {patient.lastVisitTime}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-gray-600 max-w-[250px]">{patient.lastVisitReason}</div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onPatientAction('view', patient.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View patient details"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onPatientAction('edit', patient.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Edit patient"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => onPatientAction('call', patient.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Call patient"
                  >
                    <Phone size={16} />
                  </button>
                  <button 
                    onClick={() => onPatientAction('more', patient.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    title="More options"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;