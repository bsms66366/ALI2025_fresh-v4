import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#bcba40',
        tabBarInactiveTintColor: '#9D9D9C',
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#bcba40',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#bcba40',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color="#bcba40"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="ModulesScreen"
        options={{
          title: 'Modules',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CoursesScreen"
        options={{
          title: 'Courses',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="folder-open" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ResourcesScreen"
        options={{
          title: 'Resources',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="graduation-cap" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SpotterScreen"
        options={{
          title: 'Spotter',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="trophy" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="VideoRScreen"
        options={{
          title: 'Video',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="video-camera" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
