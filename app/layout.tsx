import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LayoutWrapper } from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VocabMaster | Active Recall',
  description: 'Master your vocabulary with AI-powered active recall',
};

import { VocabProvider } from "@/context/VocabContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased selection:bg-red-500/30 overflow-x-hidden transition-colors duration-500`}>
        <ThemeProvider>
          <AuthProvider>
            {/* Modern Background Elements */}
            <div className="bg-mesh" />
            <div className="bg-orb w-[600px] h-[600px] bg-red-600/10 -top-40 -left-60 animate-pulse-slow" />
            <div className="bg-orb w-[500px] h-[500px] bg-red-900/5 -bottom-20 -right-40" />

            <VocabProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </VocabProvider>
            <ThemeSwitcher />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
