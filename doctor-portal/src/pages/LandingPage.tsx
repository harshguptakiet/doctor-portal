import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Phone,
  MapPin,
  Clock,
  Shield,
  Users,
  Download,
  Play,
  CheckCircle,
  Star,
  Languages,
  ChevronDown,
  Stethoscope,
  Globe,
  Wifi,
  Eye,
  AlertCircle,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useTranslation, Language } from '../utils/translations';

// Language Toggle Component
const LanguageToggle: React.FC<{ currentLanguage: Language; onLanguageChange: (lang: Language) => void }> = (
  { currentLanguage, onLanguageChange }
) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ];
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-green-500 transition-colors bg-white"
      >
        <Languages className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLang.flag} {currentLang.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-green-50 transition-colors ${
                currentLanguage === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Floating Animation Component
const FloatingElement: React.FC<{ children: React.ReactNode; delay?: number; duration?: number }> = ({
  children,
  delay = 0,
  duration = 6
}) => {
  return (
    <div 
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Typing Animation Component
const TypingAnimation: React.FC<{ texts: string[]; speed?: number }> = ({ texts, speed = 100 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const text = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(text.substring(0, currentText.length + 1));
        if (currentText === text) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(text.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts, speed]);
  
  return (
    <span className="text-green-600">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const LandingPage: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  console.log('LandingPage loaded, current language:', currentLanguage);
  console.log('Translation object:', t);
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background: linear-gradient(-45deg, #10b981, #3b82f6, #8b5cf6, #f59e0b);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  GarudX
                </h1>
                <p className="text-xs text-gray-500">{t.tagline}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle 
                currentLanguage={currentLanguage} 
                onLanguageChange={changeLanguage} 
              />
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
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-6">
                <MapPin className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  {currentLanguage === 'en' ? 'For Nabha and surrounding 173 villages' : 
                   currentLanguage === 'pa' ? 'ਨਾਭਾ ਅਤੇ ਆਸ ਪਾਸ ਦੇ 173 ਪਿੰਡਾਂ ਲਈ' :
                   'Nabha और आसपास के 173 गांवों के लिए'}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {t.heroTitle}
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                {t.startFree}
              </Link>
              <a
                href="#features"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
              >
                {t.learnMore}
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">{t.available247}</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">{t.completelySafe}</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <Star className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">{t.useFree}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              क्यों परेशान होते रहें?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              नाभा के Civil Hospital में सिर्फ 11 डॉक्टर हैं 23 की जगह। आपको क्यों भुगतना पड़े?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">दिन भर की मजदूरी गई</h3>
              <p className="text-gray-600">
                अस्पताल जाने के लिए पूरा दिन बर्बाद। कई बार डॉक्टर मिले ही नहीं।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">लंबा सफर, खराब रास्ते</h3>
              <p className="text-gray-600">
                173 गांवों से आना पड़ता है। कच्चे रास्ते, महंगा किराया।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">यकीन नहीं मिलता</h3>
              <p className="text-gray-600">
                जाकर पता चलता है कि दवाई नहीं मिली या टेस्ट नहीं हुआ।
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-gray-900">
              आपको इस तकलीफ से गुजरने की जरूरत नहीं है।
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
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
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">वीडियो से बात करें</h3>
              <p className="text-gray-600 mb-4">
                डॉक्टर से आमने-सामने बात करें। धीमे नेट में भी काम करता है।
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                कम इंटरनेट में भी चलता है
              </div>
            </div>

            {/* Offline Access */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Wifi className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">बिना नेट के भी चले</h3>
              <p className="text-gray-600 mb-4">
                आपकी रिपोर्ट और दवाई की जानकारी हमेशा आपके फोन में रहती है।
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                ऑफलाइन में भी सब कुछ मिलता है
              </div>
            </div>

            {/* Local Language */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">अपनी भाषा में</h3>
              <p className="text-gray-600 mb-4">
                पंजाबी, हिंदी, और अन्य भारतीय भाषाओं में इस्तेमाल करें।
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                फोन करके भी इस्तेमाल करें
              </div>
            </div>

            {/* AI Health Check */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">तुरंत जांच करें</h3>
              <p className="text-gray-600 mb-4">
                लक्षण बताएं, तुरंत पता चल जाएगा कि कया करना है।
              </p>
              <div className="flex items-center text-orange-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                बिल्कुल निजी और सुरक्षित
              </div>
            </div>

            {/* Pharmacy Locator */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">दवाई कहां मिलेगी</h3>
              <p className="text-gray-600 mb-4">
                घर से ही पता करें कि आपकी दवाई कहां उपलब्ध है।
              </p>
              <div className="flex items-center text-red-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                फालतू के चक्कर नहीं लगाने पड़ेंगे
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-yellow-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">एमरजेंसी में मदद</h3>
              <p className="text-gray-600 mb-4">
                एक टैप में एम्बुलेंस बुलाएं। तुरंत पहुंचेगी।
              </p>
              <div className="flex items-center text-yellow-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                24/7 तुरंत सेवा
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              कैसे काम करता है?
            </h2>
            <p className="text-xl text-gray-600">
              बस 3 आसान स्टेप में शुरू करें
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                स्टेप 1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ऐप डाउनलोड करें</h3>
              <p className="text-gray-600">
                फ्री में डाउनलोड करें। किसी भी एंड्राइड फोन में चलता है।
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                स्टेप 2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">रजिस्टर करें</h3>
              <p className="text-gray-600">
                बस नाम और फोन नंबर डालें। सारी जानकारी सुरक्षित रहती है।
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                स्टेप 3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">डॉक्टर से मिलें</h3>
              <p className="text-gray-600">
                तुरंत डॉक्टर से बात करें। पूरा इलाज घर बैठे।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              क्यों चुनें GarudX?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">₹500-1000 रोज बचाएं</h3>
                    <p className="text-gray-600">
                      अस्पताल जाने का खर्च, मजदूरी का नुकसान - सब बचेगा।
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">4-6 घंटे बचाएं</h3>
                    <p className="text-gray-600">
                      सफर का समय, इंतजार का समय - सब बचेगा।
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">बेहतर इलाज पाएं</h3>
                    <p className="text-gray-600">
                      अच्छे डॉक्टर, सही समय पर सलाह, नियमित जांच।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  हर महीने बचत
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">अस्पताल जाने का खर्च</span>
                    <span className="text-red-600 font-semibold">₹2000+</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">मजदूरी का नुकसान</span>
                    <span className="text-red-600 font-semibold">₹1500+</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">GarudX की लागत</span>
                    <span className="text-green-600 font-bold">₹0</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-green-100 rounded-lg px-4">
                    <span className="font-bold text-gray-900">कुल बचत</span>
                    <span className="text-green-600 font-bold text-xl">₹3500+</span>
                  </div>
                </div>
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/login"
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-bold text-lg flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              अभी शुरू करें - बिल्कुल मुफ्त
            </Link>
          </div>

          <p className="text-green-100 text-sm">
            * कोई छुपी हुई फीस नहीं | * कोई मासिक चार्ज नहीं | * 24/7 सपोर्ट
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-600 p-2 rounded-lg mr-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GarudX</h3>
                  <p className="text-gray-400 text-sm">गांव में डॉक्टर</p>
                </div>
              </div>
              <p className="text-gray-400">
                हर गांव में बेहतर स्वास्थ्य सेवा पहुंचाना हमारा लक्ष्य है।
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">सेवाएं</h4>
              <ul className="space-y-2 text-gray-400">
                <li>वीडियो कंसल्टेशन</li>
                <li>AI स्वास्थ्य जांच</li>
                <li>दवाई की खोज</li>
                <li>एमरजेंसी सेवा</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">सपोर्ट</h4>
              <ul className="space-y-2 text-gray-400">
                <li>24/7 हेल्पलाइन</li>
                <li>कैसे इस्तेमाल करें</li>
                <li>तकनीकी सहायता</li>
                <li>शिकायत दर्ज करें</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">संपर्क</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 1800-XXX-XXXX</p>
                <p>📧 support@garudx.com</p>
                <p>🏥 Nabha, Punjab</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 GarudX. सभी अधिकार सुरक्षित हैं। | गांव के लिए बनाया गया।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
