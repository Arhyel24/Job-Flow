import { View, StyleSheet } from "react-native";
import { FileText, FileUp, FileImage, Wand2 } from "lucide-react-native";
import { useTheme } from "../../../context/themeContext";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Text from "../../ui/Text";
import { useDocuments } from "../../../context/documentContext";
import { ThemeColors } from "../../../constants/colors";

const ConfirmationStep = ({ onComplete }: { onComplete: () => void }) => {
  const { theme } = useTheme();
  const {
    resume,
    jobDescription,
    jobDescriptionFile,
    analysis,
    coverLetter,
    coverLetterFile,
  } = useDocuments();
  const styles = createStyles(theme);

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" weight="bold" style={styles.title}>
        Review Your Documents
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        Please review all documents before submitting
      </Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <FileUp size={20} color={theme.primary} />
            <Text variant="body" weight="medium" style={styles.labelText}>
              Resume:
            </Text>
          </View>
          {resume ? (
            <Text style={styles.summaryValue}>{resume.name}</Text>
          ) : (
            <Text style={styles.missingText}>Not provided</Text>
          )}
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <FileImage size={20} color={theme.primary} />
            <Text variant="body" weight="medium" style={styles.labelText}>
              Job Description:
            </Text>
          </View>
          {jobDescriptionFile ? (
            <Text style={styles.summaryValue}>{jobDescriptionFile.name}</Text>
          ) : jobDescription ? (
            <Text
              style={styles.summaryValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {jobDescription.substring(0, 30)}...
            </Text>
          ) : (
            <Text style={styles.missingText}>Not provided</Text>
          )}
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <Wand2 size={20} color={theme.primary} />
            <Text variant="body" weight="medium" style={styles.labelText}>
              Analysis:
            </Text>
          </View>
          {analysis ? (
            <Text style={styles.summaryValue}>{analysis.score}% match</Text>
          ) : (
            <Text style={styles.missingText}>Not analyzed</Text>
          )}
        </View>

        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <FileText size={20} color={theme.primary} />
            <Text variant="body" weight="medium" style={styles.labelText}>
              Cover Letter:
            </Text>
          </View>
          {coverLetterFile ? (
            <Text style={styles.summaryValue}>{coverLetterFile.name}</Text>
          ) : coverLetter ? (
            <Text style={styles.summaryValue}>AI-generated cover letter</Text>
          ) : (
            <Text style={styles.missingText}>Not provided</Text>
          )}
        </View>
      </View>

      <Button
        title="Save & Finish"
        onPress={onComplete}
        style={styles.finishButton}
      />
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
    summaryContainer: {
      marginTop: 16,
    },
    summaryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    summaryLabel: {
      flexDirection: "row",
      alignItems: "center",
    },
    labelText: {
      marginLeft: 8,
    },
    summaryValue: {
      flex: 1,
      marginLeft: 16,
      textAlign: "right",
    },
    missingText: {
      flex: 1,
      marginLeft: 16,
      textAlign: "right",
      color: theme.text.secondary,
      fontStyle: "italic",
    },
    finishButton: {
      marginTop: 24,
    },
  });
};

export default ConfirmationStep;
