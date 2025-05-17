import React, { useRef, useState } from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useTheme } from '../../context/themeContext';
import Button from '../ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { MotiView, MotiText } from 'moti';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { ThemeColors } from '../../constants/colors';

const { width } = Dimensions.get('window');


const onboardingData = [
  {
    title: "Track your job applications in one place",
    description: "Centralize all your job search activities in a single, easy-to-use dashboard.",
    icon: "briefcase"
  },
  {
    title: "Stay organized and follow up easily",
    description: "Never miss an important deadline with our reminder system.",
    icon: "calendar"
  },
  {
    title: "Try free for 5 days",
    description: "Experience full features risk-free. Your data stays with you forever.",
    icon: "star"
  }
];

export default function OnboardingScreens({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<Carousel<any>>(null);

  const handleNext = () => {
    if (activeIndex < onboardingData.length - 1) {
      carouselRef.current?.snapToNext();
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({ item, index }: { item: typeof onboardingData[0], index: number }) => (
    <Animated.View 
      style={styles.slide}
      entering={FadeIn.delay(100).duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <MotiView
        from={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 200 }}
        style={styles.iconContainer}
      >
        <Feather name={item.icon as any} size={48} color={theme.primary} />
      </MotiView>

      <MotiText
        from={{ translateY: 50, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 500, delay: 300 }}
        style={styles.title}
      >
        {item.title}
      </MotiText>

      <MotiText
        from={{ translateY: 30, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 500, delay: 400 }}
        style={styles.description}
      >
        {item.description}
      </MotiText>
    </Animated.View>
  );

  return (
    <Animated.View 
      style={styles.container}
      entering={SlideInDown.duration(600)}
      exiting={SlideOutUp.duration(500)}
    >
      <Animated.View
        entering={FadeIn.delay(500).duration(600)}
        style={styles.skipButtonContainer}
      >
        <TouchableOpacity onPress={completeOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <Carousel
        ref={carouselRef}
        data={onboardingData}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={setActiveIndex}
      />
      
      <Animated.View 
        style={styles.pagination}
        entering={FadeIn.delay(700).duration(600)}
      >
        {onboardingData.map((_, index) => (
          <MotiView
            key={index}
            animate={{
              width: index === activeIndex ? 20 : 8,
              opacity: index === activeIndex ? 1 : 0.4,
              backgroundColor: index === activeIndex ? theme.primary : theme.text.secondary
            }}
            transition={{ type: 'spring', duration: 500 }}
            style={[styles.dot]}
          />
        ))}
      </Animated.View>
      
      <Animated.View
        entering={FadeIn.delay(800).duration(600)}
        style={styles.buttonContainer}
      >
        <Button
          title={activeIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingBottom: 40,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    backgroundColor: theme.primaryLight + '20',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: theme.text.primary,
    lineHeight: 32,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.text.secondary,
    lineHeight: 24,
    paddingHorizontal: 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    marginHorizontal: 24,
  },
  skipButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
  },
  skipText: {
    color: theme.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
});