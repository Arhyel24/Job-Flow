import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Text from "../../../../components/ui/Text";
import Button from "../../../../components/ui/Button";
import { useTheme } from "../../../../context/themeContext";
import { jobStatusEnum } from "../../../../constants/jobStatus";
import {
  Building2,
  BriefcaseIcon,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  User,
  Mail,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import { ThemeColors } from "../../../../constants/colors";
import { useJobs } from "../../../../context/jobContext";
import Input from "../../../../components/ui/Input";
import { JobApplication } from "../../../../types/jobs";

const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job title/role is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().optional(),
  dateApplied: z.string().nonempty("Date applied is required"),
  status: jobStatusEnum,
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function EditJobModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, handleUpdateJob } = useJobs();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      salary: "",
      dateApplied: new Date().toISOString().substring(0, 10),
      status: "applied",
      url: "",
      followUpDate: "".substring(0, 10),
      notes: "",
      contactPerson: "",
      contactEmail: "",
    },
  });

  useEffect(() => {
    const found = jobs.find((j) => j.id === id);
    if (found) {
      setJob(found);
    }
  }, [id, jobs]);

  useEffect(() => {
    if (job) {
      reset({
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        dateApplied: job.dateApplied.substring(0, 10),
        status: job.status,
        url: job.url,
        followUpDate: job?.followUpDate,
        notes: job.notes,
        contactPerson: job.contactPerson,
        contactEmail: job.contactEmail,
      });
    }
  }, [job, reset]);

  const onSubmit = async (values: JobFormData) => {
    if (!job) return;
    try {
      const updatedJob = {
        ...job,
        ...values,
        dateApplied: new Date(values.dateApplied).toISOString(),
      };

      await handleUpdateJob(updatedJob);
      router.back();
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  };

  const rawDateApplied = watch("dateApplied");

  const rawFollowUpDate = watch("followUpDate");
  const followUpValue = rawFollowUpDate ? new Date(rawFollowUpDate) : undefined;

  if (!job) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={theme.primary}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text variant="h3" weight="bold" style={styles.title}>
          Edit Job Application
        </Text>

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
              leftIcon={
                <BriefcaseIcon size={20} color={theme.text.secondary} />
              }
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
          value={format(new Date(rawDateApplied), "yyyy-MM-dd")}
          onPressIn={() => setShowDatePicker(true)}
          leftIcon={<Calendar size={20} color={theme.text.secondary} />}
          showSoftInputOnFocus={false}
          pointerEvents="none"
        />
        {showDatePicker && (
          <DateTimePicker
            value={new Date(rawDateApplied)}
            mode="date"
            display="default"
            onChange={(e, selected) => {
              setShowDatePicker(false);
              if (selected) setValue("dateApplied", selected.toISOString());
            }}
          />
        )}

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <View style={styles.inputWrapper}>
              <Text variant="label" style={styles.label}>
                Status
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={field.value}
                  onValueChange={field.onChange}
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

        <Input
          label="Follow-up Date (Optional)"
          value={followUpValue ? format(followUpValue, "yyyy-MM-dd") : ""}
          onPressIn={() => setShowFollowUpDatePicker(true)}
          leftIcon={<Calendar size={20} color={theme.text.secondary} />}
          showSoftInputOnFocus={false}
          pointerEvents="none"
        />
        {showFollowUpDatePicker && (
          <DateTimePicker
            value={followUpValue || new Date()}
            mode="date"
            display="default"
            onChange={(e, selected) => {
              setShowFollowUpDatePicker(false);
              if (selected) setValue("followUpDate", selected.toISOString());
            }}
          />
        )}

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
            title="Update Application"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
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
    textArea: {
      height: 100,
      textAlignVertical: "top",
      paddingTop: 8,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
      overflow: "hidden",
    },
    picker: {
      color: theme.text.primary,
      height: 48,
      paddingHorizontal: 10,
    },
  });
