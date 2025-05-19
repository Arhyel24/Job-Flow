import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import { useTheme } from "../../../context/themeContext";
import { useDocuments } from "../../../context/documentContext";
import DeleteDocumentModal from "../../../components/DeleteDocumentModal";
import { Document } from "../../../types/document";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const [file, setFile] = useState<Document | null>(null);
  const styles = createStyles(theme);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const { getDocumentById, deleteDocument } = useDocuments();

  useEffect(() => {
    if (id) {
      const loadFile = async () => {
        const doc = await getDocumentById(id);
        setFile(doc || null);

        if (doc?.type === "application/pdf") {
          if (Platform.OS === "android") {
            const newPath = `${FileSystem.documentDirectory}${doc.name}`;
            await FileSystem.copyAsync({
              from: doc.uri,
              to: newPath,
            });
            setPdfUri(newPath);
          } else {
            setPdfUri(doc.uri);
          }
        }
      };
      loadFile();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!file) return;

    try {
      await Sharing.shareAsync(file.uri);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleOpenInExternalViewer = async () => {
    if (!pdfUri) return;

    if (Platform.OS === "android") {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: pdfUri,
          flags: 1,
          type: "application/pdf",
        });
      } catch (error) {
        console.error("Failed to open PDF:", error);
      }
    } else {
      await Sharing.shareAsync(pdfUri);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    if (file.type?.startsWith("image/")) {
      return (
        <Image
          source={{ uri: file.uri }}
          style={styles.preview}
          resizeMode="contain"
        />
      );
    } else if (file.type === "application/pdf") {
      if (!pdfUri) {
        return <Text>Loading PDF preview...</Text>;
      }

      if (Platform.OS === "ios") {
        return (
          <WebView
            originWhitelist={["*"]}
            source={{ uri: pdfUri }}
            style={styles.preview}
          />
        );
      } else {
        return (
          <View style={styles.pdfFallback}>
            <Text>PDF preview not available on this device</Text>
            <Button
              title="Open in PDF Viewer"
              onPress={handleOpenInExternalViewer}
              style={styles.openButton}
            />
          </View>
        );
      }
    } else {
      return <Text>Unsupported file format</Text>;
    }
  };

  if (!file) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.title}>
        {file.name}
      </Text>
      <Text style={styles.meta}>
        Type: {file.type || "Unknown"} | Size: {(file.size / 1024).toFixed(1)}{" "}
        KB
      </Text>

      {renderPreview()}

      <View style={styles.actions}>
        <Button title="Share" onPress={handleDownload} />
        {file.type === "application/pdf" && Platform.OS === "android" && (
          <Button title="Open in Viewer" onPress={handleOpenInExternalViewer} />
        )}
        <Button
          title="Delete"
          onPress={() => setDeleteVisible(true)}
          variant="outline"
        />
        <Button title="Back" onPress={() => router.back()} variant="outline" />
      </View>

      <DeleteDocumentModal
        visible={deleteVisible}
        onDismiss={() => setDeleteVisible(false)}
        onConfirm={async () => {
          await deleteDocument(id);
          setDeleteVisible(false);
          router.back();
        }}
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      marginBottom: 10,
      color: theme.text.primary,
    },
    meta: {
      color: theme.text.secondary,
      marginBottom: 20,
    },
    preview: {
      flex: 1,
      height: 400,
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: theme.card, // Add background for better visibility
    },
    pdfFallback: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: 400,
      marginBottom: 20,
    },
    openButton: {
      marginTop: 20,
    },
    actions: {
      flexDirection: "column",
      gap: 10,
    },
    loadingText: {
      textAlign: "center",
      marginTop: 100,
    },
  });
