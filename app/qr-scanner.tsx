import React from 'react';
import { Stack } from 'expo-router';
// Import from the components directory
import QRScannerScreen from '../components/QRScannerScreen';

// This is the default export for Expo Router
export default function QRScannerRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'QR Code Scanner',
          headerShown: true,
        }}
      />
      <QRScannerScreen />
    </>
  );
}
