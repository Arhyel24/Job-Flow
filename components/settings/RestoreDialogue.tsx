import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/themeContext';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { useRouter } from 'expo-router';

export default function RestoreDialog() {
  const { theme } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [backupSize, setBackupSize] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching backup info (e.g., from Google Drive)
    const fetchBackupInfo = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

      // Dummy data – replace with real API call later
      setLastBackupDate('April 15, 2025');
      setBackupSize('2.3 MB');
      setLoading(false);
    };

    fetchBackupInfo();
  }, []);

  const handleRestore = () => {
    // TODO: Implement actual restore logic
    alert('Restoring from backup...');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, color: theme.text.secondary }}>
            Checking for backup on Google Drive...
          </Text>
        </>
      ) : (
        <>
          <Text variant="h3" style={{ color: theme.text.primary, marginBottom: 20 }}>
            Restore from Google Drive
          </Text>

          <Text style={{ color: theme.text.secondary, marginBottom: 10 }}>
            Last backup: {lastBackupDate}
          </Text>
          <Text style={{ color: theme.text.secondary, marginBottom: 30 }}>
            Backup size: {backupSize}
          </Text>

          <Button title="Restore Now" onPress={handleRestore} />
          <Button title="Close" onPress={() => router.back()} variant="outline" style={{ marginTop: 10 }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
