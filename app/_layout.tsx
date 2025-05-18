import React, { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SystemUI from "expo-system-ui";
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

import { AuthProvider } from '../context/authContext';
import { ThemeProvider, useTheme } from '../context/themeContext';
import { JobsProvider } from '../context/jobContext';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import ThemedToast from '../utils/toast';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string' && url.startsWith('/')) {
        router.push("/(tabs)/jobs");
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) return;
        redirect(response.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

// Register and schedule notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) throw new Error('Project ID not found');

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push Token:', token);
    } catch (e) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  return token;
}

// Schedule a friendly recurring reminder every 3 days
async function scheduleRecurringReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '👋 Friendly Reminder',
      body: 'Take a moment to check your jobs and update their status!',
      sound: true,
      data: { url: '/jobs' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

function AppInitializer() {
  const { theme, isDarkMode } = useTheme();
  useNotificationObserver();

  useEffect(() => {
    const setupPermissionsAndNotifications = async () => {
      await registerForPushNotificationsAsync();
      await MediaLibrary.requestPermissionsAsync();
      await scheduleRecurringReminder();
    };

    setupPermissionsAndNotifications();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <StatusBar backgroundColor={theme.background} style={isDarkMode ? "dark" : "light"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Root layout
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useFrameworkReady();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboarding_completed');
        setShowOnboarding(value !== 'true');
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setShowOnboarding(true);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded || fontError) {
      checkOnboardingStatus();
    }
  }, [fontsLoaded, fontError]);

  if (!appReady || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider>
      <AuthProvider>
        <ThemeProvider>
          <JobsProvider>
            {showOnboarding ? (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding" />
              </Stack>
            ) : (
              <AppInitializer />
            )}
          </JobsProvider>
          <ThemedToast />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
