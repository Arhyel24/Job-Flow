import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, ArrowLeft } from 'lucide-react-native';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTheme } from '../../context/themeContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeColors } from '../../constants/colors';

const features = [
  'Unlimited job applications',
  'Document storage & management',
  'Smart follow-up reminders',
  'AI-powered insights',
  'Automatic Google Drive backup',
  'Export data (PDF/CSV)',
];

export default function PremiumScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = createStyles(theme);

  const handleSubscribe = async (plan: 'monthly' | 'lifetime') => {
    // TODO: Implement payment processing
    console.log('Subscribe to plan:', plan);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="primary" />
        </TouchableOpacity>
        <Text variant="h1" weight="bold" style={styles.title}>
          Premium
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Crown size={64} color={theme.primary} />
          <Text variant="h2" weight="bold" style={styles.heroTitle}>
            Unlock Premium Features
          </Text>
          <Text color="secondary" align="center" style={styles.heroSubtitle}>
            Take your job search to the next level
          </Text>
        </View>

        <Card variant="elevated" style={styles.featuresCard}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            What's Included
          </Text>
          
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check size={20} color={theme.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.plansSection}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Choose Your Plan
          </Text>

          <View style={styles.plansContainer}>
            <Card
              variant="outline"
              style={[styles.planCard, { backgroundColor: theme.primaryLight }]}
            >
              <Text variant="h3" weight="bold" color="primary">
                $3/month
              </Text>
              <Text color="secondary" style={styles.planDescription}>
                Monthly subscription
              </Text>
              <Button
                title="Subscribe Monthly"
                onPress={() => handleSubscribe('monthly')}
                style={styles.planButton}
              />
            </Card>

            <Card
              variant="outline"
              style={[
                styles.planCard,
                { 
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                  borderWidth: 2
                }
              ]}
            >
              <View style={[
                styles.bestValueBadge,
                { 
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary
                }
              ]}>
                <Text
                  variant="caption"
                  weight="medium"
                  color="primary"
                  style={styles.bestValueText}
                >
                  BEST VALUE
                </Text>
              </View>
              <Text variant="h3" weight="bold" color="primary">
                $20
              </Text>
              <Text color="secondary" style={styles.planDescription}>
                Lifetime access
              </Text>
              <Button
                title="Get Lifetime Access"
                onPress={() => handleSubscribe('lifetime')}
                style={styles.planButton}
              />
            </Card>
          </View>
        </View>

        {Platform.OS !== 'web' && (
          <Text
            variant="caption"
            color="secondary"
            align="center"
            style={styles.disclaimer}
          >
            Payment will be charged to your {Platform.OS === 'ios' ? 'Apple' : 'Google'} account at confirmation of purchase
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginVertical: 32,
  },
  heroTitle: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    maxWidth: 300,
    textAlign: 'center',
  },
  featuresCard: {
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
  },
  plansSection: {
    marginBottom: 24,
  },
  plansContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  planCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    minHeight: 200,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  bestValueText: {
    color: theme.primary,
  },
  planDescription: {
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  planButton: {
    width: '100%',
  },
  disclaimer: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
});