import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Building2, MapPin } from 'lucide-react-native';
import StatusBadge from './StatusBadge';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { useTheme } from '../../context/themeContext';
import { JobApplication } from '../../types/jobs';

interface JobCardProps {
  job: JobApplication;
  onPress: (job: JobApplication) => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(job)}
      style={styles.container}
    >
      <Card variant="elevated" style={styles.card}>
        <View style={styles.mainContent}>
          <View style={styles.textContent}>
            <Text weight="bold" style={styles.title} numberOfLines={1}>
              {job.role}
            </Text>
            <View style={styles.metaRow}>
              <Building2 size={14} color={theme.text.secondary} />
              <Text style={styles.companyText} numberOfLines={1}>
                {job.company}
              </Text>
              {job.location && (
                <>
                  <View style={styles.dotSeparator} />
                  <MapPin size={14} color={theme.text.secondary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {job.location}
                  </Text>
                </>
              )}
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <StatusBadge status={job.status} />
            <ChevronRight size={18} color={theme.text.secondary} />
          </View>
        </View>

        <View style={styles.footer}>
          <Calendar size={14} color={theme.text.secondary} />
          <Text style={styles.dateText}>
            {format(new Date(job.dateApplied), 'MMM d, yyyy')}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    card: {
      padding: 14,
      borderRadius: 10,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    mainContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    textContent: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      color: theme.text.primary,
      marginBottom: 4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    companyText: {
      fontSize: 13,
      color: theme.text.secondary,
      marginLeft: 4,
      marginRight: 6,
    },
    locationText: {
      fontSize: 13,
      color: theme.text.secondary,
      marginLeft: 4,
      maxWidth: 100,
    },
    dotSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.text.tertiary,
      marginHorizontal: 6,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 12,
      color: theme.text.secondary,
      marginLeft: 4,
    },
  });