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
  expo: {
    name: getAppName(),
    slug: "job-flow",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/adaptive-icon.png",
    scheme: "jobflow",
    owner: "iamwyteshadow",
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
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          "This app needs access to your photo library to allow you to upload or view documents.",
        NSCameraUsageDescription:
          "This app may use the camera to scan or capture documents.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone to record audio notes for job applications.",
        NSLocalNotificationUsageDescription:
          "Job Flow uses notifications to remind you of deadlines and job updates.",
        UIBackgroundModes: ["audio", "fetch", "remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: getUniqueIdentifier(),
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.RECORD_AUDIO",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.FOREGROUND_SERVICE",
      ],
    },
    web: {
      bundler: "metro",
      output: "server",
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
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow Job Flow to access your photos for resume or cover letter uploads.",
          savePhotosPermission:
            "Allow Job Flow to save documents or images to your library.",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/icons/splash-icon-light.png",
          color: "#ffffff",
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
    },
    scheme: "jobflow",
  },
};

// keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android
