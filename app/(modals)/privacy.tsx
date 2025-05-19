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
          Your privacy is important to us. This Privacy Policy explains how
          JobFlow collects, uses, and protects your information.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information such as:
          {"\n"}- Google account name & email (on sign-in)
          {"\n"}- Job entries you create manually
          {"\n"}- Anonymous device metadata for stability
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your data solely to:
          {"\n"}- Provide core features
          {"\n"}- Sync and store job info securely
          {"\n"}- Improve app experience (anonymously)
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.paragraph}>
          Your data is protected using Supabase and local device encryption. We
          never sell or share your data.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.paragraph}>
          You can delete your account at any time. This will remove your data
          from both your device and our servers.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.paragraph}>
          For questions, email: support@jobflowapp.com
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
