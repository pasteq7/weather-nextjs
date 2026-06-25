// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Figtree } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { setRequestLocale } from 'next-intl/server';
import { AppProvider } from "../context/AppContext";
import { Messages } from "@/lib/types";
import { routing, Locale } from "@/i18n-config";
import TopBar from "@/components/layout/top-bar";
import Footer from "@/components/layout/footer";
import { LanguageProvider } from "../context/LanguageProvider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    console.error(`Could not load messages for locale: ${locale}`);
    return {};
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);

  const typedMessages = messages as Messages;
  const metadata = typedMessages.Metadata;

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const allMessages = {
    en: await getMessages('en'),
    fr: await getMessages('fr'),
  };

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return (
    <html lang={locale} className={figtree.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <LanguageProvider 
          initialLocale={locale as Locale} 
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
            <div className="p-2 md:p-4 mx-auto max-w-7xl w-full flex flex-col gap-4">
                <TopBar />
                {children}
                <Footer />
              </div>
            </AppProvider>
            <Toaster richColors />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}