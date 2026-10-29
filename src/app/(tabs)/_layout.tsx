import { clsx } from "clsx";
import { Tabs } from "expo-router";
import { type ColorValue, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabs } from "@/constants/data";
import { type IconName, icons, iconStroke } from "@/constants/icons";
import { components, useAppTheme } from "@/constants/theme";

const { tabBar } = components;

type TabIconProps = {
  focused: boolean;
  color: ColorValue;
  icon: IconName;
  title: string;
};

// Icon and label sit together inside the pill, as in the design, so the
// navigator's own label is turned off (tabBarShowLabel: false).
function TabIcon({ focused, color, icon, title }: TabIconProps) {
  const Icon = icons[icon];

  return (
    <View className="tabs-icon">
      <View className={clsx("tabs-pill", focused && "tabs-active")}>
        <Icon size={tabBar.iconSize} color={color} strokeWidth={iconStroke} />
        <Text
          className={clsx("tabs-label", focused && "tabs-label-active")}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
        // Floating bar from the design; screen-content's pb-30 keeps content clear of it
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.bottomGap),
          marginHorizontal: tabBar.horizontalInset,
          height: tabBar.height,
          borderRadius: tabBar.radius,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: colors.tabBarBorder,
          backgroundColor: colors.tabBar,
          elevation: 0,
        },
        // Each tab lays its content out from the top, so let the icon box fill
        // the whole tab; TabIcon then centres the pill inside it.
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                icon={tab.icon}
                title={tab.title}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
