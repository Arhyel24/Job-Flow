import { useState } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/ui/Text";
import ProgressChart from "../../components/dashboard/ProgressChart";
import UpcomingReminders from "../../components/dashboard/UpcomingReminders";
import { useTheme } from "../../context/themeContext";
import { ThemeColors } from "../../constants/colors";
import { useJobs } from "../../context/jobContext";

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { jobs, refreshJobs } = useJobs();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshJobs();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text variant="h1" weight="bold">
              Dashboard
            </Text>
          </View>
        </View>

        <Text variant="body" color="secondary" style={styles.subtitle}>
          Track and manage your job applications in one place
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text variant="h1" weight="bold" color="primary">
              {jobs.length}
            </Text>
            <Text variant="label" color="secondary">
              Total Applications
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text variant="h1" weight="bold" color="success">
              {jobs.filter((job) => job.status === "accepted").length}
            </Text>
            <Text variant="label" color="secondary">
              Accepted Offers
            </Text>
          </View>
        </View>

        <ProgressChart jobs={jobs} />
        <UpcomingReminders jobs={jobs} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      flex: 1,
    },
    subtitle: {
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: "row",
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 6,
      alignItems: "center",
      shadowColor: theme.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: theme.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });
};
