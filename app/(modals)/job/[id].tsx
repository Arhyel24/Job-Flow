import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../../components/ui/Text';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import StatusPill from '../../../components/jobs/StatusPill';
import { updateJob } from '../../../utils/storage';
import { JobApplication } from '../../../types/jobs';
import { useTheme } from '../../../context/themeContext';
import { Building2, MapPin, DollarSign, Calendar, Globe, Mail, User, Clock, Edit, Trash, ChevronRight } from 'lucide-react-native';
import StatusSelector from '../../../components/jobs/StatusSelector'; 
import { ThemeColors } from '../../../constants/colors';
import DeleteJobDialogue from '../../../components/DeleteJobModal';
import Toast from 'react-native-toast-message';
import { useJobs } from '../../../context/jobContext';

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [deleteJobModalVisible, setDeleteJobModalVisible] = useState<boolean>(false)
  const { handleDeleteJob, jobs, handleUpdateJob } = useJobs()

  useEffect(() => {
    const loadJob = async () => {
      try {
        const foundJob = jobs.find(j => j.id === id);
        if (foundJob) {
          setJob(foundJob);
        } else {
          router.back();
        }
      } catch (error) {
        console.error('Error loading job:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, router]);



  const handleDeleteJobButton = async () => {
    await handleDeleteJob(id as string).finally(() => router.back())
  };

  const handleUpdateStatus = async (newStatus: JobApplication['status']) => {
    if (!job) return;
    
    try {
      const updatedJob = { ...job, status: newStatus };
      await handleUpdateJob(updatedJob);
      setJob(updatedJob);
    } catch (error) {
      console.error('Error updating job status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleEditJob = () => {
    // router.push(`/jobs/edit/${id}`);
    Toast.show({
      type: "info",
      text1: "Not Available",
      text2: "This feature is coming soon!"
    })
  };

  const handleOpenURL = (url?: string) => {
    url && Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text variant="h3">Job not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="h2" weight="bold" style={styles.title}>
              {job.role}
            </Text>
            <StatusPill status={job.status} style={styles.statusBadge} />
          </View>
          <Text style={styles.companyName}>{job.company}</Text>
        </View>

        {/* Main Content Card */}
        <Card style={styles.mainCard}>
          <View style={styles.section}>
            <DetailRow 
              icon={<Building2 size={18} color={theme.text.secondary} />}
              label="Company"
              value={job.company}
            />
            <DetailRow 
              icon={<MapPin size={18} color={theme.text.secondary} />}
              label="Location"
              value={job.location}
            />
            {job.salary && (
              <DetailRow 
                icon={<DollarSign size={18} color={theme.text.secondary} />}
                label="Salary"
                value={job.salary}
              />
            )}
            <DetailRow 
              icon={<Calendar size={18} color={theme.text.secondary} />}
              label="Applied Date"
              value={format(new Date(job.dateApplied), 'MMMM d, yyyy')}
            />
            {job.url && (
              <DetailRow 
                icon={<Globe size={18} color={theme.text.secondary} />}
                label="Job Posting"
                value={job.url}
                isLink
                onPress={() => handleOpenURL(job.url)}
              />
            )}
          </View>

          {/* Contact Section */}
          {(job.contactPerson || job.contactEmail) && (
            <View style={[styles.section, styles.sectionWithBorder]}>
              <Text variant="h4" weight="medium" style={styles.sectionTitle}>
                Contact Information
              </Text>
              {job.contactPerson && (
                <DetailRow 
                  icon={<User size={18} color={theme.text.secondary} />}
                  label="Contact Person"
                  value={job.contactPerson}
                />
              )}
              {job.contactEmail && (
                <DetailRow 
                  icon={<Mail size={18} color={theme.text.secondary} />}
                  label="Email"
                  value={job.contactEmail}
                  isLink
                  onPress={() => Linking.openURL(`mailto:${job.contactEmail}`)}
                />
              )}
            </View>
          )}

          {/* Follow Up Section */}
          {job.followUpDate && (
            <View style={[styles.section, styles.sectionWithBorder]}>
              <Text variant="h4" weight="medium" style={styles.sectionTitle}>
                Follow Up
              </Text>
              <DetailRow 
                icon={<Clock size={18} color={theme.text.secondary} />}
                label="Scheduled Date"
                value={format(new Date(job.followUpDate), 'MMMM d, yyyy')}
              />
            </View>
          )}

          {/* Notes Section */}
          {job.notes && (
            <View style={[styles.section, styles.sectionWithBorder]}>
              <Text variant="h4" weight="medium" style={styles.sectionTitle}>
                Notes
              </Text>
              <Text style={styles.notesText}>{job.notes}</Text>
            </View>
          )}
        </Card>

        {/* Status Update Section */}
        <View style={styles.statusSection}>
          <Text variant="h4" weight="medium" style={styles.sectionTitle}>
            Update Application Status
          </Text>
          <StatusSelector 
            currentStatus={job.status}
            onSelect={handleUpdateStatus}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Details"
            variant="outline"
            color={theme.text.primary}
            leftIcon={<Edit size={18} color={theme.text.primary} />}
            style={styles.actionButton}
            onPress={handleEditJob}
          />
          <Button
            title="Delete"
            variant="outline"
            color={theme.error}
            leftIcon={<Trash size={18} color={theme.error} />}
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => setDeleteJobModalVisible(true)}
          />
        </View>
      </ScrollView>
      <DeleteJobDialogue visible={ deleteJobModalVisible } onDismiss={() => setDeleteJobModalVisible(false)} onConfirm={handleDeleteJobButton}/>
    </SafeAreaView>
  );
}

const DetailRow = ({ icon, label, value, isLink = false, onPress }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={styles.detailContent}>
        <Text variant="label" color="secondary" style={styles.detailLabel}>
          {label}
        </Text>
        <TouchableOpacity onPress={onPress} disabled={!isLink && !onPress}>
          <Text 
            style={[
              styles.detailValue,
              isLink && styles.linkText,
              isLink && { color: theme.primary }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value}
            {isLink && <ChevronRight size={16} color={theme.primary} style={styles.linkChevron} />}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.background,
  },
  backButton: {
    marginTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 12,
    color: theme.text.primary,
  },
  companyName: {
    fontSize: 18,
    color: theme.text.secondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  mainCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  section: {
    padding: 20,
  },
  sectionWithBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.text.primary,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    marginBottom: 2,
  },
  detailValue: {
    color: theme.text.primary,
  },
  linkText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkChevron: {
    marginLeft: 4,
  },
  notesText: {
    color: theme.text.primary,
    lineHeight: 22,
  },
  statusSection: {
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: theme.error,
    color: theme.error,
  },
});