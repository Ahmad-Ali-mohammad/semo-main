import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { useDatabase } from './DatabaseContext';
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { updateUser } = useDatabase();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = globalThis.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
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
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<User | null> => {
    try {
      const { user: u } = await api.login(email, pass);
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
    const { user: u } = await api.register(name, email, pass);
    setUser(u);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      updateUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
