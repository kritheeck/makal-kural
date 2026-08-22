'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types/database';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mk_current_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // default null
      }
    }
  }, []);

  const login = (email: string, role: UserRole = 'USER') => {
    const newUser: AuthUser = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem('mk_current_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mk_current_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: user?.role === 'ADMIN',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
