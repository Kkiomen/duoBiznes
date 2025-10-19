import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ErrorScreen } from '@/components/ui/error-screen';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { API_BASE_URL } from '@/constants/api';
import {Image} from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Logo SVG - wersja biała
const LOGO_SVG = `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <Image
                source={require('@/assets/images/logo_aisello_white.svg')}
                style={styles.logo}
                contentFit="contain"
              />
  <text x="10" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="300" fill="rgba(255,255,255,0.7)">
    AI Learning Platform
  </text>
</svg>`;

interface CoursePreview {
  id: number;
  title: string;
  description: string;
  icon: string;
  totalModules: number;
  totalLessons: number;
  estimatedHours: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<CoursePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Nie udało się pobrać kursów`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Błąd pobierania kursów:', err);
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania kursów');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses(true);
  };

  const handleCoursePress = (courseId: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/nowe');
  };

  // Loading state
  if (loading && courses.length === 0) {
    return <LoadingScreen message="Ładowanie kursów..." />;
  }

  // Error state
  if (error && courses.length === 0) {
    return <ErrorScreen error={error} onRetry={() => fetchCourses()} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1cb0f6"
          colors={['#1cb0f6']}
        />
      }
    >
      {/* Header z logo */}
      <View style={styles.header}>
          <Image
              source={require('@/assets/images/logo_aisello_white.svg')}
              style={styles.logo}
              contentFit="contain"
          />
        <ThemedText style={styles.tagline}>
          Ucz się biznesu z AI
        </ThemedText>
      </View>

      {/* Sekcja kursów */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>📚 Dostępne kursy</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Wybierz kurs i rozpocznij naukę
          </ThemedText>
        </View>

        {courses.map((course) => (
          <Pressable
            key={course.id}
            onPress={() => handleCoursePress(course.id)}
            style={({ pressed }) => [
              styles.courseCard,
              pressed && styles.courseCardPressed,
            ]}
          >
            <LinearGradient
              colors={['#1cb0f6', '#0e8ac7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.courseGradient}
            >
              <View style={styles.courseContent}>
                <ThemedText style={styles.courseIcon}>{course.icon}</ThemedText>
                <View style={styles.courseInfo}>
                  <ThemedText style={styles.courseTitle}>{course.title}</ThemedText>
                  <ThemedText style={styles.courseDescription}>
                    {course.description}
                  </ThemedText>
                  <View style={styles.courseStats}>
                    <View style={styles.courseStat}>
                      <ThemedText style={styles.courseStatIcon}>📖</ThemedText>
                      <ThemedText style={styles.courseStatText}>
                        {course.totalLessons} lekcji
                      </ThemedText>
                    </View>
                    <View style={styles.courseStat}>
                      <ThemedText style={styles.courseStatIcon}>⏱️</ThemedText>
                      <ThemedText style={styles.courseStatText}>
                        ~{course.estimatedHours}h
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <View style={styles.courseArrow}>
                  <ThemedText style={styles.courseArrowText}>→</ThemedText>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {/* Sekcja funkcjonalności dla firm */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>🏢 Dla Twojej firmy</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Dostępne wkrótce
          </ThemedText>
        </View>

        <View style={styles.featuresList}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>👥</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Zespoły</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Zarządzaj uczeniem się całego zespołu
              </ThemedText>
            </View>
            <View style={styles.comingSoonBadge}>
              <ThemedText style={styles.comingSoonText}>Wkrótce</ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>📊</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Raporty</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Śledź postępy i statystyki zespołu
              </ThemedText>
            </View>
            <View style={styles.comingSoonBadge}>
              <ThemedText style={styles.comingSoonText}>Wkrótce</ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>🎯</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>Własne kursy</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Twórz dedykowane materiały dla firmy
              </ThemedText>
            </View>
            <View style={styles.comingSoonBadge}>
              <ThemedText style={styles.comingSoonText}>Wkrótce</ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <ThemedText style={styles.featureIcon}>🤖</ThemedText>
            </View>
            <View style={styles.featureContent}>
              <ThemedText style={styles.featureTitle}>AI Mentor</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Osobisty asystent AI dla każdego pracownika
              </ThemedText>
            </View>
            <View style={styles.comingSoonBadge}>
              <ThemedText style={styles.comingSoonText}>Wkrótce</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.underConstructionBanner}>
          <ThemedText style={styles.constructionIcon}>🚧</ThemedText>
          <ThemedText style={styles.constructionText}>
            Funkcjonalności dla firm są w budowie
          </ThemedText>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(19 29 45)',
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },

  // Course cards
  courseCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  courseCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  courseGradient: {
    borderRadius: 16,
  },
  courseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  courseIcon: {
    fontSize: 48,
    lineHeight: 56,
  },
  courseInfo: {
    flex: 1,
    gap: 6,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  courseDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseStatIcon: {
    fontSize: 14,
  },
  courseStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  courseArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseArrowText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  // Features list
  featuresList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(28,176,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255,180,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,180,0,0.4)',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFB400',
    textTransform: 'uppercase',
  },

  // Under construction banner
  underConstructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255,75,75,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,75,75,0.2)',
  },
  constructionIcon: {
    fontSize: 20,
  },
  constructionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
logo: {
    width: 200,
    height: 80,
},
});
