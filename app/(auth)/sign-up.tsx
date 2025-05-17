import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Platform, KeyboardAvoidingView, ScrollView, Animated, Easing } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, User, UserPlus } from 'lucide-react-native';
import { supabase } from '../../utils/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Text from '../../components/ui/Text';
import { useTheme } from '../../context/themeContext';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '../../schemas/auth';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setFormLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;
      router.replace('/(tabs)/jobs');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setFormLoading(false);
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
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Animated.Image
            source={{ uri: 'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg' }}
            style={[
              styles.image,
              { transform: [{ scale: scaleAnim }] }
            ]}
          />
          <Text variant="h1" weight="bold" style={styles.title}>
            Create Account
          </Text>
          <Text color="secondary" style={styles.subtitle}>
            Sign up to start tracking your job search journey
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text color="secondary" style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<User size={20} color={theme.text.secondary} />}
                error={errors.fullName?.message}
              />
            )}
          />

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
                placeholder="Choose a password"
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
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            isLoading={formLoading}
            style={styles.button}
            leftIcon={<UserPlus size={20} color={theme.primary} />}
          />

          <View style={styles.footer}>
            <Text color="secondary">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Text color="primary" weight="medium">
                Sign In
              </Text>
            </Link>
          </View>
        </Animated.View>
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