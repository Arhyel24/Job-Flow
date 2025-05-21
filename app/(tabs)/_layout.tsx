import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Platform, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home, Briefcase, FileText, Settings } from "lucide-react-native";
import { useTheme } from "../../context/themeContext";
import { ThemeColors } from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import Onboarding from "../../components/onBoarding";

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_completed");
        setShowOnboarding(value !== "true");
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setShowOnboarding(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@onboarding_completed", "true");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={theme.background}
        style={isDarkMode ? "light" : "dark"}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.text.secondary,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
          tabBarShowLabel: true,
          animation: "shift",
        }}
        initialRouteName="index"
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Briefcase color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Applications",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="documents"
          options={{
            title: "Documents",
            tabBarIcon: ({ color, size }) => (
              <FileText color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      </Tabs>

      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={showOnboarding}
        onRequestClose={completeOnboarding}
      >
        <Onboarding onComplete={completeOnboarding} />
      </Modal>
    </>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.background,
      borderTopWidth: 0.2,
      borderTopColor: theme.border,
      paddingTop: 4,
      paddingBottom: Platform.OS === "ios" ? 24 : 8,
      height: Platform.OS === "ios" ? 80 : 60,
    },
    tabBarLabel: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 4,
    },
  });
