// Import React at the top
import * as React from 'react';

export type Language = 'en' | 'hi' | 'pa';

export interface Translation {
  // Header
  tagline: string;
  launchApp: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  startFree: string;
  learnMore: string;
  available247: string;
  completelySafe: string;
  useFree: string;

  // Problem Section
  problemTitle: string;
  problemSubtitle: string;
  lostWages: string;
  lostWagesDesc: string;
  longJourney: string;
  longJourneyDesc: string;
  noGuarantee: string;
  noGuaranteeDesc: string;
  noNeedSuffer: string;

  // Solution Section
  solutionTitle: string;
  solutionSubtitle: string;
  
  // Features
  videoConsult: string;
  videoConsultDesc: string;
  videoConsultBenefit: string;
  offlineAccess: string;
  offlineAccessDesc: string;
  offlineAccessBenefit: string;
  localLanguage: string;
  localLanguageDesc: string;
  localLanguageBenefit: string;
  aiHealthCheck: string;
  aiHealthCheckDesc: string;
  aiHealthCheckBenefit: string;
  pharmacyLocator: string;
  pharmacyLocatorDesc: string;
  pharmacyLocatorBenefit: string;
  emergency: string;
  emergencyDesc: string;
  emergencyBenefit: string;

  // How It Works
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1: string;
  step1Title: string;
  step1Desc: string;
  step2: string;
  step2Title: string;
  step2Desc: string;
  step3: string;
  step3Title: string;
  step3Desc: string;

  // Benefits
  whyChooseTitle: string;
  saveMoney: string;
  saveMoneyDesc: string;
  saveTime: string;
  saveTimeDesc: string;
  betterTreatment: string;
  betterTreatmentDesc: string;
  monthlySavings: string;
  hospitalCost: string;
  lostIncome: string;
  appCost: string;
  totalSavings: string;

  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  startNowFree: string;
  noHiddenFees: string;

  // Footer
  mission: string;
  services: string;
  videoConsultation: string;
  aiHealthscreening: string;
  medicineSearch: string;
  emergencyService: string;
  support: string;
  helpline247: string;
  howToUse: string;
  techSupport: string;
  complaints: string;
  contact: string;
  allRightsReserved: string;
  madeForVillages: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    // Header
    tagline: "Doctor in Village",
    launchApp: "Launch App",

    // Hero Section
    heroTitle: "See a Doctor Without Leaving Your Village",
    heroSubtitle: "Quality Healthcare at Your Doorstep",
    heroDescription: "No more losing daily wages for hospital visits. Get expert medical care from home with GarudX.",
    startFree: "Start Free",
    learnMore: "Learn More",
    available247: "24/7 Available",
    completelySafe: "Completely Safe",
    useFree: "Use for Free",

    // Problem Section
    problemTitle: "Why Keep Struggling?",
    problemSubtitle: "Nabha's Civil Hospital has only 11 doctors instead of 23. Why should you suffer?",
    lostWages: "Lost Daily Wages",
    lostWagesDesc: "Whole day wasted going to hospital. Often doctors aren't even available.",
    longJourney: "Long Journey, Bad Roads",
    longJourneyDesc: "People from 173 villages have to come. Rough roads, expensive travel.",
    noGuarantee: "No Certainty",
    noGuaranteeDesc: "You go there only to find medicines unavailable or tests not done.",
    noNeedSuffer: "You don't need to go through this suffering.",

    // Solution Section
    solutionTitle: "Everything is Easy with GarudX",
    solutionSubtitle: "Complete healthcare from home. Save time, save money, stay healthy.",

    // Features
    videoConsult: "Video Consultation",
    videoConsultDesc: "Talk to doctors face-to-face. Works even with slow internet.",
    videoConsultBenefit: "Works with low internet too",
    offlineAccess: "Works Without Internet",
    offlineAccessDesc: "Your reports and medicine info always stays on your phone.",
    offlineAccessBenefit: "Everything available offline too",
    localLanguage: "In Your Language",
    localLanguageDesc: "Use in Punjabi, Hindi, and other Indian languages.",
    localLanguageBenefit: "Can also use by calling",
    aiHealthCheck: "Instant Health Check",
    aiHealthCheckDesc: "Tell your symptoms, instantly know what to do.",
    aiHealthCheckBenefit: "Completely private and secure",
    pharmacyLocator: "Find Medicines",
    pharmacyLocatorDesc: "Check from home where your medicines are available.",
    pharmacyLocatorBenefit: "No unnecessary trips",
    emergency: "Emergency Help",
    emergencyDesc: "Call ambulance with one tap. Arrives immediately.",
    emergencyBenefit: "24/7 instant service",

    // How It Works
    howItWorksTitle: "How Does It Work?",
    howItWorksSubtitle: "Start with just 3 easy steps",
    step1: "Step 1",
    step1Title: "Download App",
    step1Desc: "Download for free. Works on any Android phone.",
    step2: "Step 2",
    step2Title: "Register",
    step2Desc: "Just enter name and phone number. All information stays secure.",
    step3: "Step 3",
    step3Title: "Meet Doctor",
    step3Desc: "Talk to doctor immediately. Complete treatment from home.",

    // Benefits
    whyChooseTitle: "Why Choose GarudX?",
    saveMoney: "Save ₹500-1000 Daily",
    saveMoneyDesc: "Hospital travel costs, lost wages - everything saved.",
    saveTime: "Save 4-6 Hours",
    saveTimeDesc: "Travel time, waiting time - everything saved.",
    betterTreatment: "Get Better Treatment",
    betterTreatmentDesc: "Good doctors, timely advice, regular checkups.",
    monthlySavings: "Monthly Savings",
    hospitalCost: "Hospital visit cost",
    lostIncome: "Lost income",
    appCost: "GarudX cost",
    totalSavings: "Total Savings",

    // CTA
    ctaTitle: "Start Your Health Journey Today",
    ctaSubtitle: "Millions of families are already using it. Join now.",
    startNowFree: "Start Now - Completely Free",
    noHiddenFees: "* No hidden fees | * No monthly charges | * 24/7 support",

    // Footer
    mission: "Our goal is to bring better healthcare to every village.",
    services: "Services",
    videoConsultation: "Video Consultation",
    aiHealthscreening: "AI Health Screening",
    medicineSearch: "Medicine Search",
    emergencyService: "Emergency Service",
    support: "Support",
    helpline247: "24/7 Helpline",
    howToUse: "How to Use",
    techSupport: "Tech Support",
    complaints: "File Complaints",
    contact: "Contact",
    allRightsReserved: "All rights reserved.",
    madeForVillages: "Made for villages."
  },

  hi: {
    // Header
    tagline: "गांव में डॉक्टर",
    launchApp: "ऐप खोलें",

    // Hero Section
    heroTitle: "गांव छोड़े बिना डॉक्टर से मिलें",
    heroSubtitle: "आपके घर पर बेहतरीन स्वास्थ्य सेवा",
    heroDescription: "अब आपको अस्पताल के लिए दिन भर की मजदूरी नहीं गंवानी पड़ेगी। GarudX के साथ घर बैठे पाएं बेहतरीन इलाज।",
    startFree: "फ्री में शुरू करें",
    learnMore: "और जानें",
    available247: "24/7 उपलब्ध",
    completelySafe: "पूरी तरह सुरक्षित",
    useFree: "मुफ्त में इस्तेमाल करें",

    // Problem Section
    problemTitle: "क्यों परेशान होते रहें?",
    problemSubtitle: "नाभा के Civil Hospital में सिर्फ 11 डॉक्टर हैं 23 की जगह। आपको क्यों भुगतना पड़े?",
    lostWages: "दिन भर की मजदूरी गई",
    lostWagesDesc: "अस्पताल जाने के लिए पूरा दिन बर्बाद। कई बार डॉक्टर मिले ही नहीं।",
    longJourney: "लंबा सफर, खराब रास्ते",
    longJourneyDesc: "173 गांवों से आना पड़ता है। कच्चे रास्ते, महंगा किराया।",
    noGuarantee: "यकीन नहीं मिलता",
    noGuaranteeDesc: "जाकर पता चलता है कि दवाई नहीं मिली या टेस्ट नहीं हुआ।",
    noNeedSuffer: "आपको इस तकलीफ से गुजरने की जरूरत नहीं है।",

    // Solution Section
    solutionTitle: "GarudX के साथ सब कुछ आसान",
    solutionSubtitle: "घर बैठे पूरी स्वास्थ्य सेवा। समय बचाएं, पैसे बचाएं, स्वस्थ रहें।",

    // Features
    videoConsult: "वीडियो से बात करें",
    videoConsultDesc: "डॉक्टर से आमने-सामने बात करें। धीमे नेट में भी काम करता है।",
    videoConsultBenefit: "कम इंटरनेट में भी चलता है",
    offlineAccess: "बिना नेट के भी चले",
    offlineAccessDesc: "आपकी रिपोर्ट और दवाई की जानकारी हमेशा आपके फोन में रहती है।",
    offlineAccessBenefit: "ऑफलाइन में भी सब कुछ मिलता है",
    localLanguage: "अपनी भाषा में",
    localLanguageDesc: "पंजाबी, हिंदी, और अन्य भारतीय भाषाओं में इस्तेमाल करें।",
    localLanguageBenefit: "फोन करके भी इस्तेमाल करें",
    aiHealthCheck: "तुरंत जांच करें",
    aiHealthCheckDesc: "लक्षण बताएं, तुरंत पता चल जाएगा कि क्या करना है।",
    aiHealthCheckBenefit: "बिल्कुल निजी और सुरक्षित",
    pharmacyLocator: "दवाई कहां मिलेगी",
    pharmacyLocatorDesc: "घर से ही पता करें कि आपकी दवाई कहां उपलब्ध है।",
    pharmacyLocatorBenefit: "फालतू के चक्कर नहीं लगाने पड़ेंगे",
    emergency: "एमरजेंसी में मदद",
    emergencyDesc: "एक टैप में एम्बुलेंस बुलाएं। तुरंत पहुंचेगी।",
    emergencyBenefit: "24/7 तुरंत सेवा",

    // How It Works
    howItWorksTitle: "कैसे काम करता है?",
    howItWorksSubtitle: "बस 3 आसान स्टेप में शुरू करें",
    step1: "स्टेप 1",
    step1Title: "ऐप डाउनलोड करें",
    step1Desc: "फ्री में डाउनलोड करें। किसी भी एंड्राइड फोन में चलता है।",
    step2: "स्टेप 2",
    step2Title: "रजिस्टर करें",
    step2Desc: "बस नाम और फोन नंबर डालें। सारी जानकारी सुरक्षित रहती है।",
    step3: "स्टेप 3",
    step3Title: "डॉक्टर से मिलें",
    step3Desc: "तुरंत डॉक्टर से बात करें। पूरा इलाज घर बैठे।",

    // Benefits
    whyChooseTitle: "क्यों चुनें GarudX?",
    saveMoney: "₹500-1000 रोज बचाएं",
    saveMoneyDesc: "अस्पताल जाने का खर्च, मजदूरी का नुकसान - सब बचेगा।",
    saveTime: "4-6 घंटे बचाएं",
    saveTimeDesc: "सफर का समय, इंतजार का समय - सब बचेगा।",
    betterTreatment: "बेहतर इलाज पाएं",
    betterTreatmentDesc: "अच्छे डॉक्टर, सही समय पर सलाह, नियमित जांच।",
    monthlySavings: "हर महीने बचत",
    hospitalCost: "अस्पताल जाने का खर्च",
    lostIncome: "मजदूरी का नुकसान",
    appCost: "GarudX की लागत",
    totalSavings: "कुल बचत",

    // CTA
    ctaTitle: "आज ही शुरू करें अपना स्वास्थ्य सफर",
    ctaSubtitle: "लाखों परिवार पहले से इस्तेमाल कर रहे हैं। आप भी जुड़ें।",
    startNowFree: "अभी शुरू करें - बिल्कुल मुफ्त",
    noHiddenFees: "* कोई छुपी हुई फीस नहीं | * कोई मासिक चार्ज नहीं | * 24/7 सपोर्ट",

    // Footer
    mission: "हर गांव में बेहतर स्वास्थ्य सेवा पहुंचाना हमारा लक्ष्य है।",
    services: "सेवाएं",
    videoConsultation: "वीडियो कंसल्टेशन",
    aiHealthscreening: "AI स्वास्थ्य जांच",
    medicineSearch: "दवाई की खोज",
    emergencyService: "एमरजेंसी सेवा",
    support: "सपोर्ट",
    helpline247: "24/7 हेल्पलाइन",
    howToUse: "कैसे इस्तेमाल करें",
    techSupport: "तकनीकी सहायता",
    complaints: "शिकायत दर्ज करें",
    contact: "संपर्क",
    allRightsReserved: "सभी अधिकार सुरक्षित हैं।",
    madeForVillages: "गांव के लिए बनाया गया।"
  },

  pa: {
    // Header
    tagline: "ਪਿੰਡ ਵਿੱਚ ਡਾਕਟਰ",
    launchApp: "ਐਪ ਖੋਲ੍ਹੋ",

    // Hero Section
    heroTitle: "ਪਿੰਡ ਛੱਡੇ ਬਿਨਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ",
    heroSubtitle: "ਤੁਹਾਡੇ ਘਰ ਤੇ ਵਧੀਆ ਸਿਹਤ ਸੇਵਾ",
    heroDescription: "ਹੁਣ ਤੁਹਾਨੂੰ ਹਸਪਤਾਲ ਜਾਣ ਲਈ ਦਿਨ ਭਰ ਦੀ ਮਜਦੂਰੀ ਨਹੀਂ ਗੁਆਉਣੀ ਪਵੇਗੀ। GarudX ਨਾਲ ਘਰ ਬੈਠੇ ਪਾਓ ਵਧੀਆ ਇਲਾਜ।",
    startFree: "ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ",
    learnMore: "ਹੋਰ ਜਾਣੋ",
    available247: "24/7 ਉਪਲਬਧ",
    completelySafe: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਤ",
    useFree: "ਮੁਫਤ ਵਰਤੋ",

    // Problem Section
    problemTitle: "ਕਿਉਂ ਪਰੇਸ਼ਾਨ ਹੁੰਦੇ ਰਹੋ?",
    problemSubtitle: "ਨਾਭਾ ਦੇ ਸਿਵਲ ਹਸਪਤਾਲ ਵਿੱਚ 23 ਦੀ ਜਗ੍ਹਾ ਸਿਰਫ 11 ਡਾਕਟਰ ਹਨ। ਤੁਹਾਨੂੰ ਕਿਉਂ ਭੁਗਤਣਾ ਪਵੇ?",
    lostWages: "ਦਿਨ ਭਰ ਦੀ ਮਜਦੂਰੀ ਗਈ",
    lostWagesDesc: "ਹਸਪਤਾਲ ਜਾਣ ਲਈ ਪੂਰਾ ਦਿਨ ਬਰਬਾਦ। ਕਈ ਵਾਰ ਡਾਕਟਰ ਮਿਲੇ ਹੀ ਨਹੀਂ।",
    longJourney: "ਲੰਮਾ ਸਫਰ, ਖਰਾਬ ਰਾਹ",
    longJourneyDesc: "173 ਪਿੰਡਾਂ ਤੋਂ ਆਉਣਾ ਪੈਂਦਾ ਹੈ। ਕੱਚੇ ਰਾਹ, ਮਹਿੰਗਾ ਕਿਰਾਇਆ।",
    noGuarantee: "ਯਕੀਨ ਨਹੀਂ ਮਿਲਦਾ",
    noGuaranteeDesc: "ਜਾ ਕੇ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ਦਵਾਈ ਨਹੀਂ ਮਿਲੀ ਜਾਂ ਟੈਸਟ ਨਹੀਂ ਹੋਇਆ।",
    noNeedSuffer: "ਤੁਹਾਨੂੰ ਇਸ ਤਕਲੀਫ਼ ਵਿੱਚੋਂ ਗੁਜ਼ਰਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",

    // Solution Section
    solutionTitle: "GarudX ਨਾਲ ਸਭ ਕੁਝ ਆਸਾਨ",
    solutionSubtitle: "ਘਰ ਬੈਠੇ ਪੂਰੀ ਸਿਹਤ ਸੇਵਾ। ਸਮਾਂ ਬਚਾਓ, ਪੈਸੇ ਬਚਾਓ, ਸਿਹਤਮੰਦ ਰਹੋ।",

    // Features
    videoConsult: "ਵੀਡੀਓ ਰਾਹੀਂ ਗੱਲ ਕਰੋ",
    videoConsultDesc: "ਡਾਕਟਰ ਨਾਲ ਆਹਮੋ-ਸਾਹਮਣੇ ਗੱਲ ਕਰੋ। ਹੌਲੀ ਨੈੱਟ ਵਿੱਚ ਵੀ ਕੰਮ ਕਰਦਾ ਹੈ।",
    videoConsultBenefit: "ਘੱਟ ਇੰਟਰਨੈੱਟ ਵਿੱਚ ਵੀ ਚੱਲਦਾ ਹੈ",
    offlineAccess: "ਬਿਨਾ ਨੈੱਟ ਵੀ ਚੱਲੇ",
    offlineAccessDesc: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਅਤੇ ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ ਹਮੇਸ਼ਾ ਤੁਹਾਡੇ ਫੋਨ ਵਿੱਚ ਰਹਿੰਦੀ ਹੈ।",
    offlineAccessBenefit: "ਔਫਲਾਈਨ ਵਿੱਚ ਵੀ ਸਭ ਕੁਝ ਮਿਲਦਾ ਹੈ",
    localLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ",
    localLanguageDesc: "ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਅਤੇ ਹੋਰ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਵਰਤੋ।",
    localLanguageBenefit: "ਫੋਨ ਕਰ ਕੇ ਵੀ ਵਰਤ ਸਕਦੇ ਹੋ",
    aiHealthCheck: "ਤੁਰੰਤ ਜਾਂਚ ਕਰੋ",
    aiHealthCheckDesc: "ਲੱਛਣ ਦੱਸੋ, ਤੁਰੰਤ ਪਤਾ ਲੱਗ ਜਾਵੇਗਾ ਕਿ ਕੀ ਕਰਨਾ ਹੈ।",
    aiHealthCheckBenefit: "ਬਿਲਕੁਲ ਨਿੱਜੀ ਅਤੇ ਸੁਰੱਖਿਤ",
    pharmacyLocator: "ਦਵਾਈ ਕਿੱਥੇ ਮਿਲੇਗੀ",
    pharmacyLocatorDesc: "ਘਰ ਤੋਂ ਹੀ ਪਤਾ ਕਰੋ ਕਿ ਤੁਹਾਡੀ ਦਵਾਈ ਕਿੱਥੇ ਉਪਲਬਧ ਹੈ।",
    pharmacyLocatorBenefit: "ਫਾਲਤੂ ਦੇ ਚੱਕਰ ਨਹੀਂ ਲਗਾਉਣੇ ਪੈਣਗੇ",
    emergency: "ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਮਦਦ",
    emergencyDesc: "ਇੱਕ ਟੈਪ ਵਿੱਚ ਐਂਬੁਲੈਂਸ ਬੁਲਾਓ। ਤੁਰੰਤ ਪਹੁੰਚੇਗੀ।",
    emergencyBenefit: "24/7 ਤੁਰੰਤ ਸੇਵਾ",

    // How It Works
    howItWorksTitle: "ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?",
    howItWorksSubtitle: "ਸਿਰਫ 3 ਆਸਾਨ ਸਟੈਪਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ",
    step1: "ਸਟੈਪ 1",
    step1Title: "ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ",
    step1Desc: "ਮੁਫਤ ਵਿੱਚ ਡਾਊਨਲੋਡ ਕਰੋ। ਕਿਸੇ ਵੀ ਐਂਡਰਾਇਡ ਫੋਨ ਵਿੱਚ ਚੱਲਦਾ ਹੈ।",
    step2: "ਸਟੈਪ 2",
    step2Title: "ਰਜਿਸਟਰ ਕਰੋ",
    step2Desc: "ਸਿਰਫ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਪਾਓ। ਸਾਰੀ ਜਾਣਕਾਰੀ ਸੁਰੱਖਿਤ ਰਹਿੰਦੀ ਹੈ।",
    step3: "ਸਟੈਪ 3",
    step3Title: "ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ",
    step3Desc: "ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ। ਪੂਰਾ ਇਲਾਜ ਘਰ ਬੈਠੇ।",

    // Benefits
    whyChooseTitle: "ਕਿਉਂ ਚੁਣੋ GarudX?",
    saveMoney: "₹500-1000 ਰੋਜ਼ ਬਚਾਓ",
    saveMoneyDesc: "ਹਸਪਤਾਲ ਜਾਣ ਦਾ ਖਰਚਾ, ਮਜਦੂਰੀ ਦਾ ਨੁਕਸਾਨ - ਸਭ ਬਚੇਗਾ।",
    saveTime: "4-6 ਘੰਟੇ ਬਚਾਓ",
    saveTimeDesc: "ਸਫਰ ਦਾ ਸਮਾਂ, ਇੰਤਜ਼ਾਰ ਦਾ ਸਮਾਂ - ਸਭ ਬਚੇਗਾ।",
    betterTreatment: "ਬਿਹਤਰ ਇਲਾਜ ਪਾਓ",
    betterTreatmentDesc: "ਚੰਗੇ ਡਾਕਟਰ, ਸਹੀ ਵਕਤ ਤੇ ਸਲਾਹ, ਨਿਯਮਤ ਜਾਂਚ।",
    monthlySavings: "ਹਰ ਮਹੀਨੇ ਬਚਤ",
    hospitalCost: "ਹਸਪਤਾਲ ਜਾਣ ਦਾ ਖਰਚਾ",
    lostIncome: "ਮਜਦੂਰੀ ਦਾ ਨੁਕਸਾਨ",
    appCost: "GarudX ਦੀ ਲਾਗਤ",
    totalSavings: "ਕੁੱਲ ਬਚਤ",

    // CTA
    ctaTitle: "ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ ਆਪਣਾ ਸਿਹਤ ਸਫਰ",
    ctaSubtitle: "ਲੱਖਾਂ ਪਰਿਵਾਰ ਪਹਿਲਾਂ ਤੋਂ ਇਸਤੇਮਾਲ ਕਰ ਰਹੇ ਹਨ। ਤੁਸੀਂ ਵੀ ਜੁੜੋ।",
    startNowFree: "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ - ਬਿਲਕੁਲ ਮੁਫਤ",
    noHiddenFees: "* ਕੋਈ ਛੁਪੀ ਫੀਸ ਨਹੀਂ | * ਕੋਈ ਮਾਸਿਕ ਚਾਰਜ ਨਹੀਂ | * 24/7 ਸਹਾਇਤਾ",

    // Footer
    mission: "ਹਰ ਪਿੰਡ ਵਿੱਚ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚਾਉਣਾ ਸਾਡਾ ਟੀਚਾ ਹੈ।",
    services: "ਸੇਵਾਵਾਂ",
    videoConsultation: "ਵੀਡੀਓ ਕੰਸਲਟੇਸ਼ਨ",
    aiHealthscreening: "AI ਸਿਹਤ ਜਾਂਚ",
    medicineSearch: "ਦਵਾਈ ਦੀ ਖੋਜ",
    emergencyService: "ਐਮਰਜੈਂਸੀ ਸੇਵਾ",
    support: "ਸਹਾਇਤਾ",
    helpline247: "24/7 ਹੈਲਪਲਾਈਨ",
    howToUse: "ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ",
    techSupport: "ਤਕਨੀਕੀ ਸਹਾਇਤਾ",
    complaints: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    contact: "ਸੰਪਰਕ",
    allRightsReserved: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    madeForVillages: "ਪਿੰਡਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ।"
  }
};

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>('hi');
  
  const t = translations[currentLanguage];
  
  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };
  
  return { t, currentLanguage, changeLanguage };
};
