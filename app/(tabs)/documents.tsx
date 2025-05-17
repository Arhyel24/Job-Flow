import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, Upload, Eye, Download, Lock, FileUp, FileImage, ExternalLink } from 'lucide-react-native';
import Text from '../../components/ui/Text';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../context/themeContext';
import PremiumModal from '../../components/premium/PremiumModal';
import { ThemeColors } from '../../constants/colors';
import { useRouter } from 'expo-router';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
}

const DOCUMENT_TYPES = [
  {
    id: 'resume',
    title: 'Upload Resume (PDF)',
    description: 'Store your resume for this application',
    icon: FileUp,
    premium: true
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter',
    description: 'Attach or generate a cover letter',
    icon: FileText,
    premium: true
  },
  {
    id: 'job-description',
    title: 'Job Description',
    description: 'Screenshot or PDF of job posting',
    icon: FileImage,
    premium: false
  }
];

export default function DocumentsScreen() {
  const { theme } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isPremium] = useState(false); // TODO: Replace with actual premium status check
  const styles = createStyles(theme);
  const router = useRouter()

  const handleDocumentPick = async (type: string) => {
    if (DOCUMENT_TYPES.find(t => t.id === type)?.premium && !isPremium) {
      router.push("/(modals)/premium")
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        setDocuments(prev => [...prev, {
          id: Date.now().toString(),
          name: asset.name,
          type: asset.mimeType || 'application/pdf',
          size: asset.size || 0,
          uri: asset.uri,
        }]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handlePreview = (document: Document) => {
    Platform.OS === 'web' 
      ? window.open(document.uri, '_blank')
      : Linking.openURL(document.uri); // TODO: Implement proper native preview
  };

  const handleDownload = (document: Document) => {
    // TODO: Implement download functionality
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Documents
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Card variant="elevated" style={styles.uploadSection}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Add Documents
          </Text>
          
          {DOCUMENT_TYPES.map((docType) => (
            <TouchableOpacity
              key={docType.id}
              style={styles.documentTypeCard}
              onPress={() => handleDocumentPick(docType.id)}
              disabled={docType.premium && !isPremium}
            >
              <View style={styles.documentTypeContent}>
                <docType.icon size={24} color={theme.primary} />
                <View style={styles.documentTypeText}>
                  <Text weight="medium">{docType.title}</Text>
                  <Text variant="caption" color="secondary">
                    {docType.description}
                  </Text>
                </View>
                {docType.premium && !isPremium && (
                  <Lock size={16} color={theme.text.secondary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {documents.length > 0 ? (
          <Card variant="elevated" style={styles.documentsSection}>
            <Text variant="h3" weight="bold" style={styles.sectionTitle}>
              Your Documents
            </Text>
            {documents.map(doc => (
              <View key={doc.id} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <FileText size={20} color={theme.primary} />
                  <View style={styles.documentDetails}>
                    <Text numberOfLines={1}>{doc.name}</Text>
                    <Text variant="caption" color="secondary">
                      {(doc.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                </View>
                <View style={styles.documentActions}>
                  <TouchableOpacity
                    onPress={() => handlePreview(doc)}
                    style={styles.actionButton}
                  >
                    <Eye size={20} color={theme.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDownload(doc)}
                    style={styles.actionButton}
                  >
                    <Download size={20} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Card>
        ) : (
          <Card variant="elevated" style={styles.emptyState}>
            <Lock size={48} color={theme.text.secondary} />
            <Text variant="h3" weight="bold" style={styles.emptyTitle}>
              {isPremium ? 'No Documents Yet' : 'Premium Feature'}
            </Text>
            <Text color="secondary" align="center">
              {isPremium 
                ? 'Upload your first document to get started'
                : 'Upgrade to Premium to store and manage your documents'}
            </Text>
            <Button
              title={isPremium ? "Upload Document" : "Upgrade to Premium"}
              onPress={isPremium 
                ? () => handleDocumentPick('resume') 
                : () => router.push("/(modals)/premium")}
              style={styles.ctaButton}
            />
          </Card>
        )}

        <View style={styles.previewOptions}>
          <Text variant="h4" weight="medium" style={styles.previewTitle}>
            Preview Options
          </Text>
          <View style={styles.previewButtons}>
            <Button
              variant="outline"
              title="In-App Preview"
              leftIcon={<Eye size={16} color={theme.primary} />}
              onPress={() => {}}
              style={styles.previewButton}
            />
            <Button
              variant="outline"
              title="Open Externally"
              leftIcon={<ExternalLink size={16} color={theme.primary} />}
              onPress={() => {}}
              style={styles.previewButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeColors) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    uploadSection: {
      marginBottom: 16,
      padding: 16,
    },
    documentsSection: {
      marginBottom: 16,
      padding: 16,
    },
    sectionTitle: {
      marginBottom: 16,
    },
    documentTypeCard: {
      marginBottom: 12,
    },
    documentTypeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    documentTypeText: {
      flex: 1,
      marginLeft: 12,
    },
    documentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    documentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    documentDetails: {
      flex: 1,
      marginLeft: 12,
    },
    documentActions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: 8,
      marginLeft: 4,
    },
    emptyState: {
      alignItems: 'center',
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
    previewOptions: {
      marginBottom: 24,
    },
    previewTitle: {
      marginBottom: 12,
    },
    previewButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    previewButton: {
      flex: 1,
    },
  });