import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
  FlaskConical,
  Clock,
  Shield,
  Award,
  Calendar,
  Home,
  Zap,
  Send,
} from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { PathologyUser } from '../../types/auth';

interface PathologySignupData {
  // Step 1: Account Information
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  
  // Step 2: Lab Details
  labName: string;
  licenseNumber: string;
  registrationNumber: string;
  establishedYear: number;
  
  // Step 3: Contact & Location
  address: string;
  phoneNumber: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  
  // Step 4: Services & Accreditation
  accreditation: string[];
  services: string[];
  homeCollection: boolean;
  emergencyServices: boolean;
  reportDeliveryMethods: string[];
  operatingHours: {
    start: string;
    end: string;
    days: string[];
  };
  averageTurnaroundTime: number;
}

const PathologySignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<PathologySignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    labName: '',
    licenseNumber: '',
    registrationNumber: '',
    establishedYear: new Date().getFullYear(),
    address: '',
    phoneNumber: '',
    contactPersonName: '',
    contactPersonDesignation: '',
    accreditation: [],
    services: [],
    homeCollection: false,
    emergencyServices: false,
    reportDeliveryMethods: ['Email', 'SMS'],
    operatingHours: {
      start: '09:00',
      end: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    averageTurnaroundTime: 24
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'establishedYear' || name === 'averageTurnaroundTime') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleArrayChange = (field: keyof PathologySignupData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleOperatingHoursChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        break;
      case 2:
        if (!formData.labName || !formData.licenseNumber || !formData.registrationNumber) {
          setError('Please fill in all required lab details');
          return false;
        }
        if (formData.establishedYear < 1900 || formData.establishedYear > new Date().getFullYear()) {
          setError('Please enter a valid established year');
          return false;
        }
        break;
      case 3:
        if (!formData.address || !formData.phoneNumber || !formData.contactPersonName || !formData.contactPersonDesignation) {
          setError('Please fill in all required contact details');
          return false;
        }
        break;
      case 4:
        if (formData.services.length === 0) {
          setError('Please select at least one service');
          return false;
        }
        if (formData.operatingHours.days.length === 0) {
          setError('Please select operating days');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < 4) {
      handleNextStep();
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting pathology lab signup process...');
      
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName
      });

      // Create pathology document
      const pathology: PathologyUser = {
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        role: 'pathology',
        labName: formData.labName,
        licenseNumber: formData.licenseNumber,
        registrationNumber: formData.registrationNumber,
        accreditation: formData.accreditation,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        contactPersonName: formData.contactPersonName,
        contactPersonDesignation: formData.contactPersonDesignation,
        services: formData.services,
        operatingHours: formData.operatingHours,
        homeCollection: formData.homeCollection,
        emergencyServices: formData.emergencyServices,
        reportDeliveryMethods: formData.reportDeliveryMethods,
        averageTurnaroundTime: formData.averageTurnaroundTime,
        totalTestsCompleted: 0,
        rating: 5.0,
        isNABLAccredited: formData.accreditation.includes('NABL'),
        establishedYear: formData.establishedYear,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', pathology.uid), pathology);
      await setDoc(doc(db, 'pathology_labs', pathology.uid), pathology);

      console.log('✅ Pathology lab signup successful!');
      
      // Small delay to show success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to verification pending page
      navigate('/verification-pending', { 
        state: { 
          email: formData.email,
          name: formData.displayName,
          role: 'pathology'
        }
      });
    } catch (error: any) {
      console.error('❌ Pathology lab signup error:', error);
      
      let errorMessage = 'An unexpected error occurred during signup.';
      
      if (error.message) {
        if (error.message.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const accreditationOptions = ['NABL', 'CAP', 'ISO 15189', 'ISO 9001', 'NABH', 'JCAHO'];
  const serviceOptions = [
    'Blood Tests', 'Urine Tests', 'Stool Tests', 'Sputum Tests',
    'Biochemistry', 'Hematology', 'Serology', 'Microbiology',
    'Histopathology', 'Cytology', 'Immunology', 'Molecular Biology',
    'Toxicology', 'Endocrinology', 'Cardiology Tests', 'Oncology Tests'
  ];
  const reportDeliveryOptions = ['Email', 'SMS', 'Physical Pickup', 'Portal', 'WhatsApp'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
              <p className="text-gray-600">Create your lab account credentials</p>
            </div>

            {/* Owner/Manager Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Owner/Manager Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Laboratory Details</h2>
              <p className="text-gray-600">Enter your laboratory information</p>
            </div>

            {/* Lab Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your laboratory name"
                />
              </div>
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter license number"
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Year established"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact & Location</h2>
              <p className="text-gray-600">Enter contact and location details</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter complete address with city, state, and pincode"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter contact person name"
                />
              </div>
            </div>

            {/* Contact Person Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Designation *
              </label>
              <input
                type="text"
                name="contactPersonDesignation"
                value={formData.contactPersonDesignation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Lab Manager, Chief Technologist"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Services & Accreditation</h2>
              <p className="text-gray-600">Configure your services and certifications</p>
            </div>

            {/* Accreditation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Accreditation & Certifications
              </label>
              <div className="grid grid-cols-2 gap-3">
                {accreditationOptions.map(accred => (
                  <label key={accred} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accreditation.includes(accred)}
                      onChange={(e) => handleArrayChange('accreditation', accred, e.target.checked)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">{accred}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Services Offered *
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {serviceOptions.map(service => (
                  <label key={service} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={(e) => handleArrayChange('services', service, e.target.checked)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <FlaskConical className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Services */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="homeCollection"
                  checked={formData.homeCollection}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Home className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Home Collection</span>
                  <p className="text-xs text-gray-500">Sample collection at patient's home</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="emergencyServices"
                  checked={formData.emergencyServices}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Emergency Services</span>
                  <p className="text-xs text-gray-500">24/7 urgent test processing</p>
                </div>
              </label>
            </div>

            {/* Operating Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Operating Hours
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={formData.operatingHours.start}
                    onChange={(e) => handleOperatingHoursChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={formData.operatingHours.end}
                    onChange={(e) => handleOperatingHoursChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {weekDays.map(day => (
                  <label key={day} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.operatingHours.days.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleOperatingHoursChange('days', [...formData.operatingHours.days, day]);
                        } else {
                          handleOperatingHoursChange('days', formData.operatingHours.days.filter(d => d !== day));
                        }
                      }}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Report Delivery Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Delivery Methods
              </label>
              <div className="grid grid-cols-3 gap-3">
                {reportDeliveryOptions.map(method => (
                  <label key={method} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reportDeliveryMethods.includes(method)}
                      onChange={(e) => handleArrayChange('reportDeliveryMethods', method, e.target.checked)}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <Send className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Average Turnaround Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Turnaround Time (hours)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  name="averageTurnaroundTime"
                  value={formData.averageTurnaroundTime}
                  onChange={handleInputChange}
                  min="1"
                  max="168"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="24"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Average time to deliver reports (1-168 hours)</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Account Setup';
      case 2: return 'Lab Details';
      case 3: return 'Contact Info';
      case 4: return 'Services';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-300 rounded-full opacity-10 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-10 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">GarudX</div>
                <div className="text-xs text-orange-600 font-medium">Pathology Portal</div>
              </div>
            </Link>
            
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-16 mx-2 ${
                    step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Step {currentStep} of 4: {getStepTitle()}</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {renderStep()}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : currentStep === 4 ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Create Lab Account</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PathologySignup;
