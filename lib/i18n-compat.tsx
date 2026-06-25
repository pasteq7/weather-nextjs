import { createContext, ReactNode, useCallback, useContext } from 'react';

export type AbstractIntlMessages = Record<string, unknown>;

type TranslationValues = Record<string, string | number | boolean | null | undefined>;

interface I18nContextValue {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getPathValue(source: unknown, path: string) {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

function interpolate(message: string, values?: TranslationValues) {
  if (!values) return message;

  return message.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value === null || value === undefined ? '' : String(value);
  });
}

export function NextIntlClientProvider({
  children,
  locale,
  messages,
  timeZone,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
}) {
  return (
    <I18nContext.Provider value={{ locale, messages, timeZone }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(I18nContext);
  return context?.locale ?? 'en';
}

export function useTranslations(namespace?: string) {
  const context = useContext(I18nContext);

  return useCallback((key: string, values?: TranslationValues) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = getPathValue(context?.messages, fullKey);

    if (typeof message === 'string') {
      return interpolate(message, values);
    }

    return fullKey;
  }, [context?.messages, namespace]);
}
