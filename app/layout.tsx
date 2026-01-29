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
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500/30`}>
        <VocabProvider key="v1"> {/* Provider mounted */}
          <div className="mx-auto max-w-4xl px-4 py-8">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </VocabProvider>
      </body>
    </html>
  );
}
