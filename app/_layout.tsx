import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'BinarioGame' }} />
      <Stack.Screen name="GameScreen" options={{ title: 'BinarioGame' }} />
    </Stack>
  );
}
