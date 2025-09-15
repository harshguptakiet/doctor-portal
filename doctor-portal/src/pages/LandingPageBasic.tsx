import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageBasic: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                ❤️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GarudX</h1>
                <p className="text-xs text-gray-500">गांव में डॉक्टर</p>
              </div>
            </div>
            
            <Link 
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-6">
              📍
              <span className="text-green-800 font-medium ml-2">
                Nabha और आसपास के 173 गांवों के लिए
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            गांव छोड़े बिना
            <span className="text-green-600 block">डॉक्टर से मिलें</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            अब आपको अस्पताल के लिए दिन भर की मजदूरी नहीं गंवानी पड़ेगी। 
            <span className="font-semibold text-gray-800"> GarudX के साथ घर बैठे पाएं बेहतरीन इलाज।</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              ▶️ फ्री में शुरू करें
            </Link>
            <a
              href="#features"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg"
            >
              और जानें
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center text-gray-600">
              ✅ <span className="ml-2 font-medium">24/7 उपलब्ध</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              🛡️ <span className="ml-2 font-medium">पूरी तरह सुरक्षित</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              ⭐ <span className="ml-2 font-medium">मुफ्त में इस्तेमाल करें</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              GarudX के साथ सब कुछ आसान
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              घर बैठे पूरी स्वास्थ्य सेवा। समय बचाएं, पैसे बचाएं, स्वस्थ रहें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Consultation */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">वीडियो से बात करें</h3>
              <p className="text-gray-600 mb-4">
                डॉक्टर से आमने-सामने बात करें। धीमे नेट में भी काम करता है।
              </p>
              <div className="flex items-center text-green-600 font-medium">
                ✅ कम इंटरनेट में भी चलता है
              </div>
            </div>

            {/* Offline Access */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">बिना नेट के भी चले</h3>
              <p className="text-gray-600 mb-4">
                आपकी रिपोर्ट और दवाई की जानकारी हमेशा आपके फोन में रहती है।
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                ✅ ऑफलाइन में भी सब कुछ मिलता है
              </div>
            </div>

            {/* Local Language */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                🌍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">अपनी भाषा में</h3>
              <p className="text-gray-600 mb-4">
                पंजाबी, हिंदी, और अन्य भारतीय भाषाओं में इस्तेमाल करें।
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                ✅ फोन करके भी इस्तेमाल करें
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            आज ही शुरू करें अपना स्वास्थ्य सफर
          </h2>
          <p className="text-xl text-green-100 mb-8">
            लाखों परिवार पहले से इस्तेमाल कर रहे हैं। आप भी जुड़ें।
          </p>
          
          <Link
            to="/login"
            className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-bold text-lg inline-flex items-center"
          >
            ▶️ अभी शुरू करें - बिल्कुल मुफ्त
          </Link>

          <p className="text-green-100 text-sm mt-4">
            * कोई छुपी हुई फीस नहीं | * कोई मासिक चार्ज नहीं | * 24/7 सपोर्ट
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-2 rounded-lg mr-3">
              ❤️
            </div>
            <div>
              <h3 className="text-xl font-bold">GarudX</h3>
              <p className="text-gray-400 text-sm">गांव में डॉक्टर</p>
            </div>
          </div>
          <p className="text-gray-400">
            © 2025 GarudX. सभी अधिकार सुरक्षित हैं। | गांव के लिए बनाया गया।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageBasic;
