import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Home, Briefcase, FileText, Settings } from 'lucide-react-native';
import { useTheme } from '../../context/themeContext';
import { useAuth } from '../../context/authContext';
import { ThemeColors } from '../../constants/colors';

export default function TabLayout() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
		return null;
	}
  
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Applications',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.background,
      borderTopWidth: 0.2,
      borderTopColor: theme.border,
      paddingTop: 4,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8,
      height: Platform.OS === 'ios' ? 80 : 60,
    },
    tabBarLabel: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 4,
    },
  });
