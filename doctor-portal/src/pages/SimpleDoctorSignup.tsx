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
  AlertCircle,
  Loader2,
  CheckCircle,
  Stethoscope
} from 'lucide-react';

interface SimpleDoctorFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  clinicName: string;
  clinicAddress: string;
  phoneNumber: string;
  consultationFee: number;
}

const SimpleDoctorSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<SimpleDoctorFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    licenseNumber: '',
    specialization: '',
    qualifications: [],
    experience: 0,
    clinicName: '',
    clinicAddress: '',
    phoneNumber: '',
    consultationFee: 500
  });

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
    'Gynecology',
    'Ophthalmology',
    'ENT',
    'Other'
  ];

  const commonQualifications = [
    'MBBS',
    'MD',
    'MS',
    'DNB',
    'FRCS',
    'MRCP',
    'DM',
    'MCh',
    'Fellowship',
    'Diploma'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleQualificationChange = (qualification: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualification)
        ? prev.qualifications.filter(q => q !== qualification)
        : [...prev.qualifications, qualification]
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
        if (!formData.licenseNumber || !formData.specialization || !formData.phoneNumber) {
          setError('Please fill in all required professional details');
          return false;
        }
        if (formData.qualifications.length === 0) {
          setError('Please select at least one qualification');
          return false;
        }
        break;
      case 3:
        if (formData.experience < 0) {
          setError('Experience cannot be negative');
          return false;
        }
        if (formData.consultationFee && formData.consultationFee < 0) {
          setError('Consultation fee cannot be negative');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🧪 Simple Doctor Signup - Test Mode');
      console.log('📝 Form Data:', formData);
      
      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Mock signup successful!');
      
      // Redirect to verification pending page
      navigate('/verification-pending', { 
        state: { 
          email: formData.email,
          name: formData.displayName,
          role: 'doctor'
        }
      });
    } catch (error: any) {
      console.error('❌ Simple signup error:', error);
      setError('Mock signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
              <p className="text-gray-600">Create your account credentials</p>
              <p className="text-sm text-green-600 mt-2">✅ Test Mode - No Firebase</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. John Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="doctor@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Professional Details</h2>
              <p className="text-gray-600">Your medical practice information</p>
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., MCI-12345"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonQualifications.map(qualification => (
                  <label key={qualification} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qualification)}
                      onChange={() => handleQualificationChange(qualification)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{qualification}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
              <p className="text-gray-600">Details about your medical practice</p>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
              />
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic/Hospital Name
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City Hospital"
              />
            </div>

            {/* Clinic Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic/Hospital Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address, City, State, PIN"
                />
              </div>
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                min="0"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
          <p className="text-gray-600">Join MediBot as a healthcare provider</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'
              }`}>
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Back to Signup */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <Link 
              to="/signup" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Role Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDoctorSignup;
