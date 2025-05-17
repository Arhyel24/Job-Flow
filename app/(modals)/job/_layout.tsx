import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Job Details',
          headerShown: false
        }}
      />
    </Stack>
  );
}