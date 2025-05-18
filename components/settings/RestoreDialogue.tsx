import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/themeContext';
import Text from '../ui/Text';
import Button from '../ui/Button';
import { useRouter } from 'expo-router';
import { useBackup } from '../../utils/backup';
import { useAuth } from '../../context/authContext';
import Toast from 'react-native-toast-message';
import { formatDistanceToNow } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobApplication } from '../../types/jobs';

const JOBS_STORAGE_KEY = 'jobtracker_jobs';
const LAST_SYNC_KEY = 'jobtracker_last_sync';
const PENDING_CHANGES_KEY = 'jobtracker_pending_changes';

export default function RestoreDialog() {
  const { theme } = useTheme();
  const router = useRouter();
  const { restoreBackup, getBackupInfo } = useBackup();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [backupInfo, setBackupInfo] = useState<{
    lastUpdated?: string;
    size?: number;
    device?: string;
    appVersion?: string;
  } | null>(null);

  useEffect(() => {
    const fetchBackupInfo = async () => {
      setLoading(true);
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }

        const info = await getBackupInfo();
        setBackupInfo(info);
      } catch (error) {
        console.error('Failed to fetch backup info:', error);
        Toast.show({
          type: 'error',
          text1: 'Backup Error',
          text2: 'Failed to check for backups',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBackupInfo();
  }, [user]);

  const handleRestore = async () => {
    if (!user) return;
  
    setRestoring(true);
    try {
      const result = await restoreBackup();
  
      if (result && result.appData) {
        const backupJobs: JobApplication[] = result.appData.jobs || [];

        const existingJobsRaw = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
        const existingJobs: JobApplication[] = existingJobsRaw ? JSON.parse(existingJobsRaw) : [];
  
        const existingJobIds = new Set(existingJobs.map(job => job.id));
  
        const newJobs = backupJobs.filter(job => !existingJobIds.has(job.id));
  
        const mergedJobs = [...newJobs, ...existingJobs];
  
        await Promise.all([
          AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(mergedJobs)),
          AsyncStorage.setItem(LAST_SYNC_KEY, result.appData.lastSync || new Date().toISOString()),
          AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(result.appData.pendingChanges || [])),
        ]);
  
        Toast.show({
          type: 'success',
          text1: 'Restore Successful',
          text2: `Restored backup from ${formatDate(result.metadata.lastUpdated)}`,
        });
  
        setTimeout(() => router.back(), 1500);
      } else {
        throw new Error('No valid backup data found');
      }
    } catch (error) {
      console.error('Restore failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Restore Failed',
        text2: 'Could not restore from backup',
      });
    } finally {
      setRestoring(false);
    }
  };
  

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Unknown date';
    return formatDistanceToNow(new Date(isoString), { addSuffix: true });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
      ) : !user ? (
        <>
          <Text variant="h3" style={{ color: theme.text.primary, marginBottom: 20 }}>
            Sign In Required
          </Text>
          <Text style={{ color: theme.text.secondary, marginBottom: 30, textAlign: 'center' }}>
            You need to sign in with Google to access your cloud backups
          </Text>
          <Button 
            title="Close" 
            onPress={() => router.back()} 
            variant="primary" 
          />
        </>
      ) : !backupInfo ? (
        <>
          <Text variant="h3" style={{ color: theme.text.primary, marginBottom: 20 }}>
            No Backup Found
          </Text>
          <Text style={{ color: theme.text.secondary, marginBottom: 30, textAlign: 'center' }}>
            We couldn't find any backup in your Google Drive
          </Text>
          <Button 
            title="Close" 
            onPress={() => router.back()} 
            variant="primary" 
          />
        </>
      ) : (
        <>
          <Text variant="h3" style={{ color: theme.text.primary, marginBottom: 20 }}>
            Restore from Google Drive
          </Text>

          <View style={styles.backupInfo}>
            <Text style={{ color: theme.text.secondary, marginBottom: 8 }}>
              Last backup: {formatDate(backupInfo.lastUpdated)}
            </Text>
            <Text style={{ color: theme.text.secondary, marginBottom: 8 }}>
              Backup size: {formatFileSize(backupInfo.size)}
            </Text>
            <Text style={{ color: theme.text.secondary, marginBottom: 8 }}>
              Created on: {backupInfo.device || 'Unknown device'}
            </Text>
            <Text style={{ color: theme.text.secondary, marginBottom: 16 }}>
              App version: {backupInfo.appVersion || 'Unknown version'}
            </Text>
          </View>

          <Text style={[styles.warning, { color: theme.warning }]}>
            Warning: Restoring will overwrite your current jobs, sync status, and pending changes
          </Text>

          <Button 
            title={restoring ? "Restoring..." : "Restore Now"} 
            onPress={handleRestore} 
            disabled={restoring}
          />
          <Button 
            title="Close" 
            onPress={() => router.back()} 
            variant="outline" 
            style={{ marginTop: 10 }} 
          />
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
  backupInfo: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  warning: {
    marginBottom: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});