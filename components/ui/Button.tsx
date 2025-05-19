import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/themeContext";
import { getColors } from "../../constants/colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  leftIcon,
  color,
  rightIcon,
  isLoading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const { isDarkMode } = useTheme();
  const colors = getColors(isDarkMode);

  const buttonStyles = [
    styles.base,
    styles[size],
    variant === "primary" && { backgroundColor: colors.primary },
    variant === "secondary" && { backgroundColor: colors.secondary },
    variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
    },
    variant === "ghost" && {
      backgroundColor: "transparent",
    },
    (disabled || isLoading) && { opacity: 0.5 },
    style,
  ];

  const textColor =
    variant === "primary"
      ? colors.text.white
      : variant === "secondary"
      ? colors.primary
      : variant === "outline"
      ? colors.primary
      : variant === "ghost"
      ? colors.text.primary
      : colors.text.disabled;

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      <View style={styles.content}>
        {leftIcon && !isLoading && (
          <View style={styles.iconLeft}>{leftIcon}</View>
        )}
        {isLoading ? (
          <ActivityIndicator
            color={variant === "primary" ? colors.text.white : colors.primary}
            size="small"
          />
        ) : (
          <Text
            weight="medium"
            color={color ? color : textColor}
            variant={size === "small" ? "caption" : "body"}
          >
            {title}
          </Text>
        )}
        {rightIcon && !isLoading && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
