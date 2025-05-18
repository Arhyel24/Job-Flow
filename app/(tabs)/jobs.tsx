import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, RelativePathString, useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import Text from '../../components/ui/Text';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/EmptyState';
import { JobApplication } from '../../types/jobs';
import { searchJobs } from '../../utils/jobUtils';
import { useTheme } from '../../context/themeContext';
import { useJobs } from '../../context/jobContext';
import { ThemeColors } from '../../constants/colors';

const JobsScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { jobs, refreshJobs } = useJobs();

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredJobs(searchJobs(jobs, searchQuery));
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchQuery, jobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshJobs();
    setRefreshing(false);
  };

  const handleAddJob = () => {
    router.push('/(modals)/add-job');
  };

  const handleJobPress = (job: JobApplication) => {
    router.push(`/(modals)/job/${job.id}` as RelativePathString)
  };

  const styles = createStyles(theme)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Applications
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={theme.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredJobs.reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard job={item} onPress={handleJobPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Applications Yet"
            message="Start tracking your job applications by adding your first job"
            action={{
              label: 'Add Your First Job',
              onPress: handleAddJob,
            }}
          />
        }
      />
      {jobs.length > 0 && 
        <Link href="/(modals)/add-job" asChild>
          <TouchableOpacity style={styles.fab} >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </Link>
      }
    </SafeAreaView>
  );
};

const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 16,
    },
    searchContainer: {
      paddingHorizontal: 16,
      marginVertical: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 44,
      color: theme.text.primary,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 120,
      flexGrow: 1,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });
}

export default JobsScreen;
