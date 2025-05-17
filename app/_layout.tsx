import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/authContext';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { startSyncService, stopSyncService } from '../utils/storage';
import { ThemeProvider } from '../context/themeContext';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-native-paper';
import ThemedToast from '../utils/toast';

SplashScreen.preventAutoHideAsync();

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
        {showOnboarding ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
          </Stack>
        ) : (
          <AppInitializer />
        )}
        <ThemedToast />
      </ThemeProvider>
      </AuthProvider>
      </Provider>
  );
}

function AppInitializer() {
  const { isLoggedIn, isLoading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    startSyncService();
    return () => stopSyncService();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.replace('/(auth)/sign-in');
      } else {
        router.replace('/(tabs)/jobs');
      }
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}