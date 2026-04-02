
import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar' | 'zh' | 'bn';

interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
];

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    nav_feed: 'Feed',
    nav_verify: 'Verify',
    nav_leaderboard: 'Leaderboard',
    hero_title: 'Fake News',
    hero_subtitle: 'Detector',
    hero_desc: 'Identify misinformation and verify claims using crowd-sourced intelligence and AI.',
    btn_scan: 'DETECT FAKE NEWS',
    label_confidence: 'Certainty',
    label_analysis: 'AI Reasoning',
    label_mirror: 'Verified Source',
    label_ghost: 'Unverified Claim',
    label_sources: 'Supporting Links',
    input_placeholder: 'Enter a claim or paste a news URL to check...',
    footer_tagline: 'Fighting misinformation together.',
    online_count: 'Validators Online'
  },
  es: {
    nav_feed: 'Inicio',
    nav_verify: 'Verificar',
    nav_leaderboard: 'Clasificación',
    hero_title: 'Detector de',
    hero_subtitle: 'Noticias Falsas',
    hero_desc: 'Identifique la desinformación y verifique afirmaciones utilizando inteligencia colectiva e IA.',
    btn_scan: 'DETECTAR NOTICIAS FALSAS',
    label_confidence: 'Certeza',
    label_analysis: 'Razonamiento IA',
    label_mirror: 'Fuente Verificada',
    label_ghost: 'Afirmación no verificada',
    label_sources: 'Enlaces de apoyo',
    input_placeholder: 'Ingrese una afirmación o pegue un enlace...',
    footer_tagline: 'Luchando juntos contra la desinformación.',
    online_count: 'Validadores en línea'
  },
  fr: {
    nav_feed: 'Flux',
    nav_verify: 'Vérifier',
    nav_leaderboard: 'Classement',
    hero_title: 'Détecteur de',
    hero_subtitle: 'Fausses Nouvelles',
    hero_desc: 'Identifiez la désinformation et vérifiez les affirmations grâce à l’intelligence collective et à l’IA.',
    btn_scan: 'DÉTECTER LES FAUSSES INFOS',
    label_confidence: 'Certitude',
    label_analysis: 'Raisonnement IA',
    label_mirror: 'Source Vérifiée',
    label_ghost: 'Allégation non vérifiée',
    label_sources: 'Liens de soutien',
    input_placeholder: 'Entrez une affirmation ou collez un lien...',
    footer_tagline: 'Lutter ensemble contre la désinformation.',
    online_count: 'Validateurs en ligne'
  },
  de: {
    nav_feed: 'Feed',
    nav_verify: 'Verifizieren',
    nav_leaderboard: 'Bestenliste',
    hero_title: 'Fake News',
    hero_subtitle: 'Detektor',
    hero_desc: 'Identifizieren Sie Fehlinformationen und verifizieren Sie Behauptungen mit KI.',
    btn_scan: 'FAKE NEWS ERKENNEN',
    label_confidence: 'Gewissheit',
    label_analysis: 'KI-Begründung',
    label_mirror: 'Verifizierte Quelle',
    label_ghost: 'Unverifizierte Behauptung',
    label_sources: 'Unterstützende Links',
    input_placeholder: 'Geben Sie eine Behauptung ein...',
    footer_tagline: 'Gemeinsam gegen Fehlinformationen.',
    online_count: 'Validatoren Online'
  },
  hi: {
    nav_feed: 'फ़ीड',
    nav_verify: 'सत्यापित करें',
    nav_leaderboard: 'लीडरबोर्ड',
    hero_title: 'फेक न्यूज़',
    hero_subtitle: 'डिटेक्टर',
    hero_desc: 'क्राउड-सोर्स इंटेलिजेंस और एआई का उपयोग करके गलत सूचनाओं की पहचान करें।',
    btn_scan: 'फेक न्यूज़ का पता लगाएं',
    label_confidence: 'निश्चितता',
    label_analysis: 'एआई तर्क',
    label_mirror: 'सत्यापित स्रोत',
    label_ghost: 'असत्यापित दावा',
    label_sources: 'सहायक लिंक',
    input_placeholder: 'दावा दर्ज करें या लिंक पेस्ट करें...',
    footer_tagline: 'मिलकर गलत सूचना से लड़ें।',
    online_count: 'वैलिडेटर ऑनलाइन'
  },
  zh: {
    nav_feed: '动态',
    nav_verify: '验证',
    nav_leaderboard: '排行榜',
    hero_title: '虚假新闻',
    hero_subtitle: '检测器',
    hero_desc: '利用众包情报和人工智能识别虚假信息并验证说法。',
    btn_scan: '检测虚假新闻',
    label_confidence: '确定性',
    label_analysis: 'AI推理',
    label_mirror: '经验证的来源',
    label_ghost: '未验证的声明',
    label_sources: '支持链接',
    input_placeholder: '输入说法或粘贴链接...',
    footer_tagline: '共同打击虚假信息。',
    online_count: '验证者在线'
  },
  ar: {
    nav_feed: 'الموجز',
    nav_verify: 'التحقق',
    nav_leaderboard: 'المتصدرين',
    hero_title: 'كاشف الأخبار',
    hero_subtitle: 'المزيفة',
    hero_desc: 'حدد المعلومات المضللة وتحقق من الادعاءات باستخدام الذكاء الاصطناعي.',
    btn_scan: 'كشف الأخبار المزيفة',
    label_confidence: 'اليقين',
    label_analysis: 'تحليل الذكاء الاصطناعي',
    label_mirror: 'مصدر موثق',
    label_ghost: 'ادعاء غير موثق',
    label_sources: 'روابط داعمة',
    input_placeholder: 'أدخل ادعاءً أو الصق رابطًا...',
    footer_tagline: 'نحارب التضليل معاً.',
    online_count: 'المحققون متصلون'
  },
  bn: {
    nav_feed: 'ফিড',
    nav_verify: 'যাচাই',
    nav_leaderboard: 'লিডারবোর্ড',
    hero_title: 'ফেক নিউজ',
    hero_subtitle: 'ডিটেক্টর',
    hero_desc: 'ক্রাউড-সোর্স ইন্টেলিজেন্স এবং এআই ব্যবহার করে ভুল তথ্য শনাক্ত করুন।',
    btn_scan: 'ফেক নিউজ শনাক্ত করুন',
    label_confidence: 'নিশ্চয়তা',
    label_analysis: 'এআই যুক্তি',
    label_mirror: 'যাচাইকৃত উৎস',
    label_ghost: 'অযাচাইকৃত দাবি',
    label_sources: 'সহায়ক লিঙ্ক',
    input_placeholder: 'দাবি লিখুন বা লিঙ্ক পেস্ট করুন...',
    footer_tagline: 'একসাথে ভুল তথ্যের বিরুদ্ধে লড়াই করুন।',
    online_count: 'ভ্যালিডেটর অনলাইন'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('fp_lang') as LanguageCode) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('fp_lang', language);
    const selectedLang = LANGUAGES.find(l => l.code === language);
    document.documentElement.dir = selectedLang?.dir || 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => translations[language][key] || translations['en'][key] || key;
  const dir = LANGUAGES.find(l => l.code === language)?.dir || 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
