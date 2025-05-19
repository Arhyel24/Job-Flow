export const lightThemeColors = {
  primary: "#3368F1",
  primaryLight: "#EBF0FF",
  secondary: "#26C2AE",
  secondaryLight: "#E6F8F6",
  accent: "#7B61FF",
  accentLight: "#F0ECFF",
  success: "#4CAF50",
  successLight: "#E8F5E9",
  warning: "#F5A623",
  warningLight: "#FFF4E5",
  error: "#F44336",
  errorLight: "#FEEBEA",
  background: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: {
    primary: "#1F2937",
    secondary: "#64748B",
    disabled: "#A1A1AA",
    white: "#FFFFFF",
    placeholder: "#A1A1AA",
    error: "#F44336",
    success: "#4CAF50",
  },
};

export const darkThemeColors = {
  primary: "#3B82F6",
  primaryLight: "#1E40AF",
  secondary: "#8B5CF6",
  secondaryLight: "#5B21B6",
  accent: "#10B981",
  accentLight: "#064E3B",
  success: "#03DAC6",
  successLight: "#14532D",
  warning: "#FBC02D",
  warningLight: "#78350F",
  error: "#EF4444",
  errorLight: "#7F1D1D",
  background: "#121212",
  card: "#1e1e1e",
  border: "#2c2c2c",
  text: {
    primary: "#E0E0E0",
    secondary: "#A0A0A0",
    disabled: "#52525B",
    white: "#FFFFFF",
    placeholder: "#71717A",
    error: "#EF4444",
    success: "#22C55E",
  },
};

export const getColors = (isDarkMode: boolean) =>
  isDarkMode ? darkThemeColors : lightThemeColors;

export type ThemeColors = typeof lightThemeColors;
