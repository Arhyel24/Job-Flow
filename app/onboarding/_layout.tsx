import { addDays } from 'date-fns';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingLayout() {
  useEffect(() => {
    const initializeTargetDate = async () => {
      try {
        const existingDate = await AsyncStorage.getItem('targetDate');
        if (!existingDate) {
          await AsyncStorage.setItem(
            'targetDate', 
            addDays(new Date(), 30).toISOString()
          );
        }
      } catch {}
    };

    initializeTargetDate();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}