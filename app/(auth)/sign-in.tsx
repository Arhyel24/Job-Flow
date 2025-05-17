import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { supabase } from '../../utils/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Text from '../../components/ui/Text';
import { useTheme } from '../../context/themeContext';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormData } from '../../schemas/auth';

export default function SignIn() {

  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      router.replace('/(tabs)/jobs');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg' }}
            style={styles.image}
          />
          <Text variant="h1" weight="bold" style={styles.title}>
            Welcome Back
          </Text>
          <Text color="secondary" style={styles.subtitle}>
            Sign in to continue tracking your job applications
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text color="secondary" style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Mail size={20} color={theme.text.secondary} />}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                leftIcon={<Lock size={20} color={theme.text.secondary} />}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text color="secondary">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Text color="primary" weight="medium">
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 32,
    },
    image: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 3,
      borderColor: theme.primaryLight,
      marginBottom: 24,
    },
    title: {
      marginBottom: 8,
      textAlign: 'center',
      color: theme.text.primary,
      fontSize: 28,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 32,
      color: theme.text.secondary,
      fontSize: 16,
      lineHeight: 24,
    },
    form: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 24,
      shadowColor: theme.shadow || '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
    googleButton: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 1,
      marginBottom: 16,
      height: 50,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      paddingHorizontal: 10,
      fontSize: 14,
    },
    button: {
      marginTop: 8,
      height: 50,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
      paddingVertical: 8,
    },
  });