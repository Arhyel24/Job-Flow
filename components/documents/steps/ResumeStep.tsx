import { View, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FileUp } from "lucide-react-native";
import { useTheme } from "../../../context/themeContext";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Text from "../../ui/Text";
import { ThemeColors } from "../../../constants/colors";
import { useDocuments } from "../../../context/documentContext";
import { Document } from "../../../types/document";
import uuid from "react-native-uuid";

const ResumeStep = () => {
  const { theme } = useTheme();
  const { resume, setResume } = useDocuments();
  const styles = createStyles(theme);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        const document: Document = {
          id: uuid.v4().toString(),
          name: asset.name,
          type: asset.mimeType || "application/pdf",
          size: asset.size || 0,
          date: new Date().toISOString().substring(0, 10),
          uri: asset.uri,
          category: "resume",
        };

        setResume(document);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" weight="bold" style={styles.title}>
        Upload Your Resume
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        Please upload a PDF version of your resume
      </Text>

      {!resume ? (
        <Button
          title="Select Resume PDF"
          leftIcon={<FileUp size={20} color={theme.primary} />}
          onPress={handleUpload}
          style={styles.uploadButton}
        />
      ) : (
        <View style={styles.filePreview}>
          <View style={styles.fileInfo}>
            <FileUp size={24} color={theme.primary} />
            <View style={styles.fileDetails}>
              <Text>{resume.name}</Text>
              <Text variant="caption" color="secondary">
                {(resume.size / 1024).toFixed(1)} KB
              </Text>
            </View>
          </View>
          <View style={styles.fileActions}>
            <Button
              variant="outline"
              title="Replace"
              onPress={handleUpload}
              size="small"
            />
            <Button
              variant="outline"
              title="Remove"
              onPress={() => setResume(null)}
              size="small"
              style={styles.removeButton}
            />
          </View>
        </View>
      )}
    </Card>
  );
};

const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    card: {
      padding: 16,
      marginVertical: 16,
    },
    title: {
      marginBottom: 8,
    },
    subtitle: {
      marginBottom: 16,
    },
    uploadButton: {
      marginTop: 16,
    },
    filePreview: {
      marginTop: 16,
    },
    fileInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    fileDetails: {
      marginLeft: 12,
    },
    fileActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
    removeButton: {
      borderColor: theme.error,
    },
  });
};

export default ResumeStep;
