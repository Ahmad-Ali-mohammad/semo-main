import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPrefs);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoreDefaults = async (): Promise<UserPreferences> => {
    try {
      const storeSettings = await api.getStoreSettings();
      return {
        theme: storeSettings.theme?.darkMode === false ? 'light' : 'dark',
        language: storeSettings.storeLanguage || 'ar',
        notificationsEnabled: storeSettings.enableNotifications ?? true,
      };
    } catch {
      return defaultPrefs;
    }
  };

  // Load preferences from API on mount
  useEffect(() => {
    const loadPrefs = async () => {
      const storeDefaults = await loadStoreDefaults();
      if (!user) {
        setPrefs(storeDefaults);
        applyTheme(storeDefaults.theme);
        setIsLoading(false);
        return;
      }
      try {
        const savedPrefs = await api.getUserPreferences();
        const mergedPrefs = { ...storeDefaults, ...savedPrefs };
        setPrefs(mergedPrefs);
        applyTheme(mergedPrefs.theme);
      } catch {
        setPrefs(storeDefaults);
        applyTheme(storeDefaults.theme);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    loadPrefs();
  }, [user?.id]);

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
    if (!user) {
      return;
    }

    try {
      await api.saveUserPreferences({ [key]: value });
    } catch {
      setPrefs(prefs);
      if (key === 'theme') applyTheme(prefs.theme);
    }
  };

  return (
    <PreferencesContext.Provider value={{ prefs, updatePref, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
};
