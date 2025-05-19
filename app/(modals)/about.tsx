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
          JobFlow is a smart and intuitive job application tracker designed to
          simplify and streamline the job search process. Built with a focus on
          usability and privacy, it helps users stay organized, motivated, and
          in control of their career journey.
        </Text>

        <Text style={styles.paragraph}>
          With JobFlow, you can easily log new job applications, monitor their
          progress, and keep track of important milestones such as interviews,
          follow-ups, and outcomes — all in one central location, without the
          need for cluttered spreadsheets or scattered notes.
        </Text>

        <Text style={styles.paragraph}>
          The app was created in response to the common frustration many job
          seekers face when managing multiple applications across different
          platforms. JobFlow brings everything together into a clean, focused
          experience that puts your job hunt at your fingertips.
        </Text>

        <Text style={styles.paragraph}>
          JobFlow operates entirely offline with optional cloud backup to your
          own Google Drive. Your data remains yours, fully private and secure.
        </Text>

        <Text style={styles.paragraph}>Version: 1.0.0</Text>
        <Text style={styles.paragraph}>Developed with care by IRIS LABS</Text>

        <Button
          title="Follow us on Twitter"
          onPress={() => Linking.openURL("https://x.com/earhyel")}
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
