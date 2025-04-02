import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useTheme } from '@/components/useTheme';

export default function ModalScreen() {
  const { theme, colorScheme, setTheme } = useTheme();
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const buttonBg = useThemeColor({ light: '#e0e0e0', dark: '#404040' }, 'background');
  
  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '⚙️';
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'system': return 'System Theme';
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Pressable
        style={[styles.themeButton, { backgroundColor: buttonBg }]}
        onPress={cycleTheme}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
          {getThemeIcon()} {getThemeText()}
        </Text>
      </Pressable>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
