import { useTheme } from "../context/themeContext";
import Text from "../components/ui/Text";
import Toast from "react-native-toast-message";
import { StyleSheet, View } from "react-native";
import { CheckCircle, AlertCircle } from "lucide-react-native";

export default function ThemedToast() {
  const { theme } = useTheme();

  const toastConfig = {
    success: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: theme.success }]}>
        <CheckCircle size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.text1}>{text1}</Text>
          {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
        </View>
      </View>
    ),
    error: ({ text1, text2 }: any) => (
      <View style={[styles.toastContainer, { backgroundColor: theme.error }]}>
        <AlertCircle size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.text1}>{text1}</Text>
          {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
        </View>
      </View>
    ),
  };

  return <Toast config={toastConfig} />;
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  text1: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  text2: {
    color: "white",
    fontSize: 14,
    marginTop: 2,
  },
});
