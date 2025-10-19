import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SkillNode } from '@/components/ui/skill-node';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ErrorScreen } from '@/components/ui/error-screen';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCourse } from '@/contexts/CourseContext';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';

// Mapowanie kolorów dla różnych typów lekcji
const lessonColors = ['green', 'blue', 'purple', 'yellow', 'pink', 'orange'] as const;
type LessonColor = typeof lessonColors[number];

export default function SkillsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { course, loading, error, retry, initialLoadComplete, refresh } = useCourse();
  const c = Colors[colorScheme].candy;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Loading state
  if (loading && !initialLoadComplete) {
    return <LoadingScreen message="Ładowanie ścieżki nauki..." />;
  }

  // Error state
  if (error && !course) {
    return <ErrorScreen error={error} onRetry={retry} />;
  }

  // Brak danych
  if (!course) {
    return <LoadingScreen message="Ładowanie..." />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#F8FAFC' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colorScheme === 'dark' ? '#1cb0f6' : '#1cb0f6'}
          colors={['#1cb0f6']}
        />
      }
    >
      <LinearGradient
        colors={colorScheme === 'dark'
          ? ['#0B1220', '#1a1f35', '#0B1220']
          : ['#F8FAFC', '#E0F2FE', '#F8FAFC']
        }
        style={styles.gradientBg}
      >
        <ThemedView style={styles.container}>
          {/* Header with glass morphism effect */}
          <View style={styles.header}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(26,31,53,0.6)', 'rgba(15,23,42,0.4)']
                : ['rgba(255,255,255,0.8)', 'rgba(248,250,252,0.6)']
              }
              style={styles.headerCard}
            >
              <View style={styles.headerTop}>
                <View style={styles.statBadge}>
                  <ThemedText style={styles.flame}>🔥</ThemedText>
                  <ThemedText style={styles.streakText}>0</ThemedText>
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.statBadge}>
                  <ThemedText style={styles.gem}>💎</ThemedText>
                  <ThemedText style={styles.gemText}>250</ThemedText>
                </View>
              </View>
              <ThemedText type="title" style={[styles.title, { color: Colors[colorScheme].text }]}>
                {course.title}
              </ThemedText>
            </LinearGradient>
          </View>

          {/* Path - dynamicznie generowana z danych API */}
          <View style={styles.path}>
            {course.chapters.map((chapter, chapterIndex) => (
              <View key={chapter.id}>
                {/* Chapter Header (Unit) */}
                <View style={styles.unit}>
                  <LinearGradient
                    colors={getChapterGradient(chapterIndex)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.unitHeader}
                  >
                    <View style={styles.unitBadge}>
                      <ThemedText style={styles.unitTitle}>
                        ROZDZIAŁ {chapterIndex + 1}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.unitSubtitle}>{chapter.title}</ThemedText>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: '0%' }]} />
                    </View>
                  </LinearGradient>
                </View>

                {/* Lessons/Modules jako SkillNodes */}
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const isLeftAligned = lessonIndex % 2 === 0;
                  const color = lessonColors[lessonIndex % lessonColors.length];

                  return (
                    <View key={lesson.id}>
                      {/* Connector */}
                      {lessonIndex > 0 && (
                        <View style={styles.pathConnector}>
                          <Svg height="70" width="400" style={styles.curvedPath}>
                            <Path
                              d={isLeftAligned
                                ? "M 240 0 C 240 18, 230 25, 220 35 C 210 45, 200 55, 200 70"
                                : "M 200 0 C 200 18, 210 25, 220 35 C 230 45, 240 55, 240 70"}
                              stroke={colorScheme === 'dark' ? '#374151' : '#cbd5e1'}
                              strokeWidth="5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="12,8"
                            />
                          </Svg>
                        </View>
                      )}

                      {/* Skill Node */}
                      <View style={styles.nodeRow}>
                        <View style={[styles.nodeOffset, !isLeftAligned && { marginLeft: 80 }]}>
                          <SkillNode
                            title={lesson.moduleTitle}
                            level={lessonIndex + 1}
                            icon={lesson.character}
                            color={color}
                            current={lessonIndex === 0}
                            locked={lessonIndex > 0}
                            progress={lessonIndex === 0 ? 1 : 0}
                            href={`/lesson?moduleId=${lesson.moduleId}` as any}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Separator between chapters */}
                {chapterIndex < course.chapters.length - 1 && (
                  <View style={styles.pathConnector}>
                    <Svg height="50" width="400" style={styles.curvedPath}>
                      <Path
                        d="M 200 0 C 200 12, 200 20, 200 50"
                        stroke={colorScheme === 'dark' ? '#374151' : '#cbd5e1'}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="12,8"
                      />
                    </Svg>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ThemedView>
      </LinearGradient>
    </ScrollView>
  );
}

// Helper do generowania gradientu dla rozdziału
function getChapterGradient(index: number): [string, string] {
  const gradients: [string, string][] = [
    ['#58cc02', '#46a302'], // green
    ['#1cb0f6', '#0e8ecb'], // blue
    ['#8b5cf6', '#7c3aed'], // purple
    ['#fbbf24', '#f59e0b'], // yellow
    ['#ec4899', '#db2777'], // pink
    ['#f97316', '#ea580c'], // orange
  ];
  return gradients[index % gradients.length];
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  headerCard: {
    borderRadius: 24,
    padding: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  flame: {
    fontSize: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ff9600',
  },
  gem: {
    fontSize: 18,
  },
  gemText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1cb0f6',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  path: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    paddingTop: 20,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
    zIndex: 10,
  },
  pathConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  curvedPath: {
    alignSelf: 'center',
  },
  nodeOffset: {
    marginLeft: -40,
  },
  unit: {
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
  },
  unitHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  unitBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  unitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  unitSubtitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
  },
});
