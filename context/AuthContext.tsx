'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAdmin: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'Romizzidi9999';
const ADMIN_PASSWORD = 'AKUSAYANGAMEL';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedAuth = localStorage.getItem('vocab-admin-auth');
        if (savedAuth === 'true') {
            setIsAdmin(true);
        }
        setMounted(true);
    }, []);

    const login = (username: string, password: string): boolean => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            localStorage.setItem('vocab-admin-auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('vocab-admin-auth');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {mounted ? children : <div className="invisible">{children}</div>}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
