import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <ScrollView style={{ backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#fff' }}>
      <ThemedView style={styles.container}>
        {/* Header z avatarem */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#58cc02', '#46a302']}
            style={styles.avatar}
          >
            <ThemedText style={styles.avatarText}>AI</ThemedText>
          </LinearGradient>
          <ThemedText style={styles.username}>Uczący się AI</ThemedText>
          <ThemedText style={styles.joinDate}>Dołączył w październiku 2025</ThemedText>
        </View>

        {/* Statystyki */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="🔥"
            value="3"
            label="Dni z rzędu"
            color="#ff9600"
          />
          <StatCard
            icon="⚡"
            value="120"
            label="Całkowite XP"
            color="#ffc800"
          />
          <StatCard
            icon="💎"
            value="25"
            label="Klejnoty"
            color="#1cb0f6"
          />
          <StatCard
            icon="🏆"
            value="5"
            label="Osiągnięcia"
            color="#ffc800"
          />
        </View>

        {/* Osiągnięcia */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Osiągnięcia</ThemedText>
          <View style={styles.achievements}>
            <AchievementBadge
              icon="🎯"
              title="Pierwszy krok"
              description="Ukończ pierwszą lekcję"
              unlocked
            />
            <AchievementBadge
              icon="🔥"
              title="Gorący start"
              description="3 dni z rzędu"
              unlocked
            />
            <AchievementBadge
              icon="⭐"
              title="Perfekcja"
              description="Zdobądź 3 gwiazdki"
              unlocked={false}
            />
            <AchievementBadge
              icon="🚀"
              title="Rakieta"
              description="Ukończ 10 lekcji"
              unlocked={false}
            />
          </View>
        </View>

        {/* Postęp w jednostkach */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Postęp</ThemedText>
          <UnitProgress
            title="Unit 1: Podstawy AI"
            completed={2}
            total={3}
            color="#58cc02"
          />
          <UnitProgress
            title="Unit 2: Praktyka"
            completed={0}
            total={4}
            color="#1cb0f6"
          />
        </View>
      </ThemedView>
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
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
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
  return (
    <View style={[styles.achievement, !unlocked && styles.achievementLocked]}>
      <View style={[styles.achievementIcon, !unlocked && styles.achievementIconLocked]}>
        <ThemedText style={styles.achievementEmoji}>{icon}</ThemedText>
      </View>
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
    </View>
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
  return (
    <View style={styles.unitProgress}>
      <View style={styles.unitProgressHeader}>
        <ThemedText style={styles.unitProgressTitle}>{title}</ThemedText>
        <ThemedText style={styles.unitProgressCount}>
          {completed}/{total}
        </ThemedText>
      </View>
      <ProgressBar progress={completed / total} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
  },
  joinDate: {
    fontSize: 14,
    color: '#afafaf',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  statIcon: {
    fontSize: 32,
    lineHeight: 40,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 16,
    numberOfLines: 2,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  achievements: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    gap: 12,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconLocked: {
    backgroundColor: '#e5e5e5',
  },
  achievementEmoji: {
    fontSize: 30,
    lineHeight: 36,
  },
  achievementText: {
    flex: 1,
    gap: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#777',
  },
  textLocked: {
    color: '#afafaf',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#58cc02',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  unitProgress: {
    padding: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    gap: 12,
  },
  unitProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitProgressTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitProgressCount: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
});


