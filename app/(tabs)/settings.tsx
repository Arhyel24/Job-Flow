import { Platform, ScrollView, StyleSheet, Image, TouchableOpacity, View, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../components/ui/Text';
import { Bell, ChevronRight, CloudDownload, CloudUpload, FileText, Info, LogOut, MessageSquarePlus, Moon, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import { useTheme } from '../../context/themeContext';
import { Link, useRouter } from 'expo-router';
import { ThemeColors } from '../../constants/colors';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/authContext';
import LogoutDialog from '../../components/logout-modal'
import DeleteAccountDialog from '../../components/DeleteAccountDialogue';
import { addDays, differenceInDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text weight="medium">{title}</Text>
        {subtitle && (
          <Text variant="caption" color="secondary">
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (onPress && <ChevronRight size={20} color={theme.text.secondary} />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter()
  const { logout, deleteAccount } = useAuth()
  const [daysRemaining, setDaysRemaining] = useState(0)

  const [logutDialogue, setLogoutDialogue] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
      async function fetchOrSetTargetDate() {
        try {
          let storedDate = await AsyncStorage.getItem('targetDate');
  
          if (!storedDate) {
            const newTargetDate = addDays(new Date(), 30);
            storedDate = newTargetDate.toISOString();
            await AsyncStorage.setItem('targetDate', storedDate);
          }
  
          const targetDate = new Date(storedDate);
          const today = new Date();
  
          const diff = differenceInDays(targetDate, today);
  
          setDaysRemaining(diff);
        } catch (error) {
          console.error('Error fetching or setting target date:', error);
          setDaysRemaining(0);
        }
      }
  
      fetchOrSetTargetDate();
    }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text variant="h3" weight="bold">
                John Doe
              </Text>
              <Text color="secondary">john@example.com</Text>
            </View>
          </View>
          
          <View style={styles.trialInfo}>
            <Text variant="label" color="primary" weight="medium">
              Trial Period: {daysRemaining} days remaining
            </Text>
            <Button
              title="Upgrade to Premium"
              size="small"
              onPress={() => {()=> router.push("/(modals)/premium")}}
              style={styles.upgradeButton}
            />
          </View>
        </Card>

        <Card variant="outline" style={styles.card}>
          <Text variant="label" weight="medium" color="secondary" style={styles.sectionTitle}>
            Preferences
          </Text>
          <SettingItem
            icon={<Bell size={20} color={theme.primary} />}
            title="Notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.border, true: theme.primaryLight }}
                thumbColor={notifications ? theme.primary : '#f4f3f4'}
              />
            }
          />
          <SettingItem
            icon={<Moon size={20} color={theme.primary} />}
            title="Dark Mode"
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primaryLight }}
                thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
              />
            }
          />
        </Card>

        <Text variant="h4" weight="medium" color="secondary" style={styles.sectionTitle}>
          Data Management
        </Text>

        <Card variant="outline" style={styles.card}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(modals)/backup')}>
            <CloudUpload size={24} color={theme.primary} />
            <View style={styles.menuItemContent}>
              <Text weight="medium">Backup to Google Drive</Text>
              <Text variant="caption" color="secondary">
                Securely store your data
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(modals)/restore')}>
            <CloudDownload size={24} color={theme.primary} />
            <View style={styles.menuItemContent}>
              <Text weight="medium">Restore from Backup</Text>
              <Text variant="caption" color="secondary">
                Recover your previous data
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </Card>

        <Text variant="h4" weight="medium" color="secondary" style={styles.sectionTitle}>
          Help & Support
        </Text>

        <Card variant="outline" style={styles.card}>
          <Link href="/(modals)/feature-request" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <MessageSquarePlus size={24} color={theme.primary} />
            <View style={styles.menuItemContent}>
              <Text weight="medium">Request a Feature</Text>
              <Text variant="caption" color="secondary">
                Suggest new functionality
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>
          </Link>

          <Link href="/(modals)/privacy" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <FileText size={24} color={theme.primary} />
            <View style={styles.menuItemContent}>
              <Text weight="medium">Privacy Policy</Text>
              <Text variant="caption" color="secondary">
                Read our privacy policy
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>
          </Link>

          <Link href="/(modals)/about" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Info size={24} color={theme.primary} />
              <View style={styles.menuItemContent}>
                <Text weight="medium">About the App</Text>
                <Text variant="caption" color="secondary">
                  Version 1.0.0
                </Text>
              </View>
              <ChevronRight size={20} color={theme.text.secondary} />
            </TouchableOpacity>
          </Link>
        </Card>

        <Text variant="h4" weight="medium" color="secondary" style={styles.sectionTitle}>
          Account
        </Text>

        <Card variant="outline" style={styles.card}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteDialogVisible(true)}>
            <Trash2 size={24} color={theme.error} />
            <View style={styles.menuItemContent}>
              <Text weight="medium" color="error">Delete Account</Text>
              <Text variant="caption" color="secondary">
                Permanently delete your account
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setLogoutDialogue(true)}>
            <LogOut size={24} color={theme.error} />
            <View style={styles.menuItemContent}>
              <Text weight="medium" color="error">Log Out</Text>
              <Text variant="caption" color="secondary">
                Sign out of your account
              </Text>
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text variant="caption" color="secondary" align="center">
            © 2025 Job Tracker. All rights reserved.
          </Text>
        </View>
      </ScrollView>
      <LogoutDialog
        visible={logutDialogue}
        onDismiss={() => setLogoutDialogue(false)}
        onConfirm={() => {
          setLogoutDialogue(false);
          logout();
        }}
      />
      <DeleteAccountDialog
        visible={deleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        onConfirm={() => {
          setDeleteDialogVisible(false);
          deleteAccount();
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    profileCard: {
      marginBottom: 24,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    trialInfo: {
      flexDirection: "column",
      backgroundColor: theme.primaryLight,
      padding: 12,
      borderRadius: 8,
      justifyContent: 'space-between',
      gap: 10,
    },
    upgradeButton: {
      minWidth: 120,
    },
    sectionTitle: {
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    card: {
      marginBottom: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuItemContent: {
      flex: 1,
      marginLeft: 12,
    },
    footer: {
      marginVertical: 24,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingIcon: {
      marginRight: 12,
      width: 24,
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
    },
  });


//   import { Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Text from '../../../components/ui/Text';
// import { Bell, ChevronRight, HelpCircle, LogOut, Mail, Moon, Trash2, User } from 'lucide-react-native';
// import { useState } from 'react';
// import { clearAllJobs } from '../../../utils/storage';
// import Card from '../../../components/ui/Card';
// import { useTheme } from '../../../context/themeContext';
// import { useRouter } from 'expo-router';
// import { supabase } from '../../../utils/supabase';





// export default function SettingsScreen() {
//   const { theme, isDarkMode, toggleTheme } = useTheme();
//   const styles = createStyles(theme);
//   const [notifications, setNotifications] = useState(true);
//   const router  = useRouter()

//   const handleClearData = async () => {
//     if (Platform.OS === 'web') {
//       if (confirm('Are you sure you want to clear all job data? This cannot be undone.')) {
//         await clearAllJobs();
//         alert('All job data has been cleared');
//       }
//     } else {
//       await clearAllJobs();
//     }
//   };
  
//   const daysRemaining = 5; // TODO: Calculate from user registration date

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.replace('/(auth)/sign-in');
//   };

//   const handleDeleteAccount = () => {
//     if (Platform.OS === 'web') {
//       if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
//         // TODO: Implement account deletion
//       }
//     }
//   };

//   const handleBackup = async () => {
//     // TODO: Implement Google Drive backup
//   };

//   const handleRestore = async () => {
//     // TODO: Implement backup restoration
//   };

//   const handleFeatureRequest = () => {
//     // TODO: Implement feature request submission
//   };

//   const openPrivacyPolicy = () => {
//     WebBrowser.openBrowserAsync('https://example.com/privacy');
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <View style={styles.header}>
//         <Text variant="h1" weight="bold">
//           Settings
//         </Text>
//       </View>

//       <ScrollView style={styles.content}>
//         <Card variant="outline" style={styles.card}>
//           <Text variant="label" weight="medium" color="secondary" style={styles.sectionTitle}>
//             Account
//           </Text>
//           <SettingItem
//             icon={<User size={20} color={theme.primary} />}
//             title="Profile"
//             subtitle="Manage your account information"
//             onPress={() => console.log('Navigate to profile')}
//           />
//           <SettingItem
//             icon={<Mail size={20} color={theme.primary} />}
//             title="Email"
//             subtitle="user@example.com"
//           />
//         </Card>

//         <Card variant="outline" style={styles.card}>
//           <Text variant="label" weight="medium" color="secondary" style={styles.sectionTitle}>
//             Preferences
//           </Text>
//           <SettingItem
//             icon={<Bell size={20} color={theme.primary} />}
//             title="Notifications"
//             rightElement={
//               <Switch
//                 value={notifications}
//                 onValueChange={setNotifications}
//                 trackColor={{ false: theme.border, true: theme.primaryLight }}
//                 thumbColor={notifications ? theme.primary : '#f4f3f4'}
//               />
//             }
//           />
//           <SettingItem
//             icon={<Moon size={20} color={theme.primary} />}
//             title="Dark Mode"
//             rightElement={
//               <Switch
//         value={isDarkMode}
//         onValueChange={toggleTheme}
//         trackColor={{ false: theme.border, true: theme.primaryLight }}
//         thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
//       />
//             }
//           />
//         </Card>

//         <Card variant="outline" style={styles.card}>
//           <Text variant="label" weight="medium" color="secondary" style={styles.sectionTitle}>
//             Data
//           </Text>
//           <SettingItem
//             icon={<Trash2 size={20} color={theme.error} />}
//             title="Clear All Data"
//             subtitle="Delete all your job applications"
//             onPress={handleClearData}
//           />
//         </Card>

//         <Card variant="outline" style={styles.card}>
//           <Text variant="label" weight="medium" color="secondary" style={styles.sectionTitle}>
//             Support
//           </Text>
//           <SettingItem
//             icon={<HelpCircle size={20} color={theme.primary} />}
//             title="Help & Support"
//             onPress={() => router.replace('/settings/help')}
//           />
//         </Card>

//         <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Log out')}>
//           <LogOut size={20} color={theme.error} style={styles.logoutIcon} />
//           <Text color="error" weight="medium">
//             Log Out
//           </Text>
//         </TouchableOpacity>

//         <Text variant="caption" color="secondary" style={styles.version}>
//           Version 1.0.0
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const createStyles = (theme: any) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.background,
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginTop: 8,
//       marginBottom: 16,
//       paddingHorizontal: 16,
//     },
//     content: {
//       paddingHorizontal: 16,
//     },
//     card: {
//       marginBottom: 16,
//     },
//     sectionTitle: {
//       marginBottom: 8,
//       paddingHorizontal: 4,
//     },
//     settingItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingVertical: 12,
//       borderBottomWidth: 1,
//       borderBottomColor: theme.border,
//     },
//     settingIcon: {
//       marginRight: 12,
//       width: 24,
//       alignItems: 'center',
//     },
//     settingContent: {
//       flex: 1,
//     },
//     logoutButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginTop: 24,
//       marginBottom: 8,
//       padding: 12,
//     },
//     logoutIcon: {
//       marginRight: 8,
//     },
//     version: {
//       textAlign: 'center',
//       marginBottom: 40,
//     },
//   });
