import { Stack } from 'expo-router';

export default function ResourcesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="ModelFetchScreen" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ViroARScreen" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="SearchScreen" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PathPotsScreen" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SessionNotesScreen" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
