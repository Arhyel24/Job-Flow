import { Stack } from "expo-router";

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "View Document",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
