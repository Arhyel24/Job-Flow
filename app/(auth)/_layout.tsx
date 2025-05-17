import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/themeContext';



export default function AuthLayout() {
  const { isLoggedIn } = useAuth()
  const {theme} = useTheme()
  
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/jobs" />;
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen
					name="sign-up"
					options={{
						presentation: "modal",
						headerShown: true,
						headerTitle: "Sign Up",
						headerStyle: {
							backgroundColor: theme.background,
						},
						headerTintColor:theme.primary,
						gestureEnabled: true,
					}}
				/>
				<Stack.Screen
					name="sign-in"
					options={{
						presentation: "modal",
						headerShown: true,
						headerTitle: "Sign In",
						headerStyle: {
							backgroundColor: theme.background,
						},
						headerTintColor:theme.primary,
						gestureEnabled: true,
					}}
				/>
			</Stack>
  );
}