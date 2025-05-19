import "dotenv/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.jobflow.app.dev";
  }

  if (IS_PREVIEW) {
    return "com.jobflow.app.preview";
  }

  return "com.jobflow.app";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Job Flow (Dev)";
  }

  if (IS_PREVIEW) {
    return "Job Flow (Preview)";
  }

  return "Job Flow";
};

export default {
  name: getAppName(),
  slug: "job-flow",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/adaptive-icon.png",
  scheme: "jobflow",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    config: {
      useNonExemptEncryption: false,
    },
    icons: {
      dark: "./assets/icons/ios-dark.png",
      light: "./assets/icons/ios-light.png",
      tinted: "./assets/icons/ios-tinted.png",
      backgroundColor: "#ffffff",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/icons/adaptive-icon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/icons/splash-icon-dark.png",
          backgroundColor: "#000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "1a3825d8-ddde-4e78-9295-89856a50e31c",
    },
    // googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    // googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    plugins: ["@react-native-google-signin/google-signin"],
  },
  expo: {
    scheme: "jobflow",
  },
};

// keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android
