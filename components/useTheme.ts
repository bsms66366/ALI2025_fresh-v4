import { useColorScheme as useNativeColorScheme } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type ThemeStore = {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'system',
  setTheme: (theme) => {
    set({ theme });
    AsyncStorage.setItem('theme', theme);
  },
}));

export function useTheme() {
  const nativeColorScheme = useNativeColorScheme();
  const { theme, setTheme } = useThemeStore();
  
  // Load saved theme on mount
  useEffect(() => {
    AsyncStorage.getItem('theme').then((savedTheme) => {
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setTheme(savedTheme);
      }
    });
  }, []);

  // Calculate the effective theme
  const effectiveTheme = theme === 'system' ? nativeColorScheme : theme;
  
  return {
    theme,
    colorScheme: effectiveTheme ?? 'light',
    setTheme,
  };
}
