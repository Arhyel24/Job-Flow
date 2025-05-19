import { useState } from "react";
import { View, StyleSheet } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { useTheme } from "../../context/themeContext";
import ResumeStep from "./steps/ResumeStep";
import JobDescriptionStep from "./steps/JobDescriptionStep";
import AnalysisStep from "./steps/AnalysisStep";
import CoverLetterStep from "./steps/CoverLetterStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import Button from "../ui/Button";
import { useDocuments } from "../../context/documentContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeColors } from "../../constants/colors";
import { ScrollView } from "react-native";

const DocumentWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();
  const { resume, jobDescription, jobDescriptionFile, analysis } =
    useDocuments();
  const styles = createStyles(theme);

  const labels = [
    "Upload Resume",
    "Job Description",
    "AI Analysis",
    "Cover Letter",
    "Confirmation",
  ];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: theme.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: theme.primary,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: theme.primary,
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: theme.primary,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: theme.primary,
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: theme.primary,
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <ResumeStep />;
      case 1:
        return <JobDescriptionStep />;
      case 2:
        return <AnalysisStep />;
      case 3:
        return <CoverLetterStep />;
      case 4:
        return <ConfirmationStep onComplete={onComplete} />;
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return !!resume;
      case 1:
        return !!jobDescription || !!jobDescriptionFile;
      case 2:
        return !!analysis;
      default:
        return true;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={5}
        />

        {renderCurrentStep()}

        <View style={styles.navigation}>
          {currentStep > 0 && (
            <Button
              variant="outline"
              title="Back"
              onPress={() => setCurrentStep(currentStep - 1)}
              style={styles.backButton}
            />
          )}
          {currentStep < 4 ? (
            <Button
              title="Next"
              onPress={() => canGoNext() && setCurrentStep(currentStep + 1)}
              disabled={!canGoNext()}
              style={styles.nextButton}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 20,
      paddingBottom: 180,
    },
    navigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginTop: 16,
      marginBottom: 36,
    },
    backButton: {
      flex: 1,
      marginRight: 8,
    },
    nextButton: {
      flex: 1,
      marginLeft: 8,
    },
  });
};

export default DocumentWizard;
