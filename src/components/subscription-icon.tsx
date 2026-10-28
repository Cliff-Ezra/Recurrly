import { Image } from "expo-image";
import { Text, View } from "react-native";

import { type BrandId, brands } from "@/constants/brands";

type Size = "sm" | "md" | "lg";

const tileClass: Record<Size, string> = {
  sm: "app-icon",
  md: "app-icon-lg",
  lg: "app-icon-xl",
};

const letterClass: Record<Size, string> = {
  sm: "app-icon-letter",
  md: "app-icon-letter-lg",
  lg: "app-icon-letter-xl",
};

const logoSize: Record<Size, number> = { sm: 24, md: 28, lg: 42 };

// Fallback for subscriptions that aren't in the brand list
const defaultColor = "#24292f";

type SubscriptionIconProps = {
  /** A known service; its colour and logo are used. */
  brand?: BrandId;
  /** Shown as the first letter when there's no logo. */
  name?: string;
  /** Tile colour for services that aren't in the brand list. */
  color?: string;
  size?: Size;
};

export function SubscriptionIcon({ brand, name, color, size = "sm" }: SubscriptionIconProps) {
  const known = brand ? brands[brand] : undefined;
  const background = known?.color ?? color ?? defaultColor;
  const foreground = contrastingInk(background);
  const logo = known && "logo" in known ? known.logo : undefined;
  const letter = (name ?? known?.name ?? "?").charAt(0).toUpperCase();

  return (
    <View className={tileClass[size]} style={{ backgroundColor: background }}>
      {logo ? (
        <Image
          source={logo}
          tintColor={foreground}
          contentFit="contain"
          style={{ width: logoSize[size], height: logoSize[size] }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text className={letterClass[size]} style={{ color: foreground }}>
          {letter}
        </Text>
      )}
    </View>
  );
}

/**
 * Black or white ink for a tile colour. The 0.3 luminance cut-off reproduces
 * the design's tiles (black on Spotify, Duolingo, Canva, Prime Video; white on
 * Netflix, YouTube, Apple Music, iCloud+, ChatGPT).
 */
function contrastingInk(hex: string) {
  const value = parseInt(hex.replace("#", ""), 16);
  const channel = (shift: number) => {
    const c = ((value >> shift) & 0xff) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
  return luminance > 0.3 ? "#000000" : "#ffffff";
}
