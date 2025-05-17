import 'dotenv/config';

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
  icon: "./assets/images/icon.png",
  scheme: "jobflow",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "ed990a74-4480-4950-9e4d-d85741e60bec",
    },
    // googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    // googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    plugins: ["@react-native-google-signin/google-signin"]
  },
};


// keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android