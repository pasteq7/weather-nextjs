// app/context/LanguageProvider.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { Locale } from '@/i18n-config';

interface AllMessages {
  [key: string]: AbstractIntlMessages;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Update the provider props to include timeZone
interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  allMessages: AllMessages;
  timeZone: string; // Add this line
}

export const LanguageProvider = ({ children, initialLocale, allMessages, timeZone }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const messages = allMessages[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages} 
        timeZone={timeZone} // Pass the prop here
        key={locale}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};