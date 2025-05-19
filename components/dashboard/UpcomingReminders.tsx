import { View, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Bell, ChevronRight } from "lucide-react-native";
import Card from "../../components/ui/Card";
import Text from "../../components/ui/Text";
import { JobApplication } from "../../types/jobs";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/themeContext";

interface UpcomingRemindersProps {
  jobs: JobApplication[];
}

export default function UpcomingReminders({ jobs }: UpcomingRemindersProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const jobsWithFollowUps = jobs
    .filter(
      (job) => job.followUpDate && new Date(job.followUpDate) >= new Date()
    )
    .sort((a, b) => {
      const dateA = new Date(a.followUpDate || 0);
      const dateB = new Date(b.followUpDate || 0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  const handleViewAll = () => {
    router.push("/(tabs)/jobs");
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3" weight="bold">
          Upcoming Follow-ups
        </Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAll}>
          <Text color="primary" weight="medium">
            View all
          </Text>
          <ChevronRight size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {jobsWithFollowUps.length > 0 ? (
        jobsWithFollowUps.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.reminderItem}
            onPress={() => router.push(`/(modals)/job/${job.id}`)}
          >
            <View style={styles.reminderIcon}>
              <Bell size={18} color={theme.primary} />
            </View>
            <View style={styles.reminderContent}>
              <Text weight="medium" numberOfLines={1}>
                {job.role} at {job.company}
              </Text>
              <Text variant="label" color="secondary">
                Follow up on{" "}
                {format(new Date(job.followUpDate!), "MMM d, yyyy")}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text color="secondary" style={styles.emptyText}>
            No upcoming follow-ups scheduled.
          </Text>
        </View>
      )}
    </Card>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      marginBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    viewAll: {
      flexDirection: "row",
      alignItems: "center",
    },
    reminderItem: {
      flexDirection: "row",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    reminderIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    reminderContent: {
      flex: 1,
    },
    emptyState: {
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      textAlign: "center",
    },
  });
