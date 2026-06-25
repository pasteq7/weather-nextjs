import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/app/context/AppContext';
import { LanguageProvider } from '@/app/context/LanguageProvider';
import TopBar from '@/components/layout/top-bar';
import Footer from '@/components/layout/footer';
import HomePage from '@/app/HomePage';
import { Locale, routing } from '@/i18n-config';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

const allMessages = {
  en: enMessages,
  fr: frMessages,
};

export default function App() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <LanguageProvider
      initialLocale={routing.defaultLocale as Locale}
      allMessages={allMessages}
      timeZone={timeZone}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          <div className="mx-auto grid h-dvh max-h-dvh w-full max-w-[98rem] grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden p-2 sm:gap-3 md:p-4">
            <TopBar />
            <HomePage />
            <Footer />
          </div>
        </AppProvider>
        <Toaster richColors />
      </ThemeProvider>
    </LanguageProvider>
  );
}
