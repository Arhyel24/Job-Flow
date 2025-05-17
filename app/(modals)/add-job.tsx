import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { useTheme } from '../../context/themeContext';
import { addJob, createJob } from '../../utils/storage';
import { JobStatus, jobStatusEnum } from '../../constants/jobStatus';
import {
  Building2, BriefcaseIcon, MapPin, DollarSign, Calendar, Globe, User, Mail,
} from 'lucide-react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import { ThemeColors } from '../../constants/colors';

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

  const [showDatePicker, setShowDatePicker] = useState(false);

const rawDateApplied = watch('dateApplied');

const dateAppliedValue = rawDateApplied ? new Date(rawDateApplied) : new Date();

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('dateApplied', selectedDate.toDateString());
    }
  };

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
    <Controller
      control={control}
      name="company"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Company"
          placeholder="Enter company name"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.company?.message}
          leftIcon={<Building2 size={20} color={theme.text.secondary} />}
        />
      )}
    />
    <Controller
      control={control}
      name="role"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Job Title/Role"
          placeholder="Enter job title or role"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.role?.message}
          leftIcon={<BriefcaseIcon size={20} color={theme.text.secondary} />}
        />
      )}
    />
    <Controller
      control={control}
      name="location"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Location"
          placeholder="Enter job location"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.location?.message}
          leftIcon={<MapPin size={20} color={theme.text.secondary} />}
        />
      )}
    />
    <Controller
      control={control}
      name="salary"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Salary (Optional)"
          placeholder="Enter salary range"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.salary?.message}
          leftIcon={<DollarSign size={20} color={theme.text.secondary} />}
        />
      )}
    />
        <Input
          label="Date Applied"
          value={dateAppliedValue ? format(dateAppliedValue, 'yyyy-MM-dd') : ''}
          onPressIn={() => setShowDatePicker(true)}
              leftIcon={<Calendar size={20} color={theme.text.secondary} />}
          showSoftInputOnFocus={false} 
          pointerEvents="none"
        />

        {showDatePicker && (
          <DateTimePicker
            value={dateAppliedValue || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={new Date()}
        />
        )}
        
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrapper}>
              <Text variant="label" style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                  dropdownIconColor={theme.text.secondary}
                >
                  <Picker.Item label="Applied" value="applied" />
                  <Picker.Item label="Interviewing" value="interviewing" />
                  <Picker.Item label="Offered" value="offered" />
                  <Picker.Item label="Rejected" value="rejected" />
                  <Picker.Item label="Accepted" value="accepted" />
                  <Picker.Item label="Declined" value="declined" />
                </Picker>
              </View>
            </View>
          )}
        />
        <Controller
          control={control}
          name="url"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Job URL (Optional)"
              placeholder="https://..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.url?.message}
              autoCapitalize="none"
              keyboardType="url"
              leftIcon={<Globe size={20} color={theme.text.secondary} />}
            />
          )}
        />
        <Controller
          control={control}
          name="contactPerson"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contact Person (Optional)"
              placeholder="Enter contact name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.contactPerson?.message}
              leftIcon={<User size={20} color={theme.text.secondary} />}
            />
          )}
        />
        <Controller
          control={control}
          name="contactEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contact Email (Optional)"
              placeholder="Enter contact email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.contactEmail?.message}
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={<Mail size={20} color={theme.text.secondary} />}
            />
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Notes (Optional)"
              placeholder="Add any notes about this job application"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.notes?.message}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          )}
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
  </ScrollView>
</KeyboardAvoidingView>

  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
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
  inputWrapper: {
    marginBottom: 16,
  },
  
  label: {
    color: theme.text.primary,
    marginBottom: 6,
    fontSize: 16,
  },
  
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.background,
    overflow: 'hidden',
  },
  
  picker: {
    color: theme.text.primary,
    height: 48,
    paddingHorizontal: 10,
  },
  pickerItem: {
    color: theme.text.primary,
    fontSize: 16,
  },
});
