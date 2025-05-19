import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FileImage, FileText } from "lucide-react-native";
import { useTheme } from "../../../context/themeContext";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Text from "../../ui/Text";
import { useDocuments } from "../../../context/documentContext";
import TabButton from "../../ui/TabButton";
import { ThemeColors } from "../../../constants/colors";

const JobDescriptionStep = () => {
  const { theme } = useTheme();
  const {
    jobDescription,
    setJobDescription,
    jobDescriptionFile,
    setJobDescriptionFile,
  } = useDocuments();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const styles = createStyles(theme);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        setJobDescriptionFile({
          id: Date.now().toString(),
          name: asset.name,
          type: asset.mimeType || "application/pdf",
          size: asset.size || 0,
          date: new Date().toISOString().substring(0, 10),
          uri: asset.uri,
          category: "job_description",
        });
      }
    } catch (error) {
      console.error("Error uploading job description:", error);
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" weight="bold" style={styles.title}>
        Add Job Description
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        Paste the job description text or upload the job posting
      </Text>

      <View style={styles.tabContainer}>
        <TabButton
          active={activeTab === "text"}
          onPress={() => setActiveTab("text")}
          icon={
            <FileText
              size={16}
              color={
                activeTab === "text" ? theme.primary : theme.text.secondary
              }
            />
          }
          title="Paste Text"
        />
        <TabButton
          active={activeTab === "file"}
          onPress={() => setActiveTab("file")}
          icon={
            <FileImage
              size={16}
              color={
                activeTab === "file" ? theme.primary : theme.text.secondary
              }
            />
          }
          title="Upload File"
        />
      </View>

      {activeTab === "text" ? (
        <TextInput
          style={[
            styles.textInput,
            { color: theme.text.primary, borderColor: theme.border },
          ]}
          multiline
          numberOfLines={8}
          placeholder="Paste the job description here..."
          placeholderTextColor={theme.text.secondary}
          value={jobDescription}
          onChangeText={setJobDescription}
        />
      ) : (
        <>
          {!jobDescriptionFile ? (
            <Button
              title="Select Job Description File"
              leftIcon={<FileImage size={20} color={theme.primary} />}
              onPress={handleFileUpload}
              style={styles.uploadButton}
            />
          ) : (
            <View style={styles.filePreview}>
              <View style={styles.fileInfo}>
                <FileImage size={24} color={theme.primary} />
                <View style={styles.fileDetails}>
                  <Text>{jobDescriptionFile.name}</Text>
                  <Text variant="caption" color="secondary">
                    {(jobDescriptionFile.size / 1024).toFixed(1)} KB
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
                  onPress={() => setJobDescriptionFile(null)}
                  size="small"
                  style={styles.removeButton}
                />
              </View>
            </View>
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
    textInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      textAlignVertical: "top",
      minHeight: 180,
      marginTop: 16,
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

export default JobDescriptionStep;
