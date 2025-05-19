import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";

const TabButton = ({
  active,
  onPress,
  icon,
  title,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        active && { backgroundColor: theme.primaryLight },
      ]}
      onPress={onPress}
    >
      <View style={styles.tabContent}>
        {icon}
        <Text style={[styles.tabText, active && { color: theme.primary }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TabButton;
