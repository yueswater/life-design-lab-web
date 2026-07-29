import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'zh' | 'en';

const STORAGE_KEY = 'ldl-language';

const PAGE_TITLE: Record<Language, string> = {
  zh: '生命設計實驗室 | 設計專屬你的人生劇本',
  en: 'Life Design Lab | Design the script for your own life',
};

interface LanguageContextValue {
  lang: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'zh';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    document.title = PAGE_TITLE[lang];
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
