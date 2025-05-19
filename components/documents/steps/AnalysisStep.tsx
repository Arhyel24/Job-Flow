import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ProgressCircle } from "react-native-svg-charts";
import { CheckCircle, AlertCircle } from "lucide-react-native";
import { useTheme } from "../../../context/themeContext";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Text from "../../ui/Text";
import { useDocuments } from "../../../context/documentContext";

const AnalysisStep = () => {
  const { theme } = useTheme();
  const { resume, jobDescription, jobDescriptionFile, analysis, setAnalysis } =
    useDocuments();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    if (!resume || (!jobDescription && !jobDescriptionFile)) {
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockAnalysis = {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        strengths: [
          "Strong match for required skills",
          "Relevant work experience highlighted",
          "Good education background",
        ],
        weaknesses: [
          "Missing some keywords from job description",
          "Could emphasize leadership experience more",
          "Project details could be more specific",
        ],
        missingKeywords: ["TypeScript", "Agile", "CI/CD"],
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="h3" weight="bold" style={styles.title}>
        Resume Match Analysis
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        We'll analyze how well your resume matches the job description
      </Text>

      {!analysis ? (
        <Button
          title={isAnalyzing ? "Analyzing..." : "Analyze Resume Match"}
          onPress={runAnalysis}
          disabled={
            isAnalyzing || !resume || (!jobDescription && !jobDescriptionFile)
          }
          isLoading={isAnalyzing}
          style={styles.analyzeButton}
        />
      ) : (
        <View style={styles.analysisResults}>
          <View style={styles.scoreContainer}>
            <ProgressCircle
              style={styles.progressCircle}
              progress={analysis.score / 100}
              progressColor={theme.primary}
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
            />
            <Text variant="h1" weight="bold" style={styles.scoreText}>
              {analysis.score}%
            </Text>
            <Text variant="caption" color="secondary">
              Match Score
            </Text>
          </View>

          <View style={styles.feedbackSection}>
            <Text variant="h4" weight="bold" style={styles.feedbackTitle}>
              Strengths
            </Text>
            {analysis.strengths.map((strength, index) => (
              <View key={`strength-${index}`} style={styles.feedbackItem}>
                <CheckCircle size={16} color={theme.success} />
                <Text style={styles.feedbackText}>{strength}</Text>
              </View>
            ))}
          </View>

          <View style={styles.feedbackSection}>
            <Text variant="h4" weight="bold" style={styles.feedbackTitle}>
              Areas for Improvement
            </Text>
            {analysis.weaknesses.map((weakness, index) => (
              <View key={`weakness-${index}`} style={styles.feedbackItem}>
                <AlertCircle size={16} color={theme.error} />
                <Text style={styles.feedbackText}>{weakness}</Text>
              </View>
            ))}
          </View>

          <View style={styles.feedbackSection}>
            <Text variant="h4" weight="bold" style={styles.feedbackTitle}>
              Missing Keywords
            </Text>
            <View style={styles.keywordsContainer}>
              {analysis.missingKeywords.map((keyword, index) => (
                <View
                  key={`keyword-${index}`}
                  style={[
                    styles.keywordPill,
                    { backgroundColor: theme.primaryLight },
                  ]}
                >
                  <Text style={[styles.keywordText, { color: theme.primary }]}>
                    {keyword}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            variant="outline"
            title="Re-analyze"
            onPress={runAnalysis}
            style={styles.reanalyzeButton}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
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
  analyzeButton: {
    marginTop: 24,
  },
  analysisResults: {
    marginTop: 16,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressCircle: {
    height: 120,
    width: 120,
    marginBottom: 8,
  },
  scoreText: {
    position: "absolute",
    marginTop: 45,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackTitle: {
    marginBottom: 12,
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackText: {
    marginLeft: 8,
    flex: 1,
  },
  keywordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  keywordPill: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  keywordText: {
    fontSize: 14,
  },
  reanalyzeButton: {
    marginTop: 16,
  },
});

export default AnalysisStep;
