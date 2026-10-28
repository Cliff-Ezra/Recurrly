/**
 * Recurly — V3 design tokens for JavaScript.
 *
 * global.css handles everything you style with className. Use this file only
 * for places React Native needs a real value in JS:
 *   • the tab bar (tabBarStyle), StatusBar, navigation theme
 *   • icon colours (@expo/vector-icons, lucide), ActivityIndicator
 *   • TextInput placeholderTextColor / selectionColor
 *   • SVG strokes (budget ring, charts), Reanimated colour interpolation
 *
 * Keep the hex values in sync with the :root blocks in global.css.
 */
import { Appearance, useColorScheme } from 'react-native';

export const palette = {
    light: {
        background: '#f4f4f6',
        foreground: '#111113',
        card: '#ffffff',
        subscription: '#ffffff',
        muted: '#e6e6ea',
        mutedRaised: '#ffffff',
        mutedForeground: '#5c5c63',
        subtleForeground: '#6e6e73',
        surface: '#ffffff',
        surfaceStrong: '#ededf0',
        input: '#ffffff',
        inputBorder: '#e3e3e8',
        primary: '#111113',
        primaryForeground: '#ffffff',
        border: '#e3e3e8',
        borderSubtle: '#ededf0',
        borderStrong: '#d1d1d6',
        track: '#e3e3e8',
        success: '#1e7f45',
        successSoft: '#e3f5ea',
        successForeground: '#ffffff',
        warning: '#8a5300',
        warningSoft: '#fff1db',
        warningDot: '#e08a00',
        destructive: '#b3261e',
        destructiveSoft: 'rgba(210, 59, 47, 0.10)',
        destructiveFill: 'rgba(210, 59, 47, 0.22)',
        destructiveSolid: '#d23b2f',
        destructiveSolidForeground: '#ffffff',
        overlay: 'rgba(17, 17, 19, 0.40)',
        tabBar: 'rgba(255, 255, 255, 0.94)',
        tabBarBorder: '#e3e3e8',
        chartBar: '#c9c9cf',
        chartBarEmpty: '#e6e6ea',
        chart: ['#3d6fe0', '#e8703f', '#e0a800', '#2ba89c'],
    },
    dark: {
        background: '#000000',
        foreground: '#ffffff',
        card: '#111113',
        subscription: '#111113',
        muted: '#1c1c1f',
        mutedRaised: '#3a3a3e',
        mutedForeground: '#a1a1a6',
        subtleForeground: '#8e8e93',
        surface: '#1c1c1f',
        surfaceStrong: '#2c2c30',
        input: '#1c1c1f',
        inputBorder: '#1c1c1f',
        primary: '#ffffff',
        primaryForeground: '#000000',
        border: '#2a2a2e',
        borderSubtle: '#232327',
        borderStrong: '#3a3a3e',
        track: '#232327',
        success: '#3ddc84',
        successSoft: 'rgba(61, 220, 132, 0.12)',
        successForeground: '#000000',
        warning: '#ffb340',
        warningSoft: 'rgba(255, 179, 64, 0.16)',
        warningDot: '#ffb340',
        destructive: '#ff6f64',
        destructiveSoft: 'rgba(255, 90, 78, 0.14)',
        destructiveFill: 'rgba(255, 90, 78, 0.35)',
        destructiveSolid: '#ff5a4e',
        destructiveSolidForeground: '#000000',
        overlay: 'rgba(0, 0, 0, 0.60)',
        tabBar: 'rgba(28, 28, 31, 0.92)',
        tabBarBorder: '#2a2a2e',
        chartBar: '#3a3a3e',
        chartBarEmpty: '#232327',
        chart: ['#5b8cff', '#ff8a5b', '#ffc53d', '#4fd1c5'],
    },
} as const;

export type ColorScheme = keyof typeof palette;
export type Palette = (typeof palette)[ColorScheme];

/** Same 4px scale as global.css (spacing-N = N × 4). */
export const spacing = (n: number) => n * 4;

export const radius = {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 14,
    '2xl': 16,
    '3xl': 20,
    '4xl': 24,
    '5xl': 36,
} as const;

export const components = {
    tabBar: {
        height: 72,
        horizontalInset: 16,
        bottomGap: 24,
        radius: 36,
        itemHeight: 58,
        fabSize: 54,
        iconSize: 22,
    },
    appIcon: { sm: 44, md: 52, lg: 76 },
    touchTarget: 44,
} as const;

/** Motion tokens for Reanimated — match the prototypes. */
export const motion = {
    duration: {
        press: 160,
        fast: 250,
        base: 450,
        enter: 800,
        countUp: 1800,
        holdToCancel: 1200,
    },
    // Use with Easing.bezier(...)
    easing: {
        out: [0.16, 1, 0.3, 1] as const,      // entrances, rings, bars
        spring: [0.34, 1.56, 0.64, 1] as const, // pills, switches, pop-ins
    },
    // Use with withSpring(...)
    spring: {
        pill: { damping: 16, stiffness: 220, mass: 0.9 },
        switch: { damping: 15, stiffness: 260 },
        pop: { damping: 10, stiffness: 180 },
    },
    stagger: 60,       // ms between list rows
    pressScale: 0.97,
} as const;

/** Current palette, following the phone or the user's choice in Settings. */
export function useAppTheme() {
    const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    return { scheme, colors: palette[scheme], isDark: scheme === 'dark' };
}

export type AppearanceChoice = 'dark' | 'light' | 'auto';

/**
 * Settings → Appearance (Dark / Light / Auto).
 * NativeWind v5 listens to Appearance, so this re-themes every className
 * (global.css uses prefers-color-scheme) and useAppTheme() at the same time.
 * Persist the choice (e.g. expo-secure-store) and re-apply it on launch.
 */
export function setAppearance(choice: AppearanceChoice) {
    // React Native 0.88: 'unspecified' = follow the phone again (null is no longer accepted)
    Appearance.setColorScheme(choice === 'auto' ? 'unspecified' : choice);
}

// Back-compat with the starter app, which imports { colors } directly.
// Prefer useAppTheme() so values follow light/dark.
export const colors = palette.light;

export const theme = { palette, spacing, radius, components, motion } as const;
