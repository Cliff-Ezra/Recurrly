import { Stack } from "expo-router";

import { useAppTheme } from "@/constants/theme";

// The list and its detail screen share the Subscriptions tab, so opening
// /subscriptions/[id] pushes onto this stack instead of becoming its own tab.
export default function SubscriptionsLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
