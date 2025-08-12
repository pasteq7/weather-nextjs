// middleware.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n-config';

export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  // This matcher is essential for the 'never' localePrefix strategy
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
