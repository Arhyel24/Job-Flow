import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../components/ui/Text';
import ProgressChart from '../../components/dashboard/ProgressChart';
import UpcomingReminders from '../../components/dashboard/UpcomingReminders';
import { getJobs } from '../../utils/storage';
import { JobApplication } from '../../types/jobs';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/themeContext';
import { ThemeColors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays, differenceInDays } from 'date-fns';

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const [daysRemaining, setDaysRemaining] = useState(0)

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

  const loadJobs = async () => {
    const loadedJobs = await getJobs();
    setJobs(loadedJobs);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleAddJob = () => {
    router.push('/jobs/new');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <View style={styles.trialBadge}>
            <Text variant="caption" color="primary" weight="medium">
              {daysRemaining} days left in trial
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
              {jobs.filter(job => job.status === 'accepted').length}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    title: {
      flex: 1,
    },
    subtitle: {
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 6,
      alignItems: 'center',
      shadowColor: theme.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    
  trialBadge: {
    backgroundColor: theme.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  })
}