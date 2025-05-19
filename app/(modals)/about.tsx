import { SafeAreaView, StyleSheet, ScrollView, Linking } from "react-native";
import { useTheme } from "../../context/themeContext";
import { useRouter } from "expo-router";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

export default function AboutModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="h3" style={styles.title}>
          About JobFlow
        </Text>

        <Text style={styles.paragraph}>
          JobFlow is a modern job application tracker built for professionals
          and job seekers who want to stay organized and in control of their
          career journey.
        </Text>

        <Text style={styles.paragraph}>
          The app allows you to log, update, and monitor the progress of your
          job applications in one centralized place — no spreadsheets required.
        </Text>

        <Text style={styles.paragraph}>
          Created by Enoch Philip, a developer who experienced firsthand the
          challenge of managing job applications across multiple platforms.
          JobFlow was born out of a need to simplify that process.
        </Text>

        <Text style={styles.paragraph}>Version: 1.0.0</Text>

        <Text style={styles.paragraph}>Developed with care by IRIS LABS</Text>

        <Button
          title="Visit Our Website"
          onPress={() => Linking.openURL("https://yourwebsite.com")}
          style={styles.button}
        />

        <Button
          title="Close"
          onPress={() => router.back()}
          variant="outline"
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      marginBottom: 20,
      color: theme.text.primary,
    },
    paragraph: {
      marginBottom: 15,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    button: {
      marginTop: 10,
    },
  });
