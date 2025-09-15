import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GarudXLogo from '../components/GarudXLogo';

// Comprehensive translation system
const translations = {
  en: {
    tagline: "Rural Healthcare Reimagined",
    launchApp: "Access Portal",
    heroTitle: "Expert Medical Care Without Leaving Your Village",
    heroSubtitle: "Bridging the healthcare gap in rural India",
    heroDescription: "Connect with qualified doctors through secure video consultations from the comfort of your home",
    startConsultation: "Start Consultation",
    learnMore: "Learn More",
    watchDemo: "View Demonstration",
    trustedBy: "Trusted by healthcare professionals",
    
    // Navigation
    navHome: "Home",
    navAbout: "About",
    navServices: "Services", 
    navContact: "Contact",
    
    // Problem section
    problemTitle: "Healthcare Challenges in Rural Areas",
    problemDescription: "Rural communities face significant barriers in accessing quality healthcare services",
    problemStats: [
      { number: "₹2,000", label: "Average cost per hospital visit including travel" },
      { number: "65km", label: "Average distance to nearest quality healthcare facility" },
      { number: "8 hours", label: "Time lost in travel and waiting for treatment" }
    ],

    // Solution section
    solutionTitle: "Comprehensive Digital Healthcare Solution",
    solutionSubtitle: "Advanced telemedicine platform designed specifically for rural healthcare delivery",
    
    features: [
      {
        title: "Video Consultations",
        description: "High-quality video calls with licensed medical professionals using advanced compression technology",
        benefit: "Works with low bandwidth connections",
        icon: "medical-consultation"
      },
      {
        title: "Digital Health Records",
        description: "Secure, encrypted storage of medical history and treatment records accessible anytime",
        benefit: "HIPAA compliant data protection",
        icon: "health-records"
      },
      {
        title: "Prescription Management",
        description: "Digital prescriptions accepted by pharmacies with integrated medication tracking",
        benefit: "Reduces medication errors by 85%",
        icon: "prescription"
      },
      {
        title: "Multi-language Support",
        description: "Platform available in Hindi, Punjabi, and regional languages with voice support",
        benefit: "Cultural and linguistic accessibility",
        icon: "language"
      },
      {
        title: "Emergency Response",
        description: "24/7 emergency consultation with immediate response protocols",
        benefit: "Average response time under 3 minutes",
        icon: "emergency"
      },
      {
        title: "Family Care Management",
        description: "Comprehensive health tracking for entire family with shared medical insights",
        benefit: "Preventive care recommendations",
        icon: "family-care"
      }
    ],

    // How it works
    howItWorksTitle: "How Our Platform Works",
    steps: [
      {
        step: "01",
        title: "Schedule Consultation",
        description: "Choose your preferred doctor and time slot through our intuitive booking system"
      },
      {
        step: "02", 
        title: "Secure Video Session",
        description: "Connect via encrypted video call with your chosen healthcare professional"
      },
      {
        step: "03",
        title: "Treatment & Follow-up",
        description: "Receive digital prescription and comprehensive treatment plan with scheduled follow-ups"
      }
    ],

    // Statistics
    statsTitle: "Healthcare Impact Statistics",
    stats: [
      { number: "50,000+", label: "Patients Served", trend: "+25% monthly growth" },
      { number: "2,500+", label: "Verified Doctors", trend: "Across 12 specialties" },
      { number: "95%", label: "Patient Satisfaction", trend: "Based on 10k+ reviews" },
      { number: "₹8,500", label: "Average Monthly Savings", trend: "Per family" }
    ],

    // CTA section
    ctaTitle: "Transform Your Healthcare Experience",
    ctaSubtitle: "Join thousands of families who have revolutionized their access to quality healthcare",
    startNowFree: "Begin Your Healthcare Journey",
    consultationFree: "First consultation complimentary for new patients",
    trustIndicators: "Certified by Medical Council of India • ISO 27001 Compliant • 256-bit Encryption",

    // Footer
    footerTagline: "Advancing rural healthcare through technology",
    allRightsReserved: "All rights reserved.",
    madeForCommunities: "Built for rural communities, by healthcare innovators.",
    
    // Additional sections
    securityTitle: "Enterprise-Grade Security & Compliance",
    securityFeatures: [
      "End-to-end encryption for all communications",
      "HIPAA compliant data handling and storage",
      "Regular security audits by third-party experts",
      "24/7 monitoring and threat detection"
    ]
  },
  hi: {
    tagline: "गांव में डॉक्टर",
    launchApp: "शुरू करें",
    heroTitle: "गांव छोड़े बिना डॉक्टर से मिलें",
    heroSubtitle: "घर बैठे इलाज पाएं",
    heroDescription: "वीडियो कॉल से योग्य डॉक्टरों से बात करें",
    startConsultation: "सलाह लें",
    learnMore: "और जानें",
    watchDemo: "डेमो देखें",
    trustedBy: "डॉक्टरों का भरोसा",

    navHome: "होम",
    navAbout: "हमारे बारे में",
    navServices: "सेवाएं",
    navContact: "संपर्क",

    problemTitle: "ग्रामीण क्षेत्रों में स्वास्थ्य सेवा की चुनौतियां",
    problemDescription: "ग्रामीण समुदायों को गुणवत्तापूर्ण स्वास्थ्य सेवाओं तक पहुंच में महत्वपूर्ण बाधाओं का सामना करना पड़ता है",
    problemStats: [
      { number: "₹2,000", label: "यात्रा सहित प्रति अस्पताल यात्रा की औसत लागत" },
      { number: "65 किमी", label: "निकटतम गुणवत्तापूर्ण स्वास्थ्य सुविधा की औसत दूरी" },
      { number: "8 घंटे", label: "यात्रा और उपचार की प्रतीक्षा में खोया गया समय" }
    ],

    solutionTitle: "व्यापक डिजिटल स्वास्थ्य सेवा समाधान",
    solutionSubtitle: "विशेष रूप से ग्रामीण स्वास्थ्य सेवा वितरण के लिए डिज़ाइन किया गया उन्नत टेलीमेडिसिन प्लेटफॉर्म",

    features: [
      {
        title: "वीडियो परामर्श",
        description: "उन्नत संपीड़न तकनीक का उपयोग करके लाइसेंसधारी चिकित्सा पेशेवरों के साथ उच्च गुणवत्ता वाली वीडियो कॉल",
        benefit: "कम बैंडविड्थ कनेक्शन के साथ काम करता है",
        icon: "medical-consultation"
      },
      {
        title: "डिजिटल स्वास्थ्य रिकॉर्ड",
        description: "चिकित्सा इतिहास और उपचार रिकॉर्ड का सुरक्षित, एन्क्रिप्टेड भंडारण कभी भी सुलभ",
        benefit: "HIPAA अनुपालित डेटा सुरक्षा",
        icon: "health-records"
      },
      {
        title: "प्रिस्क्रिप्शन प्रबंधन",
        description: "एकीकृत दवा ट्रैकिंग के साथ फार्मेसियों द्वारा स्वीकृत डिजिटल प्रिस्क्रिप्शन",
        benefit: "दवा त्रुटियों को 85% तक कम करता है",
        icon: "prescription"
      },
      {
        title: "बहु-भाषा समर्थन",
        description: "हिंदी, पंजाबी और क्षेत्रीय भाषाओं में उपलब्ध प्लेटफॉर्म वॉइस समर्थन के साथ",
        benefit: "सांस्कृतिक और भाषाई पहुंच",
        icon: "language"
      },
      {
        title: "आपातकालीन प्रतिक्रिया",
        description: "तत्काल प्रतिक्रिया प्रोटोकॉल के साथ 24/7 आपातकालीन परामर्श",
        benefit: "3 मिनट के भीतर औसत प्रतिक्रिया समय",
        icon: "emergency"
      },
      {
        title: "पारिवारिक देखभाल प्रबंधन",
        description: "साझा चिकित्सा अंतर्दृष्टि के साथ पूरे परिवार के लिए व्यापक स्वास्थ्य ट्रैकिंग",
        benefit: "निवारक देखभाल की सिफारिशें",
        icon: "family-care"
      }
    ],

    howItWorksTitle: "हमारा प्लेटफॉर्म कैसे काम करता है",
    steps: [
      {
        step: "01",
        title: "परामर्श निर्धारित करें",
        description: "हमारे सहज बुकिंग सिस्टम के माध्यम से अपना पसंदीदा डॉक्टर और समय स्लॉट चुनें"
      },
      {
        step: "02",
        title: "सुरक्षित वीडियो सत्र",
        description: "अपने चुने गए स्वास्थ्य पेशेवर के साथ एन्क्रिप्टेड वीडियो कॉल के माध्यम से जुड़ें"
      },
      {
        step: "03",
        title: "उपचार और फॉलो-अप",
        description: "निर्धारित फॉलो-अप के साथ डिजिटल प्रिस्क्रिप्शन और व्यापक उपचार योजना प्राप्त करें"
      }
    ],

    statsTitle: "स्वास्थ्य सेवा प्रभाव सांख्यिकी",
    stats: [
      { number: "50,000+", label: "सेवा किए गए मरीज़", trend: "+25% मासिक वृद्धि" },
      { number: "2,500+", label: "सत्यापित डॉक्टर", trend: "12 विशेषज्ञताओं में" },
      { number: "95%", label: "मरीज़ संतुष्टि", trend: "10k+ समीक्षाओं के आधार पर" },
      { number: "₹8,500", label: "औसत मासिक बचत", trend: "प्रति परिवार" }
    ],

    ctaTitle: "अपने स्वास्थ्य सेवा अनुभव को बदलें",
    ctaSubtitle: "हज़ारों परिवारों में शामिल हों जिन्होंने गुणवत्तापूर्ण स्वास्थ्य सेवा तक अपनी पहुंच में क्रांति ला दी है",
    startNowFree: "अपनी स्वास्थ्य सेवा यात्रा शुरू करें",
    consultationFree: "नए मरीज़ों के लिए पहला परामर्श निःशुल्क",
    trustIndicators: "भारतीय चिकित्सा परिषद द्वारा प्रमाणित • ISO 27001 अनुपालित • 256-बिट एन्क्रिप्शन",

    footerTagline: "तकनीक के माध्यम से ग्रामीण स्वास्थ्य सेवा को आगे बढ़ाना",
    allRightsReserved: "सभी अधिकार सुरक्षित हैं।",
    madeForCommunities: "ग्रामीण समुदायों के लिए, स्वास्थ्य नवाचारकर्ताओं द्वारा निर्मित।",

    securityTitle: "एंटरप्राइज़-ग्रेड सुरक्षा और अनुपालन",
    securityFeatures: [
      "सभी संचार के लिए एंड-टू-एंड एन्क्रिप्शन",
      "HIPAA अनुपालित डेटा हैंडलिंग और स्टोरेज",
      "तृतीय-पक्ष विशेषज्ञों द्वारा नियमित सुरक्षा ऑडिट",
      "24/7 मॉनिटरिंग और खतरा पहचान"
    ]
  },
  pa: {
    tagline: "ਪਿੰਡ ਵਿੱਚ ਡਾਕਟਰ",
    launchApp: "ਸ਼ੁਰੂ ਕਰੋ",
    heroTitle: "ਪਿੰਡ ਛੱਡੇ ਬਿਨਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ",
    heroSubtitle: "ਘਰ ਬੈਠੇ ਇਲਾਜ ਪਾਓ",
    heroDescription: "ਵੀਡੀਓ ਕਾਲ ਨਾਲ ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਗੱਲ ਕਰੋ",
    startConsultation: "ਸਲਾਹ ਲਓ",
    learnMore: "ਹੋਰ ਜਾਣੋ",
    watchDemo: "ਡੈਮੋ ਦੇਖੋ",
    trustedBy: "ਡਾਕਟਰਾਂ ਦਾ ਭਰੋਸਾ",
    
    navHome: "ਘਰ",
    navAbout: "ਸਾਡੇ ਬਾਰੇ",
    navServices: "ਸੇਵਾਵਾਂ",
    navContact: "ਸੰਪਰਕ",

    problemTitle: "ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਦੀਆਂ ਚੁਣੌਤੀਆਂ",
    problemDescription: "ਪੇਂਡੂ ਸਮੁਦਾਇਆਂ ਨੂੰ ਚੰਗੀ ਸਿਹਤ ਸੇਵਾ ਵਿੱਚ ਮੁਸ਼ਕਲਾਂ",
    problemStats: [
      { number: "₹2,000", label: "ਯਾਤਰਾ ਸਣੇ ਹਸਪਤਾਲ ਦੀ ਲਾਗਤ" },
      { number: "65 ਕਿਮੀ", label: "ਨੇੜਲੇ ਚੰਗੇ ਹਸਪਤਾਲ ਦੀ ਦੂਰੀ" },
      { number: "8 ਘੰਟੇ", label: "ਯਾਤਰਾ ਅਤੇ ਉਡੀਕ ਵਿੱਚ ਗੁਆਇਆ ਸਮਾਂ" }
    ],

    solutionTitle: "ਸੰਪੂਰਨ ਡਿਜੀਟਲ ਸਿਹਤ ਸੇਵਾ ਹੱਲ",
    solutionSubtitle: "ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਲਈ ਉੱਨਤ ਟੈਲੀਮੈਡਸਨ ਪਲੇਟਫਾਰਮ",
    
    features: [
      {
        title: "ਵੀਡੀਓ ਸਲਾਹ",
        description: "ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਡਾਕਟਰਾਂ ਨਾਲ ਉੱਚ ਗੁਣਵਤਾ ਵਾਲੀ ਵੀਡੀਓ ਕਾਲ",
        benefit: "ਹੌਲੀ ਇੰਟਰਨੈੱਟ ਨਾਲ ਵੀ ਚੱਲਦਾ ਹੈ",
        icon: "medical-consultation"
      },
      {
        title: "ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ",
        description: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਅਤੇ ਇਲਾਜ ਦਾ ਸੁਰੱਖਿਤ, ਇਨਕ੍ਰਿਪਟਡ ਸਟੋਰੇਜ",
        benefit: "HIPAA ਅਨੁਕੂਲ ਡਾਟਾ ਸੁਰੱਖਿਆ",
        icon: "health-records"
      },
      {
        title: "ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਪ੍ਰਬੰਧਨ",
        description: "ਫਾਰਮੇਸੀਆਂ ਦੁਆਰਾ ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਡਿਜੀਟਲ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ",
        benefit: "ਦਵਾਈ ਦੀਆਂ ਗਲਤੀਆਂ 85% ਤੱਕ ਘਟਾਉਂਦਾ ਹੈ",
        icon: "prescription"
      },
      {
        title: "ਬਹੁ-ਭਾਸ਼ਾ ਸਹਿਯੋਗ",
        description: "ਹਿੰਦੀ, ਪੰਜਾਬੀ ਅਤੇ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ",
        benefit: "ਸੱਭਿਆਚਾਰਕ ਅਤੇ ਭਾਸ਼ਾਈ ਪਹੁੰਚ",
        icon: "language"
      },
      {
        title: "ਐਮਰਜੈਂਸੀ ਜਵਾਬ",
        description: "ਤੁਰੰਤ ਜਵਾਬੀ ਪ੍ਰੋਟੋਕਾਲ ਨਾਲ 24/7 ਐਮਰਜੈਂਸੀ ਸਲਾਹ",
        benefit: "3 ਮਿੰਟ ਵਿੱਚ ਔਸਤ ਜਵਾਬ ਸਮਾਂ",
        icon: "emergency"
      },
      {
        title: "ਪਰਿਵਾਰਿਕ ਦੇਖਭਾਲ ਪ੍ਰਬੰਧਨ",
        description: "ਸਾਝੇ ਮੈਡੀਕਲ ਸਮਝ ਨਾਲ ਪੂਰੇ ਪਰਿਵਾਰ ਲਈ ਸਿਹਤ ਟਰੈਕਿੰਗ",
        benefit: "ਰੋਕਥਾਮ ਦੇਖਭਾਲ ਦੀਆਂ ਸਿਫਾਰਿਸ਼ਾਂ",
        icon: "family-care"
      }
    ],

    howItWorksTitle: "ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    steps: [
      {
        step: "01",
        title: "ਸਲਾਹ ਸ਼ੈਡਿਊਲ ਕਰੋ",
        description: "ਸਾਡੇ ਸਹਿਜ ਬੁਕਿੰਗ ਸਿਸਟਮ ਰਾਹੀਂ ਆਪਣਾ ਪਸੰਦੀਦਾ ਡਾਕਟਰ ਚੁਣੋ"
      },
      {
        step: "02",
        title: "ਸੁਰੱਖਿਤ ਵੀਡੀਓ ਸੈਸ਼ਨ",
        description: "ਆਪਣੇ ਚੁਣੇ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਇਨਕ੍ਰਿਪਟਡ ਵੀਡੀਓ ਕਾਲ ਰਾਹੀਂ ਜੁੜੋ"
      },
      {
        step: "03",
        title: "ਇਲਾਜ ਅਤੇ ਫਾਲੋ-ਅੱਪ",
        description: "ਨਿਰਧਾਰਿਤ ਫਾਲੋ-ਅੱਪ ਨਾਲ ਡਿਜੀਟਲ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਪਾਓ"
      }
    ],

    statsTitle: "ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਭਾਵ ਅੰਕੜੇ",
    stats: [
      { number: "50,000+", label: "ਸੇਵਾ ਕੀਤੇ ਮਰੀਜ਼", trend: "+25% ਮਾਸਿਕ ਵਾਧਾ" },
      { number: "2,500+", label: "ਪ੍ਰਮਾਣਿਤ ਡਾਕਟਰ", trend: "12 ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਵਿੱਚ" },
      { number: "95%", label: "ਮਰੀਜ਼ ਸੰਤੁਸ਼ਟੀ", trend: "10k+ ਸਮੀਖਿਆਵਾਂ ਦੇ ਆਧਾਰ 'ਤੇ" },
      { number: "₹8,500", label: "ਔਸਤ ਮਾਸਿਕ ਬੱਚਤ", trend: "ਪ੍ਰਤੀ ਪਰਿਵਾਰ" }
    ],

    ctaTitle: "ਆਪਣਾ ਸਿਹਤ ਸੇਵਾ ਤਜ਼ਰਬਾ ਬਦਲੋ",
    ctaSubtitle: "ਹਜ਼ਾਰਾਂ ਪਰਿਵਾਰਾਂ ਨਾਲ ਜੁੜੋ ਜਿਨ੍ਹਾਂ ਨੇ ਗੁਣਵੱਤਾ ਸਿਹਤ ਸੇਵਾ ਤੱਕ ਪਹੁੰਚ ਵਿੱਚ ਕ੍ਰਾਂਤੀ ਲਿਆਂਦੀ",
    startNowFree: "ਆਪਣੀ ਸਿਹਤ ਸੇਵਾ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ",
    consultationFree: "ਨਵੇਂ ਮਰੀਜ਼ਾਂ ਲਈ ਪਹਿਲੀ ਸਲਾਹ ਮੁਫ਼ਤ",
    trustIndicators: "ਭਾਰਤੀ ਮੈਡੀਕਲ ਕੌਂਸਿਲ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ • ISO 27001 ਅਨੁਕੂਲ • 256-ਬਿਟ ਇਨਕ੍ਰਿਪਸ਼ਨ",

    footerTagline: "ਤਕਨੀਕ ਰਾਹੀਂ ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣਾ",
    allRightsReserved: "ਸਾਰੇ ਹੱਕ ਮਹਿਫੂਜ਼ ਹਨ।",
    madeForCommunities: "ਪੇਂਡੂ ਕਮਿਊਨਿਟੀਆਂ ਲਈ, ਸਿਹਤ ਨਵੀਨਤਾਕਾਰਾਂ ਦੁਆਰਾ ਬਣਾਇਆ।",

    securityTitle: "ਐਂਟਰਪ੍ਰਾਈਜ਼-ਗ੍ਰੇਡ ਸੁਰੱਖਿਆ ਅਤੇ ਅਨੁਪਾਲਨਾ",
    securityFeatures: [
      "ਸਾਰੇ ਸੰਚਾਰ ਲਈ ਐਂਡ-ਟੂ-ਐਂਡ ਇਨਕ੍ਰਿਪਸ਼ਨ",
      "HIPAA ਅਨੁਕੂਲ ਡਾਟਾ ਹੈਂਡਲਿੰਗ ਅਤੇ ਸਟੋਰੇਜ",
      "ਤੀਜੀ-ਪਾਰਟੀ ਮਾਹਿਰਾਂ ਦੁਆਰਾ ਨਿਯਮਿਤ ਸੁਰੱਖਿਆ ਆਡਿਟ",
      "24/7 ਮਾਨੀਟਰਿੰਗ ਅਤੇ ਖਤਰਾ ਖੋਜ"
    ]
  }
};

type Language = 'en' | 'hi' | 'pa';

// Typing animation hook
const useTypingAnimation = (texts: string[], speed = 80, pause = 2500) => {
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
    }, isDeleting ? speed / 3 : speed);

    return () => clearTimeout(timer);
  }, [displayText, currentIndex, isDeleting, texts, speed, pause]);

  return displayText;
};

// Professional icon component
const MedicalIcon: React.FC<{ type: string; size?: string; className?: string }> = ({ 
  type, 
  size = "w-8 h-8", 
  className = "" 
}) => {
  const icons = {
    'medical-consultation': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9ZM7 5H9V7H7V5ZM7 9H17V11H7V9ZM7 13H17V15H7V13ZM7 17H14V19H7V17Z"/>
      </svg>
    ),
    'health-records': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H17V16H7V14Z"/>
      </svg>
    ),
    'prescription': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.5 20Q4.22 20 2.61 18.43Q1 16.85 1 14.58Q1 12.63 2.17 11.1Q3.35 9.57 5.25 9.15Q5.88 6.85 7.75 5.43Q9.63 4 12 4Q14.93 4 16.96 6.04Q19 8.07 19 11Q20.73 11.2 21.86 12.5Q23 13.78 23 15.5Q23 17.38 21.69 18.69Q20.38 20 18.5 20H6.5ZM14.8 11.2L16.2 12.6L12.6 16.2L11.2 14.8L14.8 11.2ZM9.4 16.2L12.6 13L14 14.4L10.8 17.6L9.4 16.2Z"/>
      </svg>
    ),
    'language': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"/>
      </svg>
    ),
    'emergency': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM8 19.5L9.5 15.5L13.5 17L12 21L8 19.5ZM19 12L16.5 16L20.5 17.5L19 12Z"/>
      </svg>
    ),
    'family-care': (
      <svg className={`${size} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 14C17.2 14 18.2 13.2 18.7 12.1C19.58 12.3 20.29 12.86 20.71 13.62C21.1 14.32 21.1 15.17 20.71 15.88C20.32 16.59 19.65 17 18.95 17H16.5C16.22 17 16 16.78 16 16.5S16.22 16 16.5 16H18.95C19.34 16 19.69 15.83 19.92 15.54C20.15 15.25 20.24 14.86 20.15 14.5C20.06 14.14 19.8 13.85 19.46 13.71C19.12 13.57 18.74 13.6 18.42 13.79L17.82 14.1L17.53 13.5C17.24 12.9 16.66 12.5 16 12.5S14.76 12.9 14.47 13.5L14.18 14.1L13.58 13.79C13.26 13.6 12.88 13.57 12.54 13.71C12.2 13.85 11.94 14.14 11.85 14.5C11.76 14.86 11.85 15.25 12.08 15.54C12.31 15.83 12.66 16 13.05 16H15.5C15.78 16 16 16.22 16 16.5S15.78 17 15.5 17H13.05C12.35 17 11.68 16.59 11.29 15.88C10.9 15.17 10.9 14.32 11.29 13.62C11.71 12.86 12.42 12.3 13.3 12.1C13.8 13.2 14.8 14 16 14ZM12 10C12.75 10 13.4 9.55 13.72 8.87C14.04 8.19 13.97 7.4 13.54 6.79C13.11 6.18 12.39 5.85 11.67 5.94C10.95 6.03 10.35 6.51 10.13 7.19C9.91 7.87 10.1 8.61 10.63 9.14C11.16 9.67 11.9 9.86 12.58 9.64C12.73 9.88 12.86 10 12 10ZM16.5 9C17.33 9 18 8.33 18 7.5S17.33 6 16.5 6 15 6.67 15 7.5 15.67 9 16.5 9ZM7.5 9C8.33 9 9 8.33 9 7.5S8.33 6 7.5 6 6 6.67 6 7.5 6.67 9 7.5 9ZM12 14C13.1 14 14 13.1 14 12S13.1 10 12 10 10 10.9 10 12 10.9 14 12 14Z"/>
      </svg>
    )
  };

  return icons[type as keyof typeof icons] || icons['medical-consultation'];
};

const LandingPageProfessional: React.FC = () => {
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

  const typingText = useTypingAnimation(heroTexts, 60, 2000);

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
      {/* Professional CSS with Enhanced Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px) rotate(-5deg); }
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px) rotate(5deg); }
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-10px) rotate(0.5deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(5, 150, 105, 0.3); }
          50% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.6), 0 0 30px rgba(5, 150, 105, 0.4); }
          100% { box-shadow: 0 0 5px rgba(5, 150, 105, 0.3); }
        }
        
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-15deg); }
          20% { transform: rotateZ(10deg); }
          25% { transform: rotateZ(-10deg); }
          30% { transform: rotateZ(6deg); }
          35% { transform: rotateZ(-4deg); }
          40%, 100% { transform: rotateZ(0); }
        }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.3) rotate(10deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotateIn {
          from { opacity: 0; transform: rotate(-180deg) scale(0.5); }
          to { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-rotateIn {
          animation: rotateIn 0.8s ease-out;
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s infinite;
          color: #059669;
          font-weight: bold;
          margin-left: 3px;
          font-size: 1.1em;
        }
        
        .gradient-medical {
          background: linear-gradient(135deg, #059669 0%, #0369a1 100%);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        .text-gradient-medical {
          background: linear-gradient(135deg, #059669 0%, #0369a1 100%, #8b5cf6 200%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }
        
        .glass-subtle {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .section-spacing {
          padding: 6rem 0;
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .medical-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }
        
        .medical-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }
        
        .medical-card:hover::before {
          left: 100%;
        }
        
        .medical-card:hover {
          border-color: #059669;
          box-shadow: 0 15px 35px rgba(5, 150, 105, 0.2);
          transform: translateY(-5px) rotate(1deg);
        }
        
        .card-active {
          border-color: #059669 !important;
          box-shadow: 0 15px 35px rgba(5, 150, 105, 0.25) !important;
          transform: translateY(-3px) !important;
        }
        
        .floating-stats {
          animation: float 4s ease-in-out infinite;
        }
        
        .stat-number {
          transition: all 0.3s ease;
        }
        
        .stat-number:hover {
          transform: scale(1.1);
          color: #059669;
        }
        
        .icon-rotate:hover {
          animation: wiggle 0.8s ease-in-out;
        }
        
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .ripple-effect:active::after {
          width: 300px;
          height: 300px;
        }
      `}</style>

      {/* Professional Header */}
      <header className="glass-subtle fixed top-0 w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <GarudXLogo 
                size="lg" 
                variant="primary" 
                animated={false} 
                showText={false}
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gradient-medical">
                  GarudX
                </h1>
                <p className="text-xs text-gray-600 font-medium">{t.tagline}</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                {t.navHome}
              </a>
              <a href="#services" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                {t.navServices}
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                {t.navAbout}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                {t.navContact}
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-emerald-500 transition-all duration-300 bg-white/70"
                >
                  <span className="text-sm">{currentLang.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{currentLang.name}</span>
                  <span className={`transition-transform duration-300 text-gray-500 ${isLangOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[160px] animate-fadeInUp">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-emerald-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          currentLanguage === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/login"
                className="gradient-medical text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm"
              >
                {t.launchApp}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="section-spacing bg-gradient-to-br from-emerald-50 to-sky-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              {/* Location Badge */}
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-emerald-100 animate-bounce">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-emerald-800 text-sm font-medium">
                  {currentLanguage === 'en' ? 'Serving Nabha & 173 surrounding villages' :
                   currentLanguage === 'pa' ? 'ਨਾਭਾ ਅਤੇ 173 ਆਸ ਪਾਸ ਦੇ ਪਿੰਡਾਂ ਦੀ ਸੇਵਾ' :
                   'Nabha और 173 आसपास के गांवों की सेवा करना'}
                </span>
              </div>
              
              {/* Typing Animation */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="typing-cursor text-gradient-medical">
                    {typingText}
                  </span>
                </h1>
              </div>
              
              {/* Trust Indicator */}
              <p className="text-lg text-gray-600 flex items-center">
                <div className="flex -space-x-1 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center animate-float icon-rotate" style={{ animationDelay: `${i * 0.2}s` }}>
                      <MedicalIcon type="medical-consultation" size="w-4 h-4" className="text-emerald-600" />
                    </div>
                  ))}
                </div>
                {t.trustedBy}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="gradient-medical text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center group ripple-effect animate-glow"
                >
                  <MedicalIcon type="medical-consultation" size="w-5 h-5" className="mr-3 icon-rotate" />
                  {t.startConsultation}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all duration-300 font-semibold text-lg hover-lift">
                  {t.watchDemo}
                </button>
              </div>

              {/* Security Badges */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <MedicalIcon type="health-records" size="w-4 h-4" className="mr-2" />
                  <span>HIPAA Secure</span>
                </div>
                <div className="flex items-center">
                  <MedicalIcon type="prescription" size="w-4 h-4" className="mr-2" />
                  <span>MCI Certified</span>
                </div>
                <div className="flex items-center">
                  <MedicalIcon type="emergency" size="w-4 h-4" className="mr-2" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className={`relative ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto gradient-medical rounded-2xl flex items-center justify-center">
                      <GarudXLogo 
                        size="lg" 
                        variant="white" 
                        animated={false} 
                        showText={false}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {currentLanguage === 'en' ? 'Doctor Available Now' :
                         currentLanguage === 'pa' ? 'ਡਾਕਟਰ ਹੁਣ ਉਪਲਬਧ ਹੈ' :
                         'डॉक्टर अभी उपलब्ध है'}
                      </h3>
                      <p className="text-gray-600">
                        {currentLanguage === 'en' ? 'Connect for immediate consultation' :
                         currentLanguage === 'pa' ? 'ਤੁਰੰਤ ਸਲਾਹ ਲਈ ਜੁੜੋ' :
                         'तत्काल परामर्श के लिए जुड़ें'}
                      </p>
                    </div>
                    
                    {/* Status indicators */}
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Available
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Secure
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-emerald-100 floating-stats animate-zoomIn">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 stat-number">2,500+</div>
                    <div className="text-xs text-gray-600">Doctors</div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-sky-100 floating-stats animate-zoomIn" style={{ animationDelay: '0.3s' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-600 stat-number">50k+</div>
                    <div className="text-xs text-gray-600">Patients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.problemTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.problemDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.problemStats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                <div className="text-4xl md:text-6xl font-bold text-red-600 mb-4">
                  {stat.number}
                </div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="section-spacing bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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
                className={`medical-card bg-white rounded-2xl p-8 hover-lift animate-slideUp ${
                  activeFeature === index ? 'card-active' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 gradient-medical rounded-xl flex items-center justify-center animate-pulse icon-rotate">
                    <MedicalIcon type={feature.icon} size="w-8 h-8" className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature.benefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover-lift border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-6 gradient-medical rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section-spacing bg-gradient-to-br from-emerald-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.statsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover-lift animate-zoomIn" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-4xl font-bold text-gradient-medical mb-2 stat-number">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing gradient-medical">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t.ctaSubtitle}
          </p>
          <p className="text-sm mb-12 opacity-80">
            {t.trustIndicators}
          </p>
          
          <Link
            to="/login"
            className="bg-white text-emerald-600 px-12 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-xl inline-flex items-center shadow-xl hover-lift"
          >
            <MedicalIcon type="medical-consultation" size="w-6 h-6" className="mr-3" />
            {t.startNowFree}
          </Link>

          <p className="text-white/80 text-sm mt-6">
            {t.consultationFree}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <GarudXLogo 
                size="xl" 
                variant="white" 
                animated={false} 
                showText={false}
              />
              <div className="ml-4">
                <h3 className="text-3xl font-bold text-gradient-medical">GarudX</h3>
                <p className="text-gray-400">{t.footerTagline}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © 2025 GarudX. {t.allRightsReserved}
              </p>
              <p className="text-emerald-400 mt-2 font-medium">
                {t.madeForCommunities}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageProfessional;
