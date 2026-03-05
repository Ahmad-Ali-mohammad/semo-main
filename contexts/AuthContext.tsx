import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'semo_auth_user';
const AUTH_TOKEN_STORAGE_KEY = 'semo_auth_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = globalThis.localStorage.getItem(AUTH_STORAGE_KEY);
      const token = globalThis.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      if (!raw || !token) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        globalThis.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        globalThis.localStorage.removeItem(AUTH_STORAGE_KEY);
        globalThis.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<User | null> => {
    try {
      const { user: u, token } = await api.login(email, pass);
      globalThis.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      setUser(u);
      return u;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, pass: string) => {
    const { user: u, token } = await api.register(name, email, pass);
    globalThis.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    setUser(u);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      api.saveUser(updated).catch(() => {
        // keep local profile update even if server update fails
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
