import React from "react";
import { Portal, Dialog, Text, Button } from "react-native-paper";
import { useTheme } from "../context/themeContext";

interface DeleteDocumentModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export default function DeleteDocumentModal({
  visible,
  onDismiss,
  onConfirm,
}: DeleteDocumentModalProps) {
  const { theme } = useTheme();

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.card }}
      >
        <Dialog.Title style={{ color: theme.text.primary }}>
          Delete Document
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: theme.text.secondary }}>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={theme.text.secondary}>
            Cancel
          </Button>
          <Button onPress={onConfirm} textColor={theme.primary}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
