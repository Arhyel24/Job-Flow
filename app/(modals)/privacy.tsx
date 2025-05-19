import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../context/themeContext";
import { useRouter } from "expo-router";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

export default function PrivacyModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="h3" style={styles.title}>
          Privacy Policy
        </Text>

        <Text style={styles.paragraph}>
          At JobFlow, we take your privacy seriously. This Privacy Policy
          explains our simple and transparent approach: we do not collect or
          store any personal data.
        </Text>

        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.paragraph}>
          JobFlow does not collect, track, or analyze any personal data, usage
          data, or device metadata. We believe your job search is your private
          business.
        </Text>

        <Text style={styles.sectionTitle}>2. Backups & Data Storage</Text>
        <Text style={styles.paragraph}>
          All your job data, including resumes, notes, and tracking history, is
          stored locally on your device. When you choose to back up your data,
          it is saved securely to your own Google Drive account — not ours.
          {"\n\n"}
          This means only you have access to your backup files. JobFlow has no
          visibility or access to any of the files in your Drive.
        </Text>

        <Text style={styles.sectionTitle}>3. No Analytics or Tracking</Text>
        <Text style={styles.paragraph}>
          We do not use analytics tools, trackers, or advertising identifiers.
          We simply don’t track anything — no session data, no usage behavior,
          and no personal identifiers.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Control</Text>
        <Text style={styles.paragraph}>
          You’re in full control of your data. If you uninstall the app, all
          stored data on your device is removed. Likewise, you can delete
          backups from your Google Drive at any time.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          If we ever change our privacy approach, we’ll notify users clearly
          within the app. Transparency is our default.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact</Text>
        <Text style={styles.paragraph}>
          Questions or feedback? Reach out to us at: support@jobflowapp.com
        </Text>

        <Button
          title="Close"
          onPress={() => router.back()}
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
    sectionTitle: {
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 5,
      color: theme.text.primary,
    },
    paragraph: {
      marginBottom: 15,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    button: {
      marginTop: 20,
    },
  });
