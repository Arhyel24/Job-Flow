import {
  Text as RNText,
  StyleSheet,
  TextProps as RNTextProps,
} from "react-native";
import { useTheme } from "../../context/themeContext";
import { lightThemeColors } from "../../constants/colors";

interface TextProps extends RNTextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "label" | "caption";
  color?: keyof typeof lightThemeColors.text | string;
  weight?: "regular" | "medium" | "bold";
  align?: "left" | "center" | "right";
}

export default function Text({
  children,
  variant = "body",
  color = "primary",
  weight = "regular",
  align = "left",
  style,
  ...props
}: TextProps) {
  const { theme } = useTheme();
  const styles = createStyles();

  const resolvedColor =
    typeof color === "string" && color in theme.text
      ? theme.text[color as keyof typeof theme.text]
      : color;

  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        styles[weight],
        { color: resolvedColor, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const createStyles = () =>
  StyleSheet.create({
    base: {
      fontFamily: "Inter-Regular",
    },
    h1: {
      fontSize: 28,
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      lineHeight: 26,
    },
    h4: {
      fontSize: 17,
      lineHeight: 22,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
    regular: {
      fontFamily: "Inter-Regular",
    },
    medium: {
      fontFamily: "Inter-Medium",
    },
    bold: {
      fontFamily: "Inter-Bold",
    },
  });
