import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import Text from "../../components/ui/Text";
import { ThemeColors } from "../../constants/colors";
import { Document } from "../../types/document";
import DocumentListView from "../../components/documents/DocumentListView";
import { useDocuments } from "../../context/documentContext";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

export default function DocumentsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const { documents, addDocument } = useDocuments();

  const handleDocumentPick = async (type: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        addDocument({
          id: Date.now().toString(),
          name: asset.name,
          type: asset.mimeType || "application/pdf",
          size: asset.size || 0,
          uri: asset.uri,
          date: new Date().toISOString().split("T")[0],
          category: type,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handlePreview = (doc: Document) => console.log("Preview", doc.name);
  const handleDownload = (doc: Document) => console.log("Download", doc.name);

  return (
    <SafeAreaView style={styles(theme).container} edges={["top"]}>
      <View style={styles(theme).header}>
        <Text variant="h1" weight="bold">
          Documents
        </Text>
      </View>

      <ScrollView style={styles(theme).content}>
        <DocumentListView
          documents={documents}
          onUpload={handleDocumentPick}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onWizardStart={() => router.push("/(modals)/wizard")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    viewToggleActive: {
      backgroundColor: theme.primary,
    },
    listContainer: {
      flex: 1,
    },
    documentsCard: {
      marginBottom: 16,
    },
    documentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    documentInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    documentDetails: {
      flex: 1,
      marginLeft: 12,
    },
    documentName: {
      marginBottom: 4,
    },
    documentMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    documentActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      marginRight: 8,
    },
    emptyState: {
      alignItems: "center",
      padding: 24,
      marginBottom: 16,
    },
    emptyTitle: {
      marginVertical: 8,
    },
    ctaButton: {
      marginTop: 16,
      minWidth: 200,
    },
    actionsContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      marginBottom: 16,
    },
    documentTypeCard: {
      marginBottom: 12,
    },
    documentTypeContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
    },
    documentTypeText: {
      flex: 1,
      marginLeft: 12,
    },
  });
