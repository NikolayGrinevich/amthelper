'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  subscription_status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  locale: string;
}

export function AuthProvider({ children, locale }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Login failed');
    }

    setUser(data.user);

    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect');
    if (redirect && redirect !== '/auth/signin' && redirect !== '/auth/signup') {
      router.push(redirect);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Signup failed');
    }

    setUser(data.user);

    router.push(`/${locale}/dashboard`);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    setUser(null);
    router.push(`/${locale}/auth/signin`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
