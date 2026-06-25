// i18n-config.ts
export const routing = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'never'
} as const;

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
export type Locale = (typeof locales)[number];
