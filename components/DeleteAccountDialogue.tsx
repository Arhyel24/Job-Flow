import React from 'react';
import { Platform } from 'react-native';
import { Portal, Dialog, Text, Button } from 'react-native-paper';
import { useTheme } from '../context/themeContext';

interface DeleteAccountDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountDialog({
  visible,
  onDismiss,
  onConfirm,
}: DeleteAccountDialogProps){
  const { theme } = useTheme();

  if (Platform.OS === 'web') return null;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.card }}
      >
        <Dialog.Title style={{ color: theme.text.primary }}>
          Delete Account
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: theme.text.secondary }}>
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={theme.text.secondary}>
            Cancel
          </Button>
          <Button onPress={onConfirm} textColor={theme.error}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
