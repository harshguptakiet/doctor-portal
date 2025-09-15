import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Languages, ChevronDown, Play } from 'lucide-react';
import { useTranslation, type Language } from '../utils/translations';

const LandingPageSimple: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const [isLangOpen, setIsLangOpen] = React.useState(false);

  const languages = [
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GarudX</h1>
                <p className="text-xs text-gray-500">{t.tagline}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-green-500 transition-colors bg-white"
                >
                  <Languages className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentLang.flag} {currentLang.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLangOpen(false);
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
              
              <Link 
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {t.launchApp}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.heroTitle}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              {t.startFree}
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-2 rounded-lg mr-3">
              <Heart className="h-6 w-6 text-white" />
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

export default LandingPageSimple;
