import { useState, useEffect } from 'react';
import { AppSettings } from '@/types/shopping';
import { loadSettings, saveSettings } from './useShoppingLists';

export function useTheme() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    const root = document.documentElement;
    const { theme } = settings;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveSettings(updated);
  };

  const toggleTheme = () => {
    const current = settings.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  return { settings, updateSettings, toggleTheme };
}
