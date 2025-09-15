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
  GraduationCap,
  FileText,
  DollarSign,
  AlertCircle,
  Loader2,
  CheckCircle,
  Stethoscope
} from 'lucide-react';
import authService from '../services/authService';
import type { DoctorSignupData } from '../types/auth';

const DoctorSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<DoctorSignupData>({
    role: 'doctor',
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
    const { name, value, type } = e.target;
    
    // Handle number inputs properly
    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
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
        // Convert to numbers for validation
        const experience = Number(formData.experience) || 0;
        const consultationFee = Number(formData.consultationFee) || 0;
        
        if (experience < 0) {
          setError('Experience cannot be negative');
          return false;
        }
        if (consultationFee < 0) {
          setError('Consultation fee cannot be negative');
          return false;
        }
        // All Step 3 fields are optional, so no required field validation
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
    
    console.log('📝 Form submission triggered for step:', currentStep);
    console.log('📊 Current form data:', formData);
    
    if (!validateStep(currentStep)) {
      console.log('❌ Validation failed for step:', currentStep);
      return;
    }

    console.log('✅ Validation passed for step:', currentStep);
    
    // If not on the final step, just move to next step
    if (currentStep < 3) {
      handleNextStep();
      return;
    }
    
    // Only process signup on step 3
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting doctor signup process...');
      
      // Ensure number fields are properly converted
      const processedFormData = {
        ...formData,
        experience: Number(formData.experience) || 0,
        consultationFee: Number(formData.consultationFee) || 500
      };      
      
      console.log('📋 Processed form data:', processedFormData);
      
      // TEST MODE: Comment out the Firebase calls below and enable the test mode instead
      const TEST_MODE = false; // Set to true to bypass Firebase
      
      if (TEST_MODE) {
        console.log('🧪 TEST MODE: Simulating signup without Firebase...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save test account to localStorage for login
        const testAccounts = JSON.parse(localStorage.getItem('testAccounts') || '[]');
        const newTestAccount = {
          email: processedFormData.email,
          role: processedFormData.role,
          name: processedFormData.displayName,
          createdAt: new Date().toISOString()
        };
        
        // Remove existing account with same email if it exists
        const filteredAccounts = testAccounts.filter((acc: any) => acc.email !== processedFormData.email);
        filteredAccounts.push(newTestAccount);
        
        localStorage.setItem('testAccounts', JSON.stringify(filteredAccounts));
        console.log('💾 Saved test account to localStorage:', newTestAccount);
        console.log('✅ Test signup successful!');
      } else {
        // Check if email already exists
        console.log('📧 Checking if email exists...');
        const emailExists = await authService.checkEmailExists(processedFormData.email);
        if (emailExists) {
          setError('An account with this email already exists');
          setIsLoading(false);
          return;
        }

        // Check if license number already exists
        console.log('📋 Checking if license exists...');
        const licenseExists = await authService.checkLicenseExists(processedFormData.licenseNumber, 'doctor');
        if (licenseExists) {
          setError('A doctor with this license number is already registered');
          setIsLoading(false);
          return;
        }

        console.log('👨‍⚕️ Creating doctor account...');
        await authService.signupDoctor(processedFormData);
        
        console.log('✅ Doctor signup successful!');
        
        // Small delay to show success
        await new Promise(resolve => setTimeout(resolve, 500));
      } // End of Firebase mode
      
      // Redirect to verification pending page (both test and real mode)
      navigate('/verification-pending', { 
        state: { 
          email: processedFormData.email,
          name: processedFormData.displayName,
          role: 'doctor'
        }
      });
    } catch (error: any) {
      console.error('❌ Doctor signup error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'An unexpected error occurred during signup.';
      
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('permission-denied')) {
          errorMessage = 'Firebase permission denied. Please check your Firebase configuration.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
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
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Dr. John Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="doctor@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
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
              <p className="text-gray-600">Your medical credentials and specialization</p>
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical License Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your medical license number"
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                Qualifications *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {commonQualifications.map(qual => (
                  <label key={qual} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qual)}
                      onChange={() => handleQualificationChange(qual)}
                      className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{qual}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+1 (555) 123-4567"
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
              <p className="text-gray-600">Details about your practice (optional)</p>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="5"
                />
              </div>
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
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="City General Hospital"
              />
            </div>

            {/* Clinic Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic/Hospital Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="123 Medical Center Drive, City, State 12345"
                />
              </div>
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  min="0"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                You can update this later in your profile settings
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/signup" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Role Selection
            </Link>
            <div className="flex items-center">
              <div className="bg-orange-600 p-2 rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Doctor Registration</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep ? 'bg-orange-600 text-white' :
                  step === currentStep ? 'bg-orange-100 text-orange-600 border-2 border-orange-600' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span className={currentStep === 1 ? 'text-orange-600 font-medium' : ''}>Account</span>
            <span className={currentStep === 2 ? 'text-orange-600 font-medium' : ''}>Professional</span>
            <span className={currentStep === 3 ? 'text-orange-600 font-medium' : ''}>Practice</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div>
              {/* Error Display */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    Complete Registration
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-sm text-gray-500">
          By registering, you agree to our{' '}
          <Link to="/terms" className="text-orange-600 hover:text-orange-700">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
