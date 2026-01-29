import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocab Master | Active Recall",
  description: "Master your vocabulary with active recall from PDF.",
};

import { VocabProvider } from "@/context/VocabContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500/30 overflow-x-hidden`}>
        {/* Modern Background Elements */}
        <div className="bg-mesh" />
        <div className="bg-orb w-[600px] h-[600px] bg-indigo-500/20 -top-40 -left-60 animate-pulse-slow" />
        <div className="bg-orb w-[500px] h-[500px] bg-purple-500/10 -bottom-20 -right-40" />

        <VocabProvider key="v1">
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Header />
            <main className="mt-8 lg:mt-16">
              {children}
            </main>
          </div>
        </VocabProvider>
      </body>
    </html>
  );
}
