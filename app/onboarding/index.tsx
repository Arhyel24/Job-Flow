import { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, CheckCircle2, Timer } from 'lucide-react-native';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import { lightThemeColors as colors, ThemeColors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/themeContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Track your job applications in one place',
    description: 'Keep all your job applications organized and never miss an opportunity',
    icon: <FileText size={80} color={colors.primary} />,
  },
  {
    id: '2',
    title: 'Stay organized and follow up easily',
    description: 'Get reminders for follow-ups and keep track of your application status',
    icon: <CheckCircle2 size={80} color={colors.primary} />,
  },
  {
    id: '3',
    title: 'Try free for 5 days. Then keep your data.',
    description: 'Experience all premium features free for 5 days',
    icon: <Timer size={80} color={colors.primary} />,
  },
];

const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem('@onboarding_completed', 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { theme } = useTheme()
  const styles = createStyles(theme)

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text variant="h2" weight="bold" style={styles.title}>
        {item.title}
      </Text>
      <Text color="secondary" align="center" style={styles.description}>
        {item.description}
      </Text>
    </View>
  );

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding()
      router.replace('/(auth)/sign-up');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />

        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/sign-up')}
            style={styles.skipButton}
          >
            <Text color="secondary">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    slide: {
      width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    iconContainer: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    description: {
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    footer: {
      padding: 24,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: theme.primary,
      width: 16,
    },
    button: {
      marginBottom: 16,
    },
    skipButton: {
      alignItems: 'center',
    },
  })
}