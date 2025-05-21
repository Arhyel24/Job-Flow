import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../context/authContext";
import { useFrameworkReady } from "../hooks/useFrameworkReady";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ThemeProvider, useTheme } from "../context/themeContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-native-paper";
import ThemedToast from "../utils/toast";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import { JobsProvider } from "../context/jobContext";
import { DocumentProvider } from "../context/documentContext";
import { NotificationProvider } from "../context/NotificationContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-Bold": Inter_700Bold,
  });

  useFrameworkReady();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider>
      <AuthProvider>
        <ThemeProvider>
          <JobsProvider>
            <DocumentProvider>
              <NotificationProvider>
                <AppInitializer />
              </NotificationProvider>
            </DocumentProvider>
          </JobsProvider>
          <ThemedToast />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

function AppInitializer() {
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme]);

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: theme.background }]}
        >
          <StatusBar
            backgroundColor={theme.background}
            style={isDarkMode ? "dark" : "light"}
          />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
