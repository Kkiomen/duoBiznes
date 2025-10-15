import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SkillNode } from '@/components/ui/skill-node';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SkillsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme].candy;

  return (
    <ScrollView
      style={{ backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#F8FAFC' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
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
                Ścieżka Nauki
              </ThemedText>
            </LinearGradient>
          </View>

          {/* Path - pionowa ścieżka jak w Duolingo */}
          <View style={styles.path}>
            {/* Unit 1 */}
            <View style={styles.unit}>
              <LinearGradient
                colors={['#58cc02', '#46a302']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.unitHeader}
              >
                <View style={styles.unitBadge}>
                  <ThemedText style={styles.unitTitle}>UNIT 1</ThemedText>
                </View>
                <ThemedText style={styles.unitSubtitle}>Podstawy AI</ThemedText>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
              </LinearGradient>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="50" width="400" style={styles.curvedPath}>
                <Path
                  d="M 200 0 C 200 15, 180 30, 160 50"
                  stroke={colorScheme === 'dark' ? '#374151' : '#cbd5e1'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="12,8"
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={styles.nodeOffset}>
                <SkillNode
                  title="Wprowadzenie"
                  level={1}
                  icon="🎯"
                  color="green"
                  current
                  progress={3}
                />
              </View>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 200 0 C 200 18, 210 25, 220 35 C 230 45, 240 55, 240 70"
                  stroke={colorScheme === 'dark' ? '#374151' : '#cbd5e1'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="12,8"
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={[styles.nodeOffset, { marginLeft: 80 }]}>
                <SkillNode
                  title="Czym jest AI?"
                  level={2}
                  icon="🤖"
                  color="blue"
                  completed
                  progress={2}
                />
              </View>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 240 0 C 240 18, 230 25, 220 35 C 210 45, 200 55, 200 70"
                  stroke={colorScheme === 'dark' ? '#374151' : '#cbd5e1'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="12,8"
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={styles.nodeOffset}>
                <SkillNode
                  title="Modele AI"
                  level={3}
                  icon="🧠"
                  color="purple"
                  progress={1}
                />
              </View>
            </View>

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

            {/* Unit 2 */}
            <View style={styles.unit}>
              <LinearGradient
                colors={['#1cb0f6', '#0e8ecb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.unitHeader}
              >
                <View style={styles.unitBadge}>
                  <ThemedText style={styles.unitTitle}>UNIT 2</ThemedText>
                </View>
                <ThemedText style={styles.unitSubtitle}>Praktyka</ThemedText>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
              </LinearGradient>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 200 0 C 200 20, 220 40, 240 70"
                  stroke={colorScheme === 'dark' ? '#475569' : '#94a3b8'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10,6"
                  opacity={0.5}
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={[styles.nodeOffset, { marginLeft: 80 }]}>
                <SkillNode
                  title="Prompting"
                  level={4}
                  icon="💬"
                  color="yellow"
                  locked
                />
              </View>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 240 0 C 240 18, 230 25, 220 35 C 210 45, 200 55, 200 70"
                  stroke={colorScheme === 'dark' ? '#475569' : '#94a3b8'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10,6"
                  opacity={0.5}
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={styles.nodeOffset}>
                <SkillNode
                  title="Tokeny"
                  level={5}
                  icon="🔤"
                  color="orange"
                  locked
                />
              </View>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 200 0 C 200 18, 210 25, 220 35 C 230 45, 240 55, 240 70"
                  stroke={colorScheme === 'dark' ? '#475569' : '#94a3b8'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10,6"
                  opacity={0.5}
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={[styles.nodeOffset, { marginLeft: 80 }]}>
                <SkillNode
                  title="RAG"
                  level={6}
                  icon="📚"
                  color="pink"
                  locked
                />
              </View>
            </View>

            <View style={styles.pathConnector}>
              <Svg height="70" width="400" style={styles.curvedPath}>
                <Path
                  d="M 240 0 C 240 18, 230 25, 220 35 C 210 45, 200 55, 200 70"
                  stroke={colorScheme === 'dark' ? '#475569' : '#94a3b8'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10,6"
                  opacity={0.5}
                />
              </Svg>
            </View>

            <View style={styles.nodeRow}>
              <View style={styles.nodeOffset}>
                <SkillNode
                  title="Ewaluacja"
                  level={7}
                  icon="📊"
                  color="green"
                  locked
                />
              </View>
            </View>

            {/* Treasure/Review */}
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

            <View style={styles.nodeRow}>
              <View style={styles.nodeOffset}>
                <View style={styles.treasureWrapper}>
                  <LinearGradient
                    colors={['#fbbf24', '#f59e0b']}
                    style={styles.treasureBg}
                  >
                    <SkillNode
                      title="Podsumowanie"
                      level={8}
                      icon="🏆"
                      color="yellow"
                      locked
                    />
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>
      </LinearGradient>
    </ScrollView>
  );
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
  connector: {
    width: 6,
    height: 32,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
  },
  curvedPath: {
    alignSelf: 'center',
  },
  nodeOffset: {
    marginLeft: -40,
  },
  spacer: {
    width: 150,
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
  treasureWrapper: {
    padding: 12,
    borderRadius: 24,
  },
  treasureBg: {
    borderRadius: 20,
    padding: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});


