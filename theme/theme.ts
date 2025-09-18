// theme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: 'rgb(27, 159, 103)', // brand green
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(207, 245, 227)', // light green tint
    onPrimaryContainer: 'rgb(0, 57, 30)',

    secondary: 'rgb(255, 200, 87)', // golden yellow
    onSecondary: 'rgb(27, 27, 27)',
    secondaryContainer: 'rgb(255, 239, 190)', // pale yellow
    onSecondaryContainer: 'rgb(63, 40, 0)',

    tertiary: 'rgb(77, 182, 172)', // teal accent
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(208, 245, 239)',
    onTertiaryContainer: 'rgb(0, 55, 50)',

    error: 'rgb(220, 38, 38)', // red
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(252, 217, 217)',
    onErrorContainer: 'rgb(65, 0, 2)',

    background: 'rgb(248, 250, 249)', // soft gray-green
    onBackground: 'rgb(31, 31, 31)',
    surface: 'rgb(255, 255, 255)',
    onSurface: 'rgb(29, 27, 30)',
    surfaceVariant: 'rgb(240, 243, 242)', // subtle neutral
    onSurfaceVariant: 'rgb(74, 69, 78)',

    outline: 'rgb(160, 160, 160)',
    outlineVariant: 'rgb(210, 210, 210)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    inverseSurface: 'rgb(45, 55, 50)', // dark muted green
    inverseOnSurface: 'rgb(243, 244, 246)',
    inversePrimary: 'rgb(20, 120, 80)', // dark green

    elevation: {
      level0: 'transparent',
      level1: 'rgb(243, 248, 246)',
      level2: 'rgb(239, 244, 242)',
      level3: 'rgb(236, 241, 239)',
      level4: 'rgb(234, 239, 237)',
      level5: 'rgb(231, 236, 234)',
    },

    surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
    backdrop: 'rgba(51, 47, 55, 0.4)',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: 'rgb(20, 120, 80)', // darker brand green
    onPrimary: 'rgb(243, 244, 246)',
    primaryContainer: 'rgb(0, 57, 30)',
    onPrimaryContainer: 'rgb(183, 246, 217)',

    secondary: 'rgb(255, 200, 87)', // golden yellow
    onSecondary: 'rgb(31, 31, 31)',
    secondaryContainer: 'rgb(90, 70, 20)',
    onSecondaryContainer: 'rgb(255, 239, 190)',

    tertiary: 'rgb(64, 160, 150)', // teal accent
    onTertiary: 'rgb(243, 244, 246)',
    tertiaryContainer: 'rgb(0, 55, 50)',
    onTertiaryContainer: 'rgb(177, 236, 228)',

    error: 'rgb(220, 38, 38)', // red
    onError: 'rgb(243, 244, 246)',
    errorContainer: 'rgb(127, 29, 29)',
    onErrorContainer: 'rgb(252, 217, 217)',

    background: 'rgb(17, 24, 39)', // slate-900
    onBackground: 'rgb(243, 244, 246)',
    surface: 'rgb(31, 41, 55)', // slate-800
    onSurface: 'rgb(243, 244, 246)',
    surfaceVariant: 'rgb(55, 65, 81)',
    onSurfaceVariant: 'rgb(156, 163, 175)',

    outline: 'rgb(107, 114, 128)',
    outlineVariant: 'rgb(55, 65, 81)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    inverseSurface: 'rgb(243, 244, 246)',
    inverseOnSurface: 'rgb(45, 55, 50)',
    inversePrimary: 'rgb(27, 159, 103)', // brand green

    elevation: {
      level0: 'transparent',
      level1: 'rgb(39, 49, 61)',
      level2: 'rgb(44, 55, 70)',
      level3: 'rgb(50, 61, 77)',
      level4: 'rgb(55, 65, 81)',
      level5: 'rgb(61, 72, 90)',
    },

    surfaceDisabled: 'rgba(243, 244, 246, 0.12)',
    onSurfaceDisabled: 'rgba(243, 244, 246, 0.38)',
    backdrop: 'rgba(15, 23, 42, 0.4)',
  },
};
