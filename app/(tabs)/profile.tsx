import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfile } from '@/hooks/use-profile';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { profile, loading } = useProfile();

  if (loading || !profile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colorScheme === 'dark' ? 'rgb(19, 29, 45)' : '#F8FAFC' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header z avatarem */}
        <LinearGradient
          colors={colorScheme === 'dark'
            ? ['rgba(26,31,53,0.6)', 'rgba(15,23,42,0.4)']
            : ['rgba(255,255,255,0.9)', 'rgba(248,250,252,0.7)']
          }
          style={styles.headerCard}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={['#58cc02', '#46a302']}
              style={styles.avatar}
            >
              <ThemedText style={styles.avatarText}>{profile.user.avatar}</ThemedText>
            </LinearGradient>
            <ThemedText style={styles.username}>{profile.user.name}</ThemedText>
            <ThemedText style={styles.joinDate}>
              Dołączył {new Date(profile.user.joinDate).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Statystyki */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="🔥"
            value={profile.stats.streak.toString()}
            label="Dni z rzędu"
            color="#ff9600"
          />
          <StatCard
            icon="⚡"
            value={profile.stats.xp.toString()}
            label="Całkowite XP"
            color="#ffc800"
          />
          <StatCard
            icon="❤️"
            value={`${profile.stats.hearts}/${profile.stats.maxHearts}`}
            label="Energia"
            color="#ff6b9d"
          />
          <StatCard
            icon="🏆"
            value={profile.progress.achievements.length.toString()}
            label="Osiągnięcia"
            color="#ffc800"
          />
        </View>

        {/* Osiągnięcia */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Osiągnięcia ({profile.progress.achievements.length})
          </ThemedText>
          <View style={styles.achievements}>
            {/* Show unlocked achievements */}
            {profile.progress.achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                unlocked={true}
              />
            ))}

            {/* Show example locked achievements if user has less than 4 */}
            {profile.learningStats.totalLessonsCompleted === 0 && (
              <AchievementBadge
                icon="🎯"
                title="Pierwszy krok"
                description="Ukończ pierwszą lekcję"
                unlocked={false}
              />
            )}
            {profile.stats.streak < 3 && (
              <AchievementBadge
                icon="🔥"
                title="Gorący start"
                description="3 dni z rzędu"
                unlocked={false}
              />
            )}
            {profile.learningStats.totalLessonsCompleted < 10 && (
              <AchievementBadge
                icon="🚀"
                title="Rakieta"
                description="Ukończ 10 lekcji"
                unlocked={false}
              />
            )}
          </View>
        </View>

        {/* Postęp w jednostkach */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Postęp nauki</ThemedText>
          <UnitProgress
            title="Ukończone lekcje"
            completed={profile.learningStats.totalLessonsCompleted}
            total={profile.learningStats.totalLessonsCompleted + 5}
            color="#58cc02"
          />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statItemLabel}>Czas nauki</ThemedText>
              <ThemedText style={styles.statItemValue}>
                {profile.learningStats.totalTimeMinutes} min
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statItemLabel}>Trafność</ThemedText>
              <ThemedText style={styles.statItemValue}>
                {Math.round(profile.learningStats.averageAccuracy * 100)}%
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Pressable style={({ pressed }) => [styles.statCard, pressed && { opacity: 0.8 }]}>
      <LinearGradient
        colors={colorScheme === 'dark'
          ? ['rgba(39, 49, 66, 0.8)', 'rgba(26, 31, 53, 0.6)']
          : ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.8)']
        }
        style={styles.statCardGradient}
      >
        <ThemedText style={styles.statIcon}>{icon}</ThemedText>
        <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

function AchievementBadge({
  icon,
  title,
  description,
  unlocked
}: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
      <LinearGradient
        colors={colorScheme === 'dark'
          ? unlocked
            ? ['rgba(39, 49, 66, 0.9)', 'rgba(26, 31, 53, 0.7)']
            : ['rgba(39, 49, 66, 0.4)', 'rgba(26, 31, 53, 0.3)']
          : unlocked
            ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.8)']
            : ['rgba(230,230,230,0.5)', 'rgba(200,200,200,0.3)']
        }
        style={styles.achievement}
      >
        <LinearGradient
          colors={unlocked ? ['#FFD700', '#FFA500'] : ['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
          style={styles.achievementIcon}
        >
          <ThemedText style={styles.achievementEmoji}>{unlocked ? icon : '🔒'}</ThemedText>
        </LinearGradient>
        <View style={styles.achievementText}>
          <ThemedText style={[styles.achievementTitle, !unlocked && styles.textLocked]}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.achievementDesc, !unlocked && styles.textLocked]}>
            {description}
          </ThemedText>
        </View>
        {unlocked && (
          <View style={styles.checkBadge}>
            <ThemedText style={styles.checkText}>✓</ThemedText>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function UnitProgress({
  title,
  completed,
  total,
  color
}: {
  title: string;
  completed: number;
  total: number;
  color: string;
}) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
      <LinearGradient
        colors={colorScheme === 'dark'
          ? ['rgba(39, 49, 66, 0.8)', 'rgba(26, 31, 53, 0.6)']
          : ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.8)']
        }
        style={styles.unitProgress}
      >
        <View style={styles.unitProgressHeader}>
          <ThemedText style={styles.unitProgressTitle}>{title}</ThemedText>
          <ThemedText style={styles.unitProgressCount}>
            {completed}/{total}
          </ThemedText>
        </View>
        <ProgressBar progress={completed / total} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  headerCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontSize: 60,
  },
  username: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  joinDate: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
  },
  statIcon: {
    fontSize: 48,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    fontWeight: '700',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  achievements: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementEmoji: {
    fontSize: 36,
  },
  achievementText: {
    flex: 1,
    gap: 6,
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#FFFFFF',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  textLocked: {
    opacity: 0.5,
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#58cc02',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  checkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  unitProgress: {
    padding: 20,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unitProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitProgressTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#FFFFFF',
  },
  unitProgressCount: {
    fontSize: 15,
    color: '#D1D5DB',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    gap: 8,
  },
  statItemLabel: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  statItemValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#58cc02',
  },
});


