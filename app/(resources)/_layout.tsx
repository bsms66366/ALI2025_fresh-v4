import { Slot } from 'expo-router';

// This layout file prevents files in this directory from being treated as routes
// The "children" prop is automatically passed by Expo Router
export default function ResourcesLayout() {
  // Using Slot instead of Stack to prevent files in this directory from being treated as routes
  return <Slot />;
}
