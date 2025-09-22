import 'react-native-reanimated';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VipProvider } from "../contexts/VipContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VipProvider>
        <FavoritesProvider>
          <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </FavoritesProvider>
      </VipProvider>
    </SafeAreaProvider>
  );
}
