import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/ui/Text";
import {
  Bell,
  ChevronRight,
  CloudDownload,
  CloudUpload,
  FileText,
  Info,
  LogOut,
  MessageSquarePlus,
  Moon,
  Lock,
} from "lucide-react-native";
import { useState } from "react";
import Card from "../../components/ui/Card";
import { useTheme } from "../../context/themeContext";
import { Link, useRouter } from "expo-router";
import { ThemeColors } from "../../constants/colors";
import { useAuth } from "../../context/authContext";
import LogoutDialog from "../../components/logout-modal";
import Button from "../../components/ui/Button";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  disabled = false,
}: SettingItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.settingItem, disabled && styles.disabledItem]}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text weight="medium" style={disabled ? styles.disabledText : {}}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color={disabled ? "disabled" : "secondary"}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement ||
        (onPress && !disabled && (
          <ChevronRight size={20} color={theme.text.secondary} />
        ))}
      {disabled && <Lock size={16} color={theme.text.disabled} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();
  const { signOut, loading, signIn, user } = useAuth();

  const [logutDialogue, setLogoutDialogue] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : user ? (
              <>
                <Image
                  source={{
                    uri:
                      user.photo ||
                      "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text variant="h3" weight="bold" style={styles.name}>
                    {user.name}
                  </Text>
                  <Text color="secondary" style={styles.email}>
                    {user.email}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.loginContainer}>
                <Text variant="body" style={styles.loginText}>
                  You're not logged in.
                </Text>
                <Button
                  title="Continue with Google"
                  variant="primary"
                  onPress={signIn}
                  leftIcon={
                    <Image
                      source={require("../../assets/icons/google-icon.png")}
                      style={styles.googleIcon}
                    />
                  }
                  disabled={loading}
                  style={styles.loginButton}
                />
              </View>
            )}
          </View>
        </Card>

        <Text
          variant="h4"
          weight="medium"
          color="secondary"
          style={styles.sectionTitle}
        >
          Data Management
        </Text>

        <View style={styles.dataManagementContainer}>
          <Card variant="outline" style={styles.card}>
            {!user && (
              <View style={styles.overlayContainer}>
                <View style={styles.overlay} />
                <View style={styles.overlayContent}>
                  <Lock size={24} color={theme.text.secondary} />
                  <Text weight="medium" style={styles.overlayText}>
                    Login to use this feature
                  </Text>
                </View>
              </View>
            )}
            <SettingItem
              icon={
                <CloudUpload
                  size={20}
                  color={user ? theme.primary : theme.text.disabled}
                />
              }
              title="Backup to Google Drive"
              subtitle="Securely store your data"
              onPress={user ? () => router.push("/(modals)/backup") : undefined}
              disabled={!user}
            />

            <SettingItem
              icon={
                <CloudDownload
                  size={20}
                  color={user ? theme.primary : theme.text.disabled}
                />
              }
              title="Restore from Backup"
              subtitle="Recover your previous data"
              onPress={
                user ? () => router.push("/(modals)/restore") : undefined
              }
              disabled={!user}
            />
          </Card>
        </View>

        <Card variant="outline" style={styles.card}>
          <Text
            variant="label"
            weight="medium"
            color="secondary"
            style={styles.sectionTitle}
          >
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
                thumbColor={notifications ? theme.primary : "#f4f3f4"}
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
                thumbColor={isDarkMode ? theme.primary : "#f4f3f4"}
              />
            }
          />
        </Card>

        <Text
          variant="h4"
          weight="medium"
          color="secondary"
          style={styles.sectionTitle}
        >
          Help & Support
        </Text>

        <Card variant="outline" style={styles.card}>
          <Link href="/(modals)/feature-request" asChild>
            <SettingItem
              icon={<MessageSquarePlus size={20} color={theme.primary} />}
              title="Request a Feature"
              subtitle="Suggest new functionality"
            />
          </Link>

          <Link href="/(modals)/privacy" asChild>
            <SettingItem
              icon={<FileText size={20} color={theme.primary} />}
              title="Privacy Policy"
              subtitle="Read our privacy policy"
            />
          </Link>

          <Link href="/(modals)/about" asChild>
            <SettingItem
              icon={<Info size={20} color={theme.primary} />}
              title="About the App"
              subtitle="Version 1.0.0"
            />
          </Link>
        </Card>

        {user && (
          <>
            <Text
              variant="h4"
              weight="medium"
              color="secondary"
              style={styles.sectionTitle}
            >
              Account
            </Text>

            <Card variant="outline" style={styles.card}>
              <SettingItem
                icon={<LogOut size={20} color={theme.error} />}
                title="Log Out"
                subtitle="Sign out of your account"
                onPress={() => setLogoutDialogue(true)}
              />
            </Card>
          </>
        )}

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
          signOut();
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
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: 16,
    },
    sectionTitle: {
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    card: {
      marginBottom: 8,
    },
    dataManagementContainer: {
      position: "relative",
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.background,
      opacity: 0.8,
    },
    overlayContent: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    overlayText: {
      marginLeft: 8,
      color: theme.text.primary,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
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
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    disabledItem: {
      opacity: 0.6,
    },
    disabledText: {
      color: theme.text.disabled,
    },
    settingIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    settingContent: {
      flex: 1,
    },
    profileCard: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.card,
      marginBottom: 24,
      marginTop: 16,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
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
    name: {
      color: theme.text.primary,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.text.secondary,
    },
    loginContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    loginText: {
      marginBottom: 8,
      color: theme.text.secondary,
    },
    loginButton: {
      alignSelf: "center",
    },
    googleIcon: {
      width: 18,
      height: 18,
      marginRight: 8,
    },
  });
