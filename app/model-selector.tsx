import React from 'react';
import { Stack } from 'expo-router';
import ModelFetchScreen from './(resources)/ModelFetchScreen';

export default function ModelSelectorRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '3D Model Selector',
          headerShown: false,
        }}
      />
      <ModelFetchScreen />
    </>
  );
}
