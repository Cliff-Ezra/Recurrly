import "../../global.css";
import {
  Barlow_200ExtraLight,
  Barlow_300Light,
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  Barlow_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/barlow";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { useAppTheme } from "@/constants/theme";
import { PreferencesProvider } from "@/hooks/use-preferences";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors } = useAppTheme();

  // Keys are the family names global.css expects (font-sans, font-sans-medium, …)
  const [loaded, error] = useFonts({
    "sans-extralight": Barlow_200ExtraLight,
    "sans-light": Barlow_300Light,
    "sans-regular": Barlow_400Regular,
    "sans-medium": Barlow_500Medium,
    "sans-semibold": Barlow_600SemiBold,
    "sans-bold": Barlow_700Bold,
    "sans-extrabold": Barlow_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <PreferencesProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </PreferencesProvider>
  );
}
