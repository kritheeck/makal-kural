'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/database';
import { signInWithPassword, signUpWithPassword, signOut } from '@/lib/supabase/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = localStorage.getItem('mk_auth_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AuthUser;
          if (!cancelled) setUser(parsed);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required');
    const { data, error } = await signInWithPassword(email, password);
    if (error || !data) throw error || new Error('Login failed');
    setUser(data);
    localStorage.setItem('mk_auth_user', JSON.stringify(data));
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data, error } = await signUpWithPassword(email, password, name);
    if (error || !data) throw error || new Error('Registration failed');
    setUser(data);
    localStorage.setItem('mk_auth_user', JSON.stringify(data));
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    localStorage.removeItem('mk_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'ADMIN', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
