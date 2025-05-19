import Toast from "react-native-toast-message";
import DocumentWizard from "../../components/documents/DocumentWizard";
import { useRouter } from "expo-router";

export default function WizardModal() {
  const router = useRouter();
  const onComplete = () => {
    Toast.show({
      type: "success",
      text1: "Resume analysed successfully",
      text2:
        "You resume has been fully analysed, you are ready to ace that application!",
    });
    router.back();
  };
  return <DocumentWizard onComplete={onComplete} />;
}
