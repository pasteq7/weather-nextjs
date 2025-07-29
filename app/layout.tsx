import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Figtree } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather",
  description: "A modern weather application built with Next.js",
};

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}