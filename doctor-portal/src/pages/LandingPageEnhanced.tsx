import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Simple translation object
const translations = {
  en: {
    tagline: "Doctor in Village",
    launchApp: "Launch App",
    heroTitle: "See a Doctor Without Leaving Your Village",
    heroDescription: "No more losing daily wages for hospital visits. Get expert medical care from home with GarudX.",
    startFree: "Start Free",
    learnMore: "Learn More",
    available247: "24/7 Available",
    completelySafe: "Completely Safe", 
    useFree: "Use for Free",
    solutionTitle: "Everything is Easy with GarudX",
    solutionSubtitle: "Complete healthcare from home. Save time, save money, stay healthy.",
    videoConsult: "Video Consultation",
    videoConsultDesc: "Talk to doctors face-to-face. Works even with slow internet.",
    videoConsultBenefit: "Works with low internet too",
    offlineAccess: "Works Without Internet",
    offlineAccessDesc: "Your reports and medicine info always stays on your phone.",
    offlineAccessBenefit: "Everything available offline too",
    localLanguage: "In Your Language",
    localLanguageDesc: "Use in Punjabi, Hindi, and other Indian languages.",
    localLanguageBenefit: "Can also use by calling",
    ctaTitle: "Start Your Health Journey Today",
    ctaSubtitle: "Millions of families are already using it. Join now.",
    startNowFree: "Start Now - Completely Free",
    noHiddenFees: "* No hidden fees | * No monthly charges | * 24/7 support",
    allRightsReserved: "All rights reserved.",
    madeForVillages: "Made for villages."
  },
  hi: {
    tagline: "गांव में डॉक्टर",
    launchApp: "ऐप खोलें",
    heroTitle: "गांव छोड़े बिना डॉक्टर से मिलें",
    heroDescription: "अब आपको अस्पताल के लिए दिन भर की मजदूरी नहीं गंवानी पड़ेगी। GarudX के साथ घर बैठे पाएं बेहतरीन इलाज।",
    startFree: "फ्री में शुरू करें",
    learnMore: "और जानें",
    available247: "24/7 उपलब्ध",
    completelySafe: "पूरी तरह सुरक्षित",
    useFree: "मुफ्त में इस्तेमाल करें",
    solutionTitle: "GarudX के साथ सब कुछ आसान",
    solutionSubtitle: "घर बैठे पूरी स्वास्थ्य सेवा। समय बचाएं, पैसे बचाएं, स्वस्थ रहें।",
    videoConsult: "वीडियो से बात करें",
    videoConsultDesc: "डॉक्टर से आमने-सामने बात करें। धीमे नेट में भी काम करता है।",
    videoConsultBenefit: "कम इंटरनेट में भी चलता है",
    offlineAccess: "बिना नेट के भी चले",
    offlineAccessDesc: "आपकी रिपोर्ट और दवाई की जानकारी हमेशा आपके फोन में रहती है।",
    offlineAccessBenefit: "ऑफलाइन में भी सब कुछ मिलता है",
    localLanguage: "अपनी भाषा में",
    localLanguageDesc: "पंजाबी, हिंदी, और अन्य भारतीय भाषाओं में इस्तेमाल करें।",
    localLanguageBenefit: "फोन करके भी इस्तेमाल करें",
    ctaTitle: "आज ही शुरू करें अपना स्वास्थ्य सफर",
    ctaSubtitle: "लाखों परिवार पहले से इस्तेमाल कर रहे हैं। आप भी जुड़ें।",
    startNowFree: "अभी शुरू करें - बिल्कुल मुफ्त",
    noHiddenFees: "* कोई छुपी हुई फीस नहीं | * कोई मासिक चार्ज नहीं | * 24/7 सपोर्ट",
    allRightsReserved: "सभी अधिकार सुरक्षित हैं।",
    madeForVillages: "गांव के लिए बनाया गया।"
  },
  pa: {
    tagline: "ਪਿੰਡ ਵਿੱਚ ਡਾਕਟਰ",
    launchApp: "ਐਪ ਖੋਲ੍ਹੋ",
    heroTitle: "ਪਿੰਡ ਛੱਡੇ ਬਿਨਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ",
    heroDescription: "ਹੁਣ ਤੁਹਾਨੂੰ ਹਸਪਤਾਲ ਜਾਣ ਲਈ ਦਿਨ ਭਰ ਦੀ ਮਜਦੂਰੀ ਨਹੀਂ ਗੁਆਉਣੀ ਪਵੇਗੀ। GarudX ਨਾਲ ਘਰ ਬੈਠੇ ਪਾਓ ਵਧੀਆ ਇਲਾਜ।",
    startFree: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ",
    learnMore: "ਹੋਰ ਜਾਣੋ",
    available247: "24/7 ਉਪਲਬਧ",
    completelySafe: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਤ",
    useFree: "ਮੁਫਤ ਵਰਤੋ",
    solutionTitle: "GarudX ਨਾਲ ਸਭ ਕੁਝ ਆਸਾਨ",
    solutionSubtitle: "ਘਰ ਬੈਠੇ ਪੂਰੀ ਸਿਹਤ ਸੇਵਾ। ਸਮਾਂ ਬਚਾਓ, ਪੈਸੇ ਬਚਾਓ, ਸਿਹਤਮੰਦ ਰਹੋ।",
    videoConsult: "ਵੀਡੀਓ ਰਾਹੀਂ ਗੱਲ ਕਰੋ",
    videoConsultDesc: "ਡਾਕਟਰ ਨਾਲ ਆਹਮੋ-ਸਾਹਮਣੇ ਗੱਲ ਕਰੋ। ਹੌਲੀ ਨੈੱਟ ਵਿੱਚ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ।",
    videoConsultBenefit: "ਘੱਟ ਇੰਟਰਨੈੱਟ ਵਿੱਚ ਵੀ ਚੱਲਦਾ ਹੈ",
    offlineAccess: "ਬਿਨਾ ਨੈੱਟ ਵੀ ਚੱਲੇ",
    offlineAccessDesc: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਅਤੇ ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ ਹਮੇਸ਼ਾ ਤੁਹਾਡੇ ਫੋਨ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ।",
    offlineAccessBenefit: "ਔਫਲਾਈਨ ਵਿੱਚ ਵੀ ਸਭ ਕੁਝ ਮਿਲਦਾ ਹੈ",
    localLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ",
    localLanguageDesc: "ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅਤੇ ਹੋਰ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਵਰਤੋ।",
    localLanguageBenefit: "ਫੋਨ ਕਰ ਕੇ ਵੀ ਵਰਤ ਸਕਦੇ ਹੋ",
    ctaTitle: "ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ ਆਪਣਾ ਸਿਹਤ ਸਫਰ",
    ctaSubtitle: "ਲੱਖਾਂ ਪਰਿਵਾਰ ਪਹਿਲਾਂ ਤੋਂ ਇਸਤੇਮਾਲ ਕਰ ਰਹੇ ਹਨ। ਤੁਸੀਂ ਵੀ ਜੁੜੋ।",
    startNowFree: "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ - ਬਿਲਕੁਲ ਮੁਫਤ",
    noHiddenFees: "* ਕੋਈ ਛੁਪੀ ਫੀਸ ਨਹੀਂ | * ਕੋਈ ਮਾਸਿਕ ਚਾਰਜ ਨਹੀਂ | * 24/7 ਸਹਾਇਤਾ",
    allRightsReserved: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    madeForVillages: "ਪਿੰਡਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ।"
  }
};

type Language = 'en' | 'hi' | 'pa';

const LandingPageEnhanced: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('hi');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const t = translations[currentLanguage];

  const languages = [
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
        .animate-pulse-ring {
          animation: pulse 2s infinite;
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #10b981, #3b82f6, #8b5cf6, #f59e0b);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300 animate-pulse-ring">
                ❤️
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  GarudX
                </h1>
                <p className="text-xs text-gray-500">{t.tagline}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-green-500 transition-all duration-300 bg-white hover:shadow-md"
                >
                  🌍
                  <span className="text-sm font-medium">{currentLang.flag} {currentLang.name}</span>
                  <span className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px] animate-fadeInUp">
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-green-50 transition-colors ${
                          currentLanguage === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/login"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t.launchApp}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            {/* Background decorations */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-50 animate-bounce-gentle"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-6 animate-bounce-gentle">
                  📍
                  <span className="text-green-800 font-medium ml-2">
                    {currentLanguage === 'en' ? 'For Nabha and surrounding 173 villages' :
                     currentLanguage === 'pa' ? 'ਨਾਭਾ ਅਤੇ ਆਸ ਪਾਸ ਦੇ 173 ਪਿੰਡਾਂ ਲਈ' :
                     'Nabha और आसपास के 173 गांवों के लिए'}
                  </span>
                </div>
              </div>
              
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.heroTitle}
                </h1>
              </div>
              
              <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {t.heroDescription}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ▶️ {t.startFree}
                </Link>
                <a
                  href="#features"
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {t.learnMore}
                </a>
              </div>

              {/* Trust Indicators */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center justify-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg py-3 px-4 shadow-sm hover:shadow-md transition-shadow">
                  ✅ <span className="ml-2 font-medium">{t.available247}</span>
                </div>
                <div className="flex items-center justify-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg py-3 px-4 shadow-sm hover:shadow-md transition-shadow">
                  🛡️ <span className="ml-2 font-medium">{t.completelySafe}</span>
                </div>
                <div className="flex items-center justify-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg py-3 px-4 shadow-sm hover:shadow-md transition-shadow">
                  ⭐ <span className="ml-2 font-medium">{t.useFree}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.solutionTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.solutionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Consultation */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.videoConsult}</h3>
              <p className="text-gray-600 mb-4">
                {t.videoConsultDesc}
              </p>
              <div className="flex items-center text-green-600 font-medium">
                ✅ {t.videoConsultBenefit}
              </div>
            </div>

            {/* Offline Access */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.offlineAccess}</h3>
              <p className="text-gray-600 mb-4">
                {t.offlineAccessDesc}
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                ✅ {t.offlineAccessBenefit}
              </div>
            </div>

            {/* Local Language */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                🌍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.localLanguage}</h3>
              <p className="text-gray-600 mb-4">
                {t.localLanguageDesc}
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                ✅ {t.localLanguageBenefit}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t.ctaSubtitle}
          </p>
          
          <Link
            to="/login"
            className="bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ▶️ {t.startNowFree}
          </Link>

          <p className="text-white/80 text-sm mt-6">
            {t.noHiddenFees}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2 rounded-xl mr-3">
              ❤️
            </div>
            <div>
              <h3 className="text-xl font-bold">GarudX</h3>
              <p className="text-gray-400 text-sm">{t.tagline}</p>
            </div>
          </div>
          <p className="text-gray-400">
            © 2025 GarudX. {t.allRightsReserved} | {t.madeForVillages}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageEnhanced;
