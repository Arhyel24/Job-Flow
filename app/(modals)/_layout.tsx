import { Stack } from "expo-router";
import { useTheme } from "../../context/themeContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function ModalLayout() {
  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <StatusBar
          backgroundColor={theme.background}
          style={isDarkMode ? "light" : "dark"}
        />
        <Stack
          screenOptions={{
            presentation: "modal",
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTitleStyle: {
              color: theme.text.primary,
            },
            headerTintColor: theme.primary,
            contentStyle: {
              backgroundColor: theme.background,
            },
          }}
        >
          <Stack.Screen name="add-job" options={{ title: "Add New Job" }} />
          <Stack.Screen name="about" options={{ title: "About the App" }} />
          <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
          <Stack.Screen name="backup" options={{ title: "Backup to Google" }} />
          <Stack.Screen
            name="restore"
            options={{ title: "Restore Google Backup" }}
          />
          <Stack.Screen name="job" options={{ title: "View Job" }} />
          <Stack.Screen
            name="feature-request"
            options={{ title: "Request Feature" }}
          />
          <Stack.Screen name="wizard" options={{ title: "Resume Creator" }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
