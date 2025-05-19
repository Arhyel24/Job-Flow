import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../context/themeContext";
import { useRouter } from "expo-router";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Text from "../../components/ui/Text";
import { useState } from "react";
import { ThemeColors } from "../../constants/colors";

export default function FeatureRequestModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const [featureRequest, setFeatureRequest] = useState("");

  const handleSubmit = () => {
    // Submit logic here
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Request a Feature
      </Text>

      <Text style={styles.paragraph}>
        We'd love to hear your ideas for improving JobTracker!
      </Text>

      <Input
        label="Your Feature Request"
        placeholder="Describe the feature you'd like to see..."
        value={featureRequest}
        onChangeText={setFeatureRequest}
        multiline
        numberOfLines={6}
        style={styles.textArea}
      />

      <View style={styles.buttonGroup}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.button}
        />
        <Button title="Submit" onPress={handleSubmit} style={styles.button} />
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      marginBottom: 20,
      color: theme.text.primary,
    },
    paragraph: {
      marginBottom: 20,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    textArea: {
      height: 180,
      marginBottom: 20,
      textAlignVertical: "top",
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
  });
