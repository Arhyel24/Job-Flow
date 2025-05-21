import { Link, Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { useTheme } from "../context/themeContext";
import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { ThemeColors } from "../constants/colors";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const bounceValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 1.2,
        duration: 800,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: bounceValue }],
              opacity: fadeValue,
            },
          ]}
        >
          <Feather name="frown" size={60} color={theme.text.secondary} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeValue }}>
          <Text style={styles.title}>404 - Page Not Found</Text>
          <Text style={styles.text}>This screen doesn't exist.</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeValue }}>
          <Link href="/(tabs)" asChild>
            <Animated.View
              style={styles.link}
              onStartShouldSetResponder={() => true}
              onResponderGrant={() => {
                Animated.spring(bounceValue, {
                  toValue: 0.9,
                  useNativeDriver: true,
                }).start();
              }}
              onResponderRelease={() => {
                Animated.spring(bounceValue, {
                  toValue: 1,
                  friction: 3,
                  tension: 40,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Text
                style={styles.linkText}
                onPress={() => router.push("/(tabs)")}
              >
                <Feather name="home" size={16} color={theme.primary} /> Go to
                home screen!
              </Text>
            </Animated.View>
          </Link>
        </Animated.View>
      </View>
    </>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    iconContainer: {
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text.primary,
      marginBottom: 10,
      textAlign: "center",
    },
    text: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.text.secondary,
      textAlign: "center",
      marginBottom: 30,
    },
    link: {
      marginTop: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      backgroundColor: theme.primaryLight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    linkText: {
      color: theme.text.primary,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
