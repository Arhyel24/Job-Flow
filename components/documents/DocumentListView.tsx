import React from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Button from "../ui/Button";
import Text from "../ui/Text";
import {
  Download,
  ChevronRight,
  FileUp,
  FileText,
  FileImage,
  LayoutGrid,
  Share,
} from "lucide-react-native";
import { useTheme } from "../../context/themeContext";
import { Document } from "../../types/document";
import EmptyState from "../EmptyState";
import { router } from "expo-router";

interface Props {
  documents: Document[];
  onUpload: (type: string) => void;
  onDownload: (doc: Document) => void;
  onWizardStart: () => void;
}

const DocumentListView: React.FC<Props> = ({
  documents,
  onUpload,
  onDownload,
  onWizardStart,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        ListEmptyComponent={
          <EmptyState
            title="No Documents Yet"
            message="Upload your first document to get started"
            action={{
              label: "Upload Document",
              onPress: () => onUpload("resume"),
            }}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.wizardCard}>
              <View style={styles.wizardContent}>
                <View style={styles.wizardTextContent}>
                  <Text variant="h4" weight="bold" style={styles.wizardTitle}>
                    Need help with your documents?
                  </Text>
                  <Text color="secondary" style={styles.wizardDescription}>
                    Our document wizard will guide you through creating
                    professional documents
                  </Text>
                </View>
                <Button
                  title="Start Wizard"
                  onPress={onWizardStart}
                  leftIcon={<LayoutGrid size={20} color={theme.secondary} />}
                  style={styles.wizardButton}
                />
              </View>
            </View>

            <Text variant="h4" weight="bold" style={styles.documentsTitle}>
              Your Documents
            </Text>
          </>
        }
        ListFooterComponent={
          <Button
            title="Upload New Document"
            onPress={() => onUpload("resume")}
            style={styles.uploadButton}
          />
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.documentsCard}
        renderItem={({ item, index }) => {
          const Icon = item.type.includes("pdf")
            ? FileUp
            : item.type.includes("word")
            ? FileText
            : FileImage;

          const isLastItem = index === documents.length - 1;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.documentItem,
                !isLastItem && styles.documentItemBorder,
              ]}
              onPress={() => router.push(`/(modals)/docs/${item.id}`)}
            >
              <View style={styles.documentInfo}>
                <View style={styles.iconContainer}>
                  <Icon size={20} color={theme.primary} />
                </View>
                <View style={styles.documentDetails}>
                  <Text numberOfLines={1} style={styles.documentName}>
                    {item.name}
                  </Text>
                  <View style={styles.documentMeta}>
                    <Text variant="caption" color="secondary">
                      {(item.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.documentActions}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  style={styles.actionButton}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Share size={20} color={theme.primary} />
                </TouchableOpacity>
                <ChevronRight size={20} color={theme.text.secondary} />
              </View>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  wizardCard: {
    marginBottom: 16,
  },
  wizardContent: {
    padding: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  wizardTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  wizardTitle: {
    marginBottom: 4,
    textAlign: "center",
  },
  wizardDescription: {
    lineHeight: 20,
    textAlign: "center",
  },
  wizardButton: {
    minWidth: 120,
  },
  documentsCard: {
    marginBottom: 16,
    overflow: "hidden",
  },
  documentsTitle: {
    padding: 8,
    paddingBottom: 8,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  documentItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  documentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    marginBottom: 4,
    fontWeight: "500",
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
    padding: 32,
    borderRadius: 12,
  },
  emptyTitle: {
    marginVertical: 12,
  },
  ctaButton: {
    marginTop: 20,
    minWidth: 200,
  },
  uploadButton: {
    marginTop: 8,
  },
});

export default DocumentListView;
