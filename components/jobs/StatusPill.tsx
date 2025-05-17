import { View, StyleSheet } from 'react-native';
import Text from '../ui/Text';
import { useTheme } from '../../context/themeContext';
import { JobStatus } from '../../constants/jobStatus';

const statusColors = {
  applied: { bg: '#EFF6FF', text: '#2563EB' },
  interviewing: { bg: '#F0FDF4', text: '#16A34A' },
  offered: { bg: '#ECFDF5', text: '#059669' },
  accepted: { bg: '#ECFDF5', text: '#047857' },
  rejected: { bg: '#FEF2F2', text: '#DC2626' },
  declined: { bg: '#FFF7ED', text: '#EA580C' },
};

export default function StatusPill({ status, style }: { status: JobStatus; style?: any }) {
  const { theme } = useTheme();
  const colors = statusColors[status];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      <Text 
        variant="label" 
        style={[styles.text, { color: colors.text }]}
        weight="medium"
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
  },
});