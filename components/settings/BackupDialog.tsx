import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/themeContext';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { ThemeColors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/authContext';
import { useBackup } from '../../utils/backup';

export default function BackupDialog() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const { createBackup, getBackupInfo } = useBackup();

  const [backupFile, setBackupFile] = useState<FileSystem.FileInfo | null>(null);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const [backupSize, setBackupSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [driveBackupInfo, setDriveBackupInfo] = useState<any>(null);
  const [uploadingToDrive, setUploadingToDrive] = useState(false);

  useEffect(() => {
    const prepareBackup = async () => {
      setLoading(true);
      try {
        // Prepare local backup
        const keys = await AsyncStorage.getAllKeys();
        const entries = await AsyncStorage.multiGet(keys);
        
        const backupData = entries.reduce<Record<string, string>>((acc, [key, value]) => {
          if (value !== null) { 
            acc[key] = value;
          }
          return acc;
        }, {});

        const json = JSON.stringify(backupData, null, 2);
        const fileUri = FileSystem.documentDirectory + 'jobflow_backup.json';
        
        await FileSystem.writeAsStringAsync(fileUri, json, {
          encoding: FileSystem.EncodingType.UTF8
        });

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        const fileSize = fileInfo.exists && fileInfo.size ? fileInfo.size : null;

        setBackupSize(fileSize);
        setBackupFile(fileInfo);

        const lastdate = await AsyncStorage.getItem('lastBackupDate');
        setLastBackupDate(lastdate ? new Date(lastdate) : null);

        // Get Google Drive backup info if logged in
        if (user) {
          const driveInfo = await getBackupInfo();
          setDriveBackupInfo(driveInfo);
        }

      } catch (error) {
        console.error('Error preparing backup:', error);
        setBackupSize(null);
        setLastBackupDate(null);
        setBackupFile(null);

        Toast.show({
          type: 'error',
          text1: 'Backup Error',
          text2: 'An error occurred while preparing the backup.',
        });
      } finally {
        setLoading(false);
      }
    };

    prepareBackup();
  }, [user]);

  const handleLocalBackup = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      await AsyncStorage.setItem('lastBackupDate', currentDate.toISOString());
      setLastBackupDate(currentDate);
      
      Toast.show({
        type: 'success',
        text1: 'Backup Successful',
        text2: 'Local backup created successfully.',
      });
    } catch (error) {
      console.error('Error creating local backup:', error);
      Toast.show({
        type: 'error',
        text1: 'Backup Error',
        text2: 'Failed to create local backup.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDriveBackup = async () => {
    if (!user) return;
    
    try {
      setUploadingToDrive(true);
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      
      const backupData = entries.reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== null) { 
          acc[key] = value;
        }
        return acc;
      }, {});

      const success = await createBackup(backupData);
      
      if (success) {
        const driveInfo = await getBackupInfo();
        setDriveBackupInfo(driveInfo);
        
        const currentDate = new Date();
        await AsyncStorage.setItem('lastBackupDate', currentDate.toISOString());
        setLastBackupDate(currentDate);
        
        Toast.show({
          type: 'success',
          text1: 'Backup Successful',
          text2: 'Backup uploaded to Google Drive successfully.',
        });
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Failed to upload backup to Google Drive.',
      });
    } finally {
      setUploadingToDrive(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDriveDate = (isoString: string | undefined) => {
    if (!isoString) return 'Never';
    return formatDistanceToNow(new Date(isoString), { addSuffix: true });
  };

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>Backup Options</Text>

      <Text style={styles.paragraph}>
        Safely store your job application data locally or in your Google Drive account. 
        Google Drive backup allows you to restore your data if you change devices.
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>Local Backup</Text>
            <Text style={styles.info}>
              Last Backup:{' '}
              {lastBackupDate
                ? formatDistanceToNow(lastBackupDate, { addSuffix: true })
                : 'Never'}
            </Text>
            <Text style={styles.info}>
              Backup Size: {formatFileSize(backupSize)}
            </Text>
            <Button 
              title="Create Local Backup" 
              onPress={handleLocalBackup} 
              style={styles.button} 
            />
          </View>

          {user ? (
            <View style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>Google Drive Backup</Text>
              <Text style={styles.info}>
                Last Drive Backup:{' '}
                {formatDriveDate(driveBackupInfo?.lastUpdated)}
              </Text>
              <Text style={styles.info}>
                Drive Backup Size: {formatFileSize(driveBackupInfo?.size)}
              </Text>
              <Text style={styles.info}>
                Stored on: {driveBackupInfo?.device || 'Unknown device'}
              </Text>
              <Button 
                title={uploadingToDrive ? "Uploading..." : "Backup to Google Drive"} 
                onPress={handleDriveBackup} 
                style={styles.button}
                disabled={uploadingToDrive}
              />
            </View>
          ) : (
            <View style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>Google Drive Backup</Text>
              <Text style={styles.info}>
                Sign in to enable Google Drive backups
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.background,
      flex: 1,
    },
    title: {
      marginBottom: 16,
      color: theme.text.primary,
    },
    paragraph: {
      marginBottom: 20,
      color: theme.text.secondary,
      lineHeight: 22,
    },
    section: {
      marginBottom: 30,
      padding: 15,
      backgroundColor: theme.card,
      borderRadius: 8,
    },
    sectionTitle: {
      marginBottom: 10,
      color: theme.text.primary,
    },
    info: {
      marginBottom: 8,
      color: theme.text.secondary,
    },
    button: {
      marginTop: 15,
    },
  });