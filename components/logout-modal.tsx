import React from "react";
import { Portal, Dialog, Text, Button } from "react-native-paper";
import { useTheme } from "../context/themeContext";

interface LogoutDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export default function LogoutDialog({
  visible,
  onDismiss,
  onConfirm,
}: LogoutDialogProps) {
  const { theme } = useTheme();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.card }}
      >
        <Dialog.Title style={{ color: theme.text.primary }}>
          Log Out
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: theme.text.secondary }}>
            Are you sure you want to log out of your account?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={theme.text.secondary}>
            Cancel
          </Button>
          <Button onPress={onConfirm} textColor={theme.primary}>
            Log Out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
