import React from 'react';
import { Stack } from 'expo-router';
import ModelFetchScreen from '@/app/(resources)/ModelFetchScreen';

// This is the default export for Expo Router
export default function ModelFetchRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Model Selection',
          headerShown: false,
        }}
      />
      <ModelFetchScreen />
    </>
  );
}
