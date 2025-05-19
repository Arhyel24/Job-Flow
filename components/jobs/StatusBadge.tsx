import { View, StyleSheet } from "react-native";
import Text from "../../components/ui/Text";
import { JobStatus, useStatusConfig } from "../../constants/jobStatus";

interface StatusBadgeProps {
  status: JobStatus;
  size?: "small" | "medium";
}

export default function StatusBadge({
  status,
  size = "medium",
}: StatusBadgeProps) {
  const { statusConfig } = useStatusConfig();
  const { color, background, label } = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: background }, styles[size]]}>
      <Text
        variant={size === "small" ? "caption" : "label"}
        style={[styles.text, { color }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontFamily: "Inter-Medium",
  },
});
