import { Stack } from 'expo-router';

export default function ARLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        gestureEnabled: false, // Disable gesture-based navigation
      }}
    />
  );
}
