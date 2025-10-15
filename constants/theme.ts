/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#FFFFFF',
    tint: '#22c55e',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#22c55e',
    candy: {
      blue: '#60a5fa',
      green: '#34d399',
      yellow: '#facc15',
      pink: '#f472b6',
      purple: '#a78bfa',
      orange: '#fb923c',
      bgSoft: '#F8FAFC',
      card: '#FFFFFF',
      shadow: 'rgba(0,0,0,0.08)'
    }
  },
  dark: {
    text: '#F1F5F9',
    background: '#0B1220',
    tint: '#34d399',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#34d399',
    candy: {
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#eab308',
      pink: '#ec4899',
      purple: '#8b5cf6',
      orange: '#f97316',
      bgSoft: '#0F172A',
      card: '#111827',
      shadow: 'rgba(0,0,0,0.4)'
    }
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
