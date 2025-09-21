import 'react-native-reanimated';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VipProvider } from "../contexts/VipContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VipProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </VipProvider>
    </SafeAreaProvider>
  );
}
