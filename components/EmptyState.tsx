import { View, StyleSheet } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import Text from './ui/Text';
import Button from './ui/Button';
import { useTheme } from '../context/themeContext';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  const { theme } = useTheme()
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <ClipboardList size={48} color={theme.primary} />}
      </View>
      <Text variant="h3" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>
      <Text color="secondary" align="center" style={styles.message}>
        {message}
      </Text>
      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    maxWidth: 300,
  },
  button: {
    minWidth: 150,
  },
});