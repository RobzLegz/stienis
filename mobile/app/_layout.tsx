import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { GameProvider } from '@/context/game-context';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </GameProvider>
  );
}
