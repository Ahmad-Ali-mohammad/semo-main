import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types';
import { api } from '../services/api';

interface PreferencesContextType {
  prefs: UserPreferences;
  updatePref: (key: keyof UserPreferences, value: any) => Promise<void>;
  isLoading: boolean;
}

const defaultPrefs: UserPreferences = {
  theme: 'dark',
  language: 'ar',
  notificationsEnabled: true
};

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPrefs);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from API on mount
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const savedPrefs = await api.getUserPreferences();
       setPrefs(savedPrefs);
        applyTheme(savedPrefs.theme);
      } catch (error) {
        console.error('Failed to load preferences:', error);
        setPrefs(defaultPrefs);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrefs();
  }, []);

  const applyTheme = (theme: 'dark' | 'light') => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const updatePref = async (key: keyof UserPreferences, value: any) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);

    // Apply theme immediately
    if (key === 'theme') {
      applyTheme(value as 'dark' | 'light');
    }

    // Save to API
    try {
      await api.saveUserPreferences({ [key]: value });
    } catch (error) {
      console.error('Failed to save preference:', error);
      // Revert on error
      setPrefs(prefs);
      if (key === 'theme') {
        applyTheme(prefs.theme);
      }
    }
  };

  return (
    <PreferencesContext.Provider value={{ prefs, updatePref, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
};
