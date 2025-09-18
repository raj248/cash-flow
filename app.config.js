// build icons from expo-icon-builder.com

export default {
  expo: {
    name: 'Cash Flow - Daily Khata',
    slug: 'cash-flow',
    version: '1.0.2',
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
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you add custom images in categories.',
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
      backgroundColor: '#1B9F67',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lexius.flow.cash',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon/foreground.png',
        backgroundImage: './assets/adaptive-icon/background.png',
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
