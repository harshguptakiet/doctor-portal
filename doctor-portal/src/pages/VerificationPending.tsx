import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Mail,
  Clock,
  Shield,
  FileText,
  Phone,
  MessageSquare,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';

const VerificationPending: React.FC = () => {
  const location = useLocation();
  const { email, name, role } = location.state || {};

  const steps = [
    {
      icon: FileText,
      title: 'Document Verification',
      description: 'We\'ll verify your medical license and credentials',
      status: 'pending',
      timeframe: '24-48 hours'
    },
    {
      icon: Shield,
      title: 'Background Check',
      description: 'Standard verification for healthcare professionals',
      status: 'pending',
      timeframe: '2-3 business days'
    },
    {
      icon: CheckCircle,
      title: 'Account Activation',
      description: 'Your account will be activated once verified',
      status: 'pending',
      timeframe: 'Upon completion'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Login
            </Link>
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MediBot Portal</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-600 p-6 rounded-full shadow-2xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Thank you {name} for registering as a {role}. We've received your application and will begin 
            the verification process shortly.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-blue-900">Verification Email Sent</h2>
            </div>
            <p className="text-blue-700 text-sm">
              We've sent a confirmation email to <span className="font-medium">{email}</span>. 
              Please check your inbox and verify your email address.
            </p>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            What Happens Next?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Step {index + 1}: {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{step.timeframe}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full inline-flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Required Documents */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              Required Documents
            </h3>
            
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Medical License Certificate
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Educational Qualifications
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Professional Experience Proof
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                Identity Verification
              </li>
            </ul>
            
            <p className="text-sm text-gray-500 mt-6">
              All documents will be verified against official medical boards and institutions.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="h-6 w-6 text-blue-600 mr-3" />
              Verification Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Application Received</p>
                  <p className="text-sm text-gray-500">Just now</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Document Review</p>
                  <p className="text-sm text-gray-500">24-48 hours</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Final Approval</p>
                  <p className="text-sm text-gray-500">2-3 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Need Help or Have Questions?
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our verification team is here to help. If you have any questions about the process 
            or need to update your information, don't hesitate to contact us.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:verification@garudx.com"
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </a>
            
            <a
              href="tel:+1-800-GARUDX"
              className="flex items-center text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Support
            </a>
            
            <Link
              to="/support"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            What Can You Do While Waiting?
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-medium text-green-900 mb-2">Prepare Your Practice</h4>
              <p className="text-sm text-green-700">
                Review our platform features and prepare your practice information for when your account is activated.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-medium text-blue-900 mb-2">Download Resources</h4>
              <p className="text-sm text-blue-700">
                Access our doctor onboarding guide and platform tutorials to get familiar with the system.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link
              to="/login"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
