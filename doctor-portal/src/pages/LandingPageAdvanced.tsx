import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GarudXLogo from '../components/GarudXLogo';

// Comprehensive translation system
const translations = {
  en: {
    tagline: "Doctor in Village",
    launchApp: "Launch App",
    heroTitle: "See a Doctor Without Leaving Your Village",
    heroSubtitle: "No more losing daily wages for hospital visits",
    heroDescription: "Get expert medical care from home with GarudX",
    startFree: "Start Free Consultation",
    learnMore: "Learn More",
    watchDemo: "Watch Demo",
    available247: "24/7 Available",
    completelySafe: "Completely Safe", 
    useFree: "Use for Free",
    
    // Problem section
    problemTitle: "The Daily Struggle of Rural Healthcare",
    problemStats: [
      { number: "₹500-2000", label: "Lost daily wages per hospital visit" },
      { number: "50+ km", label: "Average distance to quality healthcare" },
      { number: "6-8 hours", label: "Wasted time in travel and waiting" }
    ],
    problemDescription: "Every hospital visit means a day without income. Families choose between health and livelihood.",

    // Solution section
    solutionTitle: "Everything is Easy with GarudX",
    solutionSubtitle: "Complete healthcare from home. Save time, save money, stay healthy.",
    
    features: [
      {
        title: "Video Consultation",
        description: "Talk to qualified doctors face-to-face from your home",
        benefit: "Works even with slow internet",
        icon: "🩺"
      },
      {
        title: "Digital Prescriptions",
        description: "Get official prescriptions that pharmacies accept everywhere",
        benefit: "Valid at all medical stores",
        icon: "💊"
      },
      {
        title: "Health Records",
        description: "All your medical history stored safely on your phone",
        benefit: "Available offline anytime",
        icon: "📱"
      },
      {
        title: "Local Language Support",
        description: "Use in Punjabi, Hindi, and other Indian languages",
        benefit: "Call support also available",
        icon: "🌍"
      },
      {
        title: "Emergency Care",
        description: "24/7 emergency consultation and ambulance booking",
        benefit: "Connect instantly in emergencies",
        icon: "🚨"
      },
      {
        title: "Family Health",
        description: "Manage health for your entire family in one app",
        benefit: "Elderly and children care included",
        icon: "👨‍👩‍👧‍👦"
      }
    ],

    // How it works
    howItWorksTitle: "How GarudX Works - Simple in 3 Steps",
    steps: [
      {
        step: "1",
        title: "Book Consultation",
        description: "Choose your preferred time and doctor specialty"
      },
      {
        step: "2", 
        title: "Video Call with Doctor",
        description: "Discuss your health concerns face-to-face"
      },
      {
        step: "3",
        title: "Get Treatment",
        description: "Receive prescription and follow-up care plan"
      }
    ],

    // Savings section
    savingsTitle: "Monthly Savings with GarudX",
    savingsItems: [
      { item: "Travel costs saved", amount: "₹1,200" },
      { item: "Daily wage loss avoided", amount: "₹3,500" },
      { item: "Time saved (valued)", amount: "₹2,000" },
      { item: "Family healthcare", amount: "₹1,800" }
    ],
    totalSavings: "₹8,500",
    vsTraditional: "vs ₹12,000 traditional healthcare costs",

    // CTA section
    ctaTitle: "Start Your Health Journey Today",
    ctaSubtitle: "Join thousands of families who chose GarudX for better healthcare",
    startNowFree: "Start Now - Completely Free",
    noHiddenFees: "✓ No hidden fees ✓ No monthly charges ✓ 24/7 support",
    trustIndicators: "Trusted by 50,000+ families across Punjab",

    // Footer
    footerTagline: "Healthcare that comes to you",
    allRightsReserved: "All rights reserved.",
    madeForVillages: "Made for villages, by people who care."
  },
  hi: {
    tagline: "गांव में डॉक्टर",
    launchApp: "ऐप खोलें",
    heroTitle: "गांव छोड़े बिना डॉक्टर से मिलें",
    heroSubtitle: "अब दिन भर की मजदूरी नहीं गंवानी पड़ेगी",
    heroDescription: "GarudX के साथ घर बैठे पाएं बेहतरीन इलाज",
    startFree: "फ्री सलाह शुरू करें",
    learnMore: "और जानें",
    watchDemo: "डेमो देखें",
    available247: "24/7 उपलब्ध",
    completelySafe: "पूरी तरह सुरक्षित",
    useFree: "मुफ्त में इस्तेमाल करें",
    
    problemTitle: "ग्रामीण स्वास्थ्य सेवा की दैनिक समस्या",
    problemStats: [
      { number: "₹500-2000", label: "हर अस्पताल के चक्कर में गंवाई मजदूरी" },
      { number: "50+ किमी", label: "अच्छे इलाज तक की औसत दूरी" },
      { number: "6-8 घंटे", label: "यात्रा और इंतजार में बर्बाद समय" }
    ],
    problemDescription: "हर अस्पताल जाना मतलब एक दिन की कमाई का चले जाना। परिवार को सेहत और रोजी-रोटी के बीच चुनना पड़ता है।",

    solutionTitle: "GarudX के साथ सब कुछ आसान",
    solutionSubtitle: "घर बैठे पूरी स्वास्थ्य सेवा। समय बचाएं, पैसे बचाएं, स्वस्थ रहें।",
    
    features: [
      {
        title: "वीडियो से डॉक्टर से बात",
        description: "घर बैठे योग्य डॉक्टरों से आमने-सामने बात करें",
        benefit: "धीमे इंटरनेट में भी चलता है",
        icon: "🩺"
      },
      {
        title: "डिजिटल पर्चे",
        description: "असली पर्चे पाएं जो हर मेडिकल स्टोर मानता है",
        benefit: "सभी दवा की दुकानों में मान्य",
        icon: "💊"
      },
      {
        title: "स्वास्थ्य रिकॉर्ड",
        description: "आपका सारा मेडिकल इतिहास फोन में सुरक्षित",
        benefit: "बिना नेट के भी उपलब्ध",
        icon: "📱"
      },
      {
        title: "अपनी भाषा में",
        description: "पंजाबी, हिंदी और अन्य भारतीय भाषाओं में इस्तेमाल करें",
        benefit: "फोन सहायता भी उपलब्ध",
        icon: "🌍"
      },
      {
        title: "आपातकालीन देखभाल",
        description: "24/7 इमरजेंसी सलाह और एम्बुलेंस बुकिंग",
        benefit: "आपातकाल में तुरंत जुड़ें",
        icon: "🚨"
      },
      {
        title: "पारिवारिक स्वास्थ्य",
        description: "पूरे परिवार की सेहत एक ऐप में संभालें",
        benefit: "बुजुर्गों और बच्चों की देखभाल शामिल",
        icon: "👨‍👩‍👧‍👦"
      }
    ],

    howItWorksTitle: "GarudX कैसे काम करता है - 3 आसान कदम",
    steps: [
      {
        step: "1",
        title: "सलाह बुक करें",
        description: "अपना पसंदीदा समय और डॉक्टर की विशेषता चुनें"
      },
      {
        step: "2", 
        title: "डॉक्टर से वीडियो कॉल",
        description: "अपनी स्वास्थ्य समस्याओं पर आमने-सामने चर्चा करें"
      },
      {
        step: "3",
        title: "इलाज पाएं",
        description: "पर्चा और फॉलो-अप केयर प्लान पाएं"
      }
    ],

    savingsTitle: "GarudX से मासिक बचत",
    savingsItems: [
      { item: "यात्रा खर्च की बचत", amount: "₹1,200" },
      { item: "दैनिक मजदूरी का नुकसान बचा", amount: "₹3,500" },
      { item: "समय की बचत (मूल्य)", amount: "₹2,000" },
      { item: "पारिवारिक स्वास्थ्य सेवा", amount: "₹1,800" }
    ],
    totalSavings: "₹8,500",
    vsTraditional: "बनाम ₹12,000 पारंपरिक स्वास्थ्य सेवा लागत",

    ctaTitle: "आज ही शुरू करें अपना स्वास्थ्य सफर",
    ctaSubtitle: "हजारों परिवारों से जुड़ें जिन्होंने बेहतर स्वास्थ्य सेवा के लिए GarudX चुना",
    startNowFree: "अभी शुरू करें - बिल्कुल मुफ्त",
    noHiddenFees: "✓ कोई छुपी फीस नहीं ✓ कोई मासिक चार्ज नहीं ✓ 24/7 सहायता",
    trustIndicators: "पंजाब भर के 50,000+ परिवारों का भरोसा",

    footerTagline: "स्वास्थ्य सेवा जो आप तक आती है",
    allRightsReserved: "सभी अधिकार सुरक्षित हैं।",
    madeForVillages: "गांवों के लिए बनाया गया, उन लोगों द्वारा जो परवाह करते हैं।"
  },
  pa: {
    tagline: "ਪਿੰਡ ਵਿੱਚ ਡਾਕਟਰ",
    launchApp: "ਐਪ ਖੋਲ੍ਹੋ",
    heroTitle: "ਪਿੰਡ ਛੱਡੇ ਬਿਨਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ",
    heroSubtitle: "ਹੁਣ ਦਿਨ ਭਰ ਦੀ ਮਜਦੂਰੀ ਨਹੀਂ ਗੁਆਉਣੀ ਪਵੇਗੀ",
    heroDescription: "GarudX ਨਾਲ ਘਰ ਬੈਠੇ ਪਾਓ ਵਧੀਆ ਇਲਾਜ",
    startFree: "ਮੁਫਤ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ",
    learnMore: "ਹੋਰ ਜਾਣੋ",
    watchDemo: "ਡੈਮੋ ਦੇਖੋ",
    available247: "24/7 ਉਪਲਬਧ",
    completelySafe: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਤ",
    useFree: "ਮੁਫਤ ਵਰਤੋ",
    
    problemTitle: "ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਦੀ ਰੋਜ਼ਾਨਾ ਸਮੱਸਿਆ",
    problemStats: [
      { number: "₹500-2000", label: "ਹਰ ਹਸਪਤਾਲ ਜਾਣ ਵਿੱਚ ਗੁਆਚੀ ਮਜਦੂਰੀ" },
      { number: "50+ ਕਿਮੀ", label: "ਚੰਗੇ ਇਲਾਜ ਤੱਕ ਦੀ ਔਸਤ ਦੂਰੀ" },
      { number: "6-8 ਘੰਟੇ", label: "ਸਫਰ ਅਤੇ ਉਡੀਕ ਵਿੱਚ ਬਰਬਾਦ ਸਮਾਂ" }
    ],
    problemDescription: "ਹਰ ਹਸਪਤਾਲ ਜਾਣਾ ਮਤਲਬ ਇੱਕ ਦਿਨ ਦੀ ਕਮਾਈ ਦਾ ਚਲੇ ਜਾਣਾ। ਪਰਿਵਾਰ ਨੂੰ ਸਿਹਤ ਅਤੇ ਰੋਜ਼ੀ-ਰੋਟੀ ਵਿਚਕਾਰ ਚੁਣਨਾ ਪੈਂਦਾ ਹੈ।",

    solutionTitle: "GarudX ਨਾਲ ਸਭ ਕੁਝ ਆਸਾਨ",
    solutionSubtitle: "ਘਰ ਬੈਠੇ ਪੂਰੀ ਸਿਹਤ ਸੇਵਾ। ਸਮਾਂ ਬਚਾਓ, ਪੈਸੇ ਬਚਾਓ, ਸਿਹਤਮੰਦ ਰਹੋ।",
    
    features: [
      {
        title: "ਵੀਡੀਓ ਰਾਹੀਂ ਡਾਕਟਰ ਨਾਲ ਗੱਲ",
        description: "ਘਰ ਬੈਠੇ ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਆਹਮੋ-ਸਾਹਮਣੇ ਗੱਲ ਕਰੋ",
        benefit: "ਹੌਲੀ ਇੰਟਰਨੈੱਟ ਵਿੱਚ ਵੀ ਚੱਲਦਾ ਹੈ",
        icon: "🩺"
      },
      {
        title: "ਡਿਜਿਟਲ ਪਰਚੇ",
        description: "ਅਸਲੀ ਪਰਚੇ ਪਾਓ ਜੋ ਹਰ ਮੈਡੀਕਲ ਸਟੋਰ ਮੰਨਦਾ ਹੈ",
        benefit: "ਸਾਰੇ ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ ਵਿੱਚ ਮਾਨਯ",
        icon: "💊"
      },
      {
        title: "ਸਿਹਤ ਰਿਕਾਰਡ",
        description: "ਤੁਹਾਡਾ ਸਾਰਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਫੋਨ ਵਿੱਚ ਸੁਰੱਖਿਤ",
        benefit: "ਬਿਨਾ ਨੈੱਟ ਵੀ ਉਪਲਬਧ",
        icon: "📱"
      },
      {
        title: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ",
        description: "ਪੰਜਾਬੀ, ਹਿੰਦੀ ਅਤੇ ਹੋਰ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਵਰਤੋ",
        benefit: "ਫੋਨ ਸਹਾਇਤਾ ਵੀ ਉਪਲਬਧ",
        icon: "🌍"
      },
      {
        title: "ਐਮਰਜੈਂਸੀ ਦੇਖਭਾਲ",
        description: "24/7 ਐਮਰਜੈਂਸੀ ਸਲਾਹ ਅਤੇ ਐਂਬੁਲੈਂਸ ਬੁੱਕਿੰਗ",
        benefit: "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਤੁਰੰਤ ਜੁੜੋ",
        icon: "🚨"
      },
      {
        title: "ਪਰਿਵਾਰਿਕ ਸਿਹਤ",
        description: "ਪੂਰੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਇੱਕ ਐਪ ਵਿੱਚ ਸੰਭਾਲੋ",
        benefit: "ਬਜੁਰਗਾਂ ਅਤੇ ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ ਸ਼ਾਮਿਲ",
        icon: "👨‍👩‍👧‍👦"
      }
    ],

    howItWorksTitle: "GarudX ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ - 3 ਆਸਾਨ ਕਦਮ",
    steps: [
      {
        step: "1",
        title: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
        description: "ਆਪਣਾ ਪਸੰਦੀਦਾ ਸਮਾਂ ਅਤੇ ਡਾਕਟਰ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਚੁਣੋ"
      },
      {
        step: "2", 
        title: "ਡਾਕਟਰ ਨਾਲ ਵੀਡੀਓ ਕਾਲ",
        description: "ਆਪਣੀਆਂ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਬਾਰੇ ਆਹਮੋ-ਸਾਹਮਣੇ ਗੱਲਬਾਤ ਕਰੋ"
      },
      {
        step: "3",
        title: "ਇਲਾਜ ਪਾਓ",
        description: "ਪਰਚਾ ਅਤੇ ਫਾਲੋ-ਅੱਪ ਕੇਅਰ ਪਲਾਨ ਪਾਓ"
      }
    ],

    savingsTitle: "GarudX ਨਾਲ ਮਾਸਿਕ ਬਚਤ",
    savingsItems: [
      { item: "ਯਾਤਰਾ ਖਰਚ ਦੀ ਬਚਤ", amount: "₹1,200" },
      { item: "ਰੋਜ਼ਾਨਾ ਮਜਦੂਰੀ ਦਾ ਨੁਕਸਾਨ ਬਚਾਇਆ", amount: "₹3,500" },
      { item: "ਸਮੇਂ ਦੀ ਬਚਤ (ਮੁੱਲ)", amount: "₹2,000" },
      { item: "ਪਰਿਵਾਰਿਕ ਸਿਹਤ ਸੇਵਾ", amount: "₹1,800" }
    ],
    totalSavings: "₹8,500",
    vsTraditional: "ਬਨਾਮ ਰਵਾਇਤੀ ਸਿਹਤ ਸੇਵਾ ਲਾਗਤ ₹12,000",

    ctaTitle: "ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ ਆਪਣਾ ਸਿਹਤ ਸਫਰ",
    ctaSubtitle: "ਹਜ਼ਾਰਾਂ ਪਰਿਵਾਰਾਂ ਨਾਲ ਜੁੜੋ ਜਿਨ੍ਹਾਂ ਨੇ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਲਈ GarudX ਚੁਣਿਆ",
    startNowFree: "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ - ਬਿਲਕੁਲ ਮੁਫਤ",
    noHiddenFees: "✓ ਕੋਈ ਛੁਪੀ ਫੀਸ ਨਹੀਂ ✓ ਕੋਈ ਮਾਸਿਕ ਚਾਰਜ ਨਹੀਂ ✓ 24/7 ਸਹਾਇਤਾ",
    trustIndicators: "ਪੰਜਾਬ ਭਰ ਦੇ 50,000+ ਪਰਿਵਾਰਾਂ ਦਾ ਭਰੋਸਾ",

    footerTagline: "ਸਿਹਤ ਸੇਵਾ ਜੋ ਤੁਹਾਡੇ ਤੱਕ ਆਉਂਦੀ ਹੈ",
    allRightsReserved: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    madeForVillages: "ਪਿੰਡਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ, ਉਹਨਾਂ ਲੋਕਾਂ ਦੁਆਰਾ ਜੋ ਪਰਵਾਹ ਕਰਦੇ ਹਨ।"
  }
};

type Language = 'en' | 'hi' | 'pa';

// Typing animation hook
const useTypingAnimation = (texts: string[], speed = 100, pause = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [displayText, currentIndex, isDeleting, texts, speed, pause]);

  return displayText;
};

// Floating animation component
const FloatingElement: React.FC<{ children: React.ReactNode; delay?: number; duration?: number }> = ({ 
  children, 
  delay = 0, 
  duration = 3 
}) => (
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


const LandingPageAdvanced: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('hi');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const t = translations[currentLanguage];

  const heroTexts = [
    t.heroTitle,
    t.heroSubtitle,
    t.heroDescription
  ];

  const typingText = useTypingAnimation(heroTexts, 80, 3000);

  const languages = [
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa' as Language, name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % t.features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [t.features.length]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Advanced CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1 }
          51%, 100% { opacity: 0 }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse 2s infinite;
        }
        
        .animate-gradient {
          background: linear-gradient(-45deg, #10b981, #3b82f6, #8b5cf6, #f59e0b);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s infinite;
          color: #10b981;
          font-weight: bold;
        }
        
        .glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .parallax {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>

      {/* Sticky Header with Glassmorphism */}
      <header className="glass fixed top-0 w-full z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center group cursor-pointer">
              <FloatingElement delay={0} duration={2}>
                <GarudXLogo 
                  size="lg" 
                  variant="gradient" 
                  animated={true} 
                  showText={false}
                />
              </FloatingElement>
              <div className="ml-4">
                <h1 className="text-3xl font-bold gradient-text">
                  GarudX
                </h1>
                <p className="text-sm text-gray-600">{t.tagline}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl glass hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.name}</span>
                  <span className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 glass rounded-xl shadow-2xl min-w-[180px] animate-fadeInUp">
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-white/20 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl ${
                          currentLanguage === lang.code ? 'bg-green-50/50 text-green-700' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/login"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t.launchApp} →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Advanced Animations */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden pt-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement delay={0} duration={4}>
            <div className="absolute top-20 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-xl"></div>
          </FloatingElement>
          <FloatingElement delay={1} duration={5}>
            <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 blur-xl"></div>
          </FloatingElement>
          <FloatingElement delay={2} duration={3}>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-purple-300 rounded-full opacity-20 blur-xl"></div>
          </FloatingElement>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 animate-bounce-gentle">
                  <span className="text-2xl mr-3">📍</span>
                  <span className="text-green-800 font-semibold">
                    {currentLanguage === 'en' ? 'For Nabha and surrounding 173 villages' :
                     currentLanguage === 'pa' ? 'ਨਾਭਾ ਅਤੇ ਆਸ ਪਾਸ ਦੇ 173 ਪਿੰਡਾਂ ਲਈ' :
                     'Nabha और आसपास के 173 गांवों के लिए'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                    <span className="typing-cursor gradient-text">
                      {typingText}
                    </span>
                  </h1>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span className="mr-3 text-xl">🚀</span>
                  {t.startFree}
                  <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                
                <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 font-semibold text-lg flex items-center justify-center transform hover:scale-105">
                  <span className="mr-3 text-xl">🎥</span>
                  {t.watchDemo}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[t.available247, t.completelySafe, t.useFree].map((text, index) => (
                  <div 
                    key={index}
                    className="glass rounded-xl py-4 px-6 text-center card-hover"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="text-2xl mb-2">
                      {index === 0 ? '✅' : index === 1 ? '🛡️' : '⭐'}
                    </div>
                    <span className="font-semibold text-gray-800">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Elements */}
            <div className={`relative ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="relative">
                <FloatingElement delay={0} duration={4}>
                  <div className="glass rounded-3xl p-8 shadow-2xl">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse-ring">
                        <GarudXLogo 
                          size="xl" 
                          variant="primary" 
                          animated={true} 
                          showText={false}
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {currentLanguage === 'en' ? 'Dr. Available Now' :
                           currentLanguage === 'pa' ? 'ਡਾਕਟਰ ਹੁਣ ਉਪਲਬਧ' :
                           'डॉक्टर अभी उपलब्ध'}
                        </h3>
                        <p className="text-gray-600">
                          {currentLanguage === 'en' ? 'Connect instantly for consultation' :
                           currentLanguage === 'pa' ? 'ਸਲਾਹ ਲਈ ਤੁਰੰਤ ਜੁੜੋ' :
                           'सलाह के लिए तुरंत जुड़ें'}
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-800 mb-6 animate-fadeInUp">
              {t.problemTitle}
            </h2>
            <p className="text-xl text-red-700 max-w-3xl mx-auto animate-fadeInUp">
              {t.problemDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.problemStats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl md:text-6xl font-bold text-red-600 mb-4 gradient-text">
                  {stat.number}
                </div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 gradient-text">
              {t.solutionTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.solutionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 bg-white rounded-2xl shadow-lg border-2 transition-all duration-500 card-hover ${
                  activeFeature === index 
                    ? 'border-green-500 shadow-2xl bg-green-50' 
                    : 'border-gray-100 hover:border-green-300'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 animate-bounce-gentle">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center text-green-600 font-semibold bg-green-100 px-4 py-2 rounded-full">
                    ✅ {feature.benefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold animate-pulse-ring">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="text-4xl text-green-500 animate-bounce-gentle">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              {t.savingsTitle}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {t.savingsItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="text-gray-700 font-medium">{item.item}</span>
                    <span className="text-2xl font-bold text-green-600">{item.amount}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl md:text-8xl font-bold gradient-text mb-4">
                    {t.totalSavings}
                  </div>
                  <p className="text-xl text-gray-600">{t.vsTraditional}</p>
                </div>
                
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg inline-flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  💰 {t.startNowFree}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 animate-gradient relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {t.ctaTitle}
          </h2>
          <p className="text-2xl text-white/90 mb-8">
            {t.ctaSubtitle}
          </p>
          <p className="text-lg text-white/80 mb-12">
            {t.trustIndicators}
          </p>
          
          <Link
            to="/login"
            className="group bg-white text-green-600 px-12 py-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-2xl inline-flex items-center shadow-2xl hover:shadow-3xl transform hover:scale-105 mb-8"
          >
            <span className="mr-4 text-3xl group-hover:animate-bounce">🚀</span>
            {t.startNowFree}
            <span className="ml-4 group-hover:translate-x-2 transition-transform text-3xl">→</span>
          </Link>

          <p className="text-white/90 text-lg">
            {t.noHiddenFees}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <FloatingElement>
                <GarudXLogo 
                  size="xl" 
                  variant="white" 
                  animated={true} 
                  showText={false}
                />
              </FloatingElement>
              <div className="ml-4">
                <h3 className="text-3xl font-bold gradient-text">GarudX</h3>
                <p className="text-gray-400">{t.footerTagline}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © 2025 GarudX. {t.allRightsReserved}
              </p>
              <p className="text-green-400 mt-2 font-medium">
                {t.madeForVillages}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageAdvanced;
