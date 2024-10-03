/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const colors = {
  dark: {
    text: '#FFFFFF',
    subText: '#CCCCCC',
    // 미드나잇 블루
    background: '#2a2d3e',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // 차콜 블랙
    button: "#121417"
  },
  light: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button: "#121417"
  },
  success: '#06c270',
  // accent: "#ff3b3b",
  accent: '#FF6347',
  darkGray: "#1e2025",
  lightGray: "#d1d1d1",
};
