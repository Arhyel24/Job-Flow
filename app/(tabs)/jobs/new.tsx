import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../../components/ui/Input';
import Text from '../../../components/ui/Text';
import Button from '../../../components/ui/Button';
import { useTheme } from '../../../context/themeContext';
import { addJob, createJob } from '../../../utils/storage';
import { JobStatus, jobStatusEnum } from '../../../constants/jobStatus';
import {
  Building2, BriefcaseIcon, MapPin, DollarSign, Calendar, Globe, User, Mail,
} from 'lucide-react-native';

const jobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title/role is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().optional(),
  dateApplied: z.string().nonempty("Date applied is required"),
  status: jobStatusEnum, 
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function NewJobModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: '',
      role: '',
      location: '',
      salary: '',
      dateApplied: new Date().toISOString().substring(0, 10),
      status: 'applied',
      url: '',
      notes: '',
      contactPerson: '',
      contactEmail: '',
    },
  });

  const onSubmit = async (values: JobFormData) => {
    try {
      const newJob = createJob({
        ...values,
        dateApplied: new Date(values.dateApplied).toISOString(),
      });
      await addJob(newJob);
      router.back();
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text variant="h3" weight="bold" style={styles.title}>Add New Job Application</Text>

        <View style={styles.form}>
          <Input
            label="Company"
            placeholder="Enter company name"
            error={errors.company?.message}
            {...register('company')}
            leftIcon={<Building2 size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Job Title/Role"
            placeholder="Enter job title or role"
            error={errors.role?.message}
            {...register('role')}
            leftIcon={<BriefcaseIcon size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Location"
            placeholder="Enter job location"
            error={errors.location?.message}
            {...register('location')}
            leftIcon={<MapPin size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Salary (Optional)"
            placeholder="Enter salary range"
            {...register('salary')}
            leftIcon={<DollarSign size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Date Applied"
            {...register('dateApplied')}
            leftIcon={<Calendar size={20} color={theme.text.secondary} />}
            {...(Platform.OS === 'web' ? { type: 'date' } : {})}
          />
          <Input
            label="Job URL (Optional)"
            placeholder="https://..."
            {...register('url')}
            error={errors.url?.message}
            autoCapitalize="none"
            keyboardType="url"
            leftIcon={<Globe size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Contact Person (Optional)"
            placeholder="Enter contact name"
            {...register('contactPerson')}
            leftIcon={<User size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Contact Email (Optional)"
            placeholder="Enter contact email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Mail size={20} color={theme.text.secondary} />}
          />
          <Input
            label="Notes (Optional)"
            placeholder="Add any notes about this job application"
            {...register('notes')}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <View style={styles.buttonsContainer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={styles.cancelButton}
            />
            <Button
              title="Save Application"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
    color: theme.text.primary,
  },
  form: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});
