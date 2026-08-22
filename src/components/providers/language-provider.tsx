'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/lib/i18n/en';
import { ta } from '@/lib/i18n/ta';
import { PreferredLanguage } from '@/types/database';

type Translations = typeof en;

interface LanguageContextType {
  language: PreferredLanguage;
  setLanguage: (lang: PreferredLanguage) => void;
  t: Translations;
  isTamil: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
  isTamil: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<PreferredLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('mk_preferred_language') as PreferredLanguage;
    if (saved === 'ta' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: PreferredLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('mk_preferred_language', lang);
  };

  const t = language === 'ta' ? ta : en;
  const isTamil = language === 'ta';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTamil }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
