'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminDashboard = pathname?.startsWith('/admin');

    if (isAdminDashboard) {
        return (
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        );
    }

    return (
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Header />
            <main>
                {children}
            </main>
        </div>
    );
}
