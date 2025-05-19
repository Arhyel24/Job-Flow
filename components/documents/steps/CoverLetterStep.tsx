import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FileText, Wand2 } from "lucide-react-native";
import { useTheme } from "../../../context/themeContext";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Text from "../../ui/Text";
import { useDocuments } from "../../../context/documentContext";
import TabButton from "../../ui/TabButton";
import { ThemeColors } from "../../../constants/colors";

const CoverLetterStep = () => {
  const { theme } = useTheme();
  const { coverLetter, setCoverLetter, coverLetterFile, setCoverLetterFile } =
    useDocuments();
  const [activeTab, setActiveTab] = useState<"upload" | "generate">("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  const styles = createStyles(theme);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        setCoverLetterFile({
          id: Date.now().toString(),
          name: asset.name,
          type: asset.mimeType || "application/pdf",
          size: asset.size || 0,
          date: new Date().toISOString().substring(0, 10),
          uri: asset.uri,
          category: "cover_letter",
        });
      }
    } catch (error) {
      console.error("Error uploading cover letter:", error);
    }
  };

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockCoverLetter = `Dear Hiring Manager,\n\nI am excited to apply for the position at your company. My skills and experience align well with the requirements, and I believe I would be a valuable addition to your team.\n\nSincerely,\n[Your Name]`;

      setCoverLetter(mockCoverLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" weight="bold" style={styles.title}>
        Cover Letter
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        Upload or generate a tailored cover letter
      </Text>

      <View style={styles.tabContainer}>
        <TabButton
          active={activeTab === "upload"}
          onPress={() => setActiveTab("upload")}
          icon={
            <FileText
              size={16}
              color={
                activeTab === "upload" ? theme.primary : theme.text.secondary
              }
            />
          }
          title="Upload"
        />
        <TabButton
          active={activeTab === "generate"}
          onPress={() => setActiveTab("generate")}
          icon={
            <Wand2
              size={16}
              color={
                activeTab === "generate" ? theme.primary : theme.text.secondary
              }
            />
          }
          title="Generate with AI"
        />
      </View>

      {activeTab === "upload" ? (
        <>
          {!coverLetterFile ? (
            <Button
              title="Select Cover Letter File"
              leftIcon={<FileText size={20} color={theme.primary} />}
              onPress={handleFileUpload}
              style={styles.uploadButton}
            />
          ) : (
            <View style={styles.filePreview}>
              <View style={styles.fileInfo}>
                <FileText size={24} color={theme.primary} />
                <View style={styles.fileDetails}>
                  <Text>{coverLetterFile.name}</Text>
                  <Text variant="caption" color="secondary">
                    {(coverLetterFile.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
              </View>
              <View style={styles.fileActions}>
                <Button
                  variant="outline"
                  title="Replace"
                  onPress={handleFileUpload}
                  size="small"
                />
                <Button
                  variant="outline"
                  title="Remove"
                  onPress={() => setCoverLetterFile(null)}
                  size="small"
                  style={styles.removeButton}
                />
              </View>
            </View>
          )}
        </>
      ) : (
        <>
          {!coverLetter ? (
            <Button
              title={isGenerating ? "Generating..." : "Generate Cover Letter"}
              onPress={generateCoverLetter}
              disabled={isGenerating}
              isLoading={isGenerating}
              leftIcon={<Wand2 size={20} color={theme.primary} />}
              style={styles.generateButton}
            />
          ) : (
            <>
              <TextInput
                style={[
                  styles.textInput,
                  { color: theme.text.primary, borderColor: theme.border },
                ]}
                multiline
                numberOfLines={12}
                value={coverLetter}
                onChangeText={setCoverLetter}
                placeholderTextColor={theme.text.secondary}
              />
              <View style={styles.buttonGroup}>
                <Button
                  variant="outline"
                  title="Regenerate"
                  onPress={generateCoverLetter}
                  style={styles.secondaryButton}
                />
                <Button
                  title="Download"
                  onPress={() => console.log("Download cover letter")}
                  style={styles.primaryButton}
                />
              </View>
            </>
          )}
        </>
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
    tabContainer: {
      flexDirection: "row",
      marginBottom: 16,
      gap: 8,
    },
    uploadButton: {
      marginTop: 16,
    },
    generateButton: {
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
    textInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      textAlignVertical: "top",
      minHeight: 240,
      marginTop: 16,
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      gap: 8,
    },
    secondaryButton: {
      flex: 1,
    },
    primaryButton: {
      flex: 1,
    },
  });
};

export default CoverLetterStep;
