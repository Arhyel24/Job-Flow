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

export default function BackupDialog() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [backupFile, setBackupFile] = useState<FileSystem.FileInfo | null>(null);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const [backupSize, setBackupSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prepareBackup = async () => {
      setLoading(true);
      try {
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
        const fileSize = fileInfo.exists && fileInfo.size ? fileInfo.size :  null;
  
        setBackupSize(fileSize);
        setBackupFile(fileInfo);

        const lastdate = await AsyncStorage.getItem('lastBackupDate');
        setLastBackupDate(new Date(lastdate ?? Date.now()));
  
      } catch (error) {
        console.error('Error preparing backup:', error);
        setBackupSize(null);
        setLastBackupDate(null);
        setBackupFile(null)

        Toast.show({
          type: 'error',
          text1: 'Backup Error',
          text2: 'An error occurred while creating the backup.',
        });
      } finally {
        setLoading(false);
      }
    };
  
    prepareBackup();
  }, []);

  const handleBackup = async () => {
    if (!backupFile) {
      Toast.show({
        type: 'error',
        text1: 'No Backup',
        text2: 'Please create a backup before uploading.',
      });
      return;
    }
  
    try {
      // Your Google Drive upload logic here...
  
      
      const now = new Date();
      await AsyncStorage.setItem('lastBackupDate', now.toISOString());
      setLastBackupDate(now);
      
      Toast.show({
        type: 'success',
        text1: 'Upload Complete',
        text2: 'Backup uploaded to Google Drive.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'There was a problem uploading the file.',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>Backup to Google Drive</Text>

      <Text style={styles.paragraph}>
        Safely store your job application data in your Google Drive account. This allows you to restore your data if you change devices.
      </Text>
      
      {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <>
              <Text style={styles.info}>
                Last Backup:{' '}
                {lastBackupDate
                  ? formatDistanceToNow(lastBackupDate, { addSuffix: true })
                  : 'No backup found'}
              </Text>

              <Text style={styles.info}>
                Backup Size: {backupSize ? `${(backupSize / 1024).toFixed(2)} KB` : 'N/A'}
              </Text>

              <Button title="Backup Now" onPress={handleBackup} style={styles.button} />
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
    info: {
      marginBottom: 10,
      color: theme.text.secondary,
    },
    button: {
      marginTop: 20,
    },
  });
