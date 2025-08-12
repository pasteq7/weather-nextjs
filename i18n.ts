// i18n.ts
import {getRequestConfig} from 'next-intl/server';
import { routing, Locale } from './i18n-config';

function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}
 
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Add timezone configuration to prevent the error
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    // Alternative: you can make it dynamic based on locale
    // timeZone: locale === 'fr' ? 'Europe/Paris' : 'UTC'
  };
});