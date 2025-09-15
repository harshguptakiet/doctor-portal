import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  Download,
  Star,
  Shield,
  Clock,
  Heart,
  CheckCircle,
  PlayCircle,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  QrCode,
  Apple,
  Chrome
} from 'lucide-react';

const PatientAppDownload: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with verified doctors in just a few taps'
    },
    {
      icon: MessageSquare,
      title: 'Video Consultations',
      description: 'Secure video calls with healthcare professionals from anywhere'
    },
    {
      icon: FileText,
      title: 'Digital Health Records',
      description: 'Store and access your medical history, prescriptions, and reports'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your health data is encrypted and completely secure'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Support',
      description: 'Get immediate help when you need it most'
    },
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Track your vitals, medications, and health progress'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      review: 'The app made it so easy to consult with my doctor during the pandemic. Highly recommended!'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      review: 'Great interface and the video quality is excellent. Saved me multiple trips to the clinic.'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      review: 'Love how I can access all my medical records in one place. Very convenient!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/signup" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Signup
            </Link>
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">GarudX Patient App</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-3xl shadow-2xl">
                <Smartphone className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                NEW
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Download the GarudX <span className="text-green-600">Patient App</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant access to quality healthcare from the comfort of your home. 
            Connect with verified doctors, book appointments, and manage your health records all in one app.
          </p>

          {/* App Stats */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">500K+</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.8★</div>
              <div className="text-sm text-gray-600">App Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">10K+</div>
              <div className="text-sm text-gray-600">Doctors</div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <a
              href="#"
              className="flex items-center bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Apple className="h-8 w-8 mr-3" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>
            
            <a
              href="#"
              className="flex items-center bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Chrome className="h-8 w-8 mr-3" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 inline-block shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-4 rounded-xl">
                <QrCode className="h-16 w-16 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 mb-1">Quick Download</div>
                <div className="text-sm text-gray-600">Scan QR code with your phone camera</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose GarudX Patient App?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience healthcare like never before with our comprehensive mobile application
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with GarudX in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Download & Install
              </h3>
              <p className="text-gray-600">
                Download the app from App Store or Google Play and create your account
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Find Your Doctor
              </h3>
              <p className="text-gray-600">
                Browse and select from our network of verified healthcare professionals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Start Consultation
              </h3>
              <p className="text-gray-600">
                Book appointments and have video consultations from anywhere
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied patients who trust GarudX
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.review}"
                </p>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Privacy & Security is Our Priority
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            We use bank-level encryption to protect your health data. All consultations are private and secure, 
            and we comply with HIPAA regulations to ensure your information stays confidential.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-gray-700">End-to-End Encryption</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-gray-700">Secure Data Storage</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="#"
              className="flex items-center bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Download className="h-6 w-6 mr-3" />
              Download Now - It's Free!
            </a>
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppDownload;
