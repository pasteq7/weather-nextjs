// app/context/LanguageProvider.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { Locale } from '@/i18n-config';

// Define the shape of all messages, indexed by locale
interface AllMessages {
  [key: string]: AbstractIntlMessages;
}

// Define the context shape
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the provider props
interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  allMessages: AllMessages;
}

export const LanguageProvider = ({ children, initialLocale, allMessages }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // The currently active messages
  const messages = allMessages[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {/* 
        The key={locale} prop is crucial here. It tells React to re-render 
        the provider and its children whenever the locale changes, ensuring 
        the new messages are applied throughout the component tree.
      */}
      <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};