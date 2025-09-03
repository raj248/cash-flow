export default {
  expo: {
    name: 'Cash Flow - Daily Khata',
    slug: 'cash-flow',
    version: '1.0.0',
    scheme: 'cash-flow',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#6df139ff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lexius.flow.cash',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#3ee428ff',
      },
      package: 'com.lexius.flow.cash',
    },
    extra: {
      router: {},
      eas: {
        projectId: 'eb43fecc-7760-4f15-8051-299890b1fc9a',
      },
    },
  },
};
