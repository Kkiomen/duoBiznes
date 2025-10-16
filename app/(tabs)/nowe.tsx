import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

type NodeType = 'lesson' | 'practice' | 'story' | 'review' | 'character';
type NodeState = 'locked' | 'available' | 'current' | 'completed';

interface NodeData {
  id: number;
  type: NodeType;
  icon: string;
  title: string;
  state: NodeState;
  stars: number;
  xp: number;
}

// Komponent pojedynczego węzła
function LessonNode({ node, onPress, offsetDirection }: {
  node: NodeData;
  onPress: () => void;
  offsetDirection?: 'left' | 'right' | 'none';
}) {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shake.value }
    ]
  }));

  const handlePress = () => {
    if (node.state === 'locked') {
      // Shake animation
      shake.value = withSequence(
        withSpring(-10, { damping: 8 }),
        withSpring(10, { damping: 8 }),
        withSpring(-10, { damping: 8 }),
        withSpring(0, { damping: 8 })
      );
    } else {
      scale.value = withSequence(
        withSpring(0.9, { damping: 5 }),
        withSpring(1, { damping: 5 })
      );
    }
    onPress();
  };

  const getNodeColors = () => {
    switch (node.state) {
      case 'current':
        return { outer: ['#2C3544', '#1A2332'], inner: ['#FF4B4B', '#CC3333'] };
      case 'available':
        return { outer: ['#2C3544', '#1A2332'], inner: ['#58CC02', '#46A302'] };
      case 'completed':
        return { outer: ['#FFD700', '#FFA500'], inner: ['#58CC02', '#46A302'] };
      case 'locked':
      default:
        return { outer: ['rgb(39, 49, 66)', 'rgb(39, 49, 66)'], inner: ['rgb(39, 49, 66)', 'rgb(39, 49, 66)'] };
    }
  };

  const colors = getNodeColors();
  const isLocked = node.state === 'locked';
  const isCurrent = node.state === 'current';

  const offsetStyle = offsetDirection === 'left' ? styles.nodeOffsetLeft :
                      offsetDirection === 'right' ? styles.nodeOffsetRight : {};

  return (
    <View style={[styles.nodeTouchWrapper, offsetStyle]}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.nodeWrapper,
            pressed && !isLocked && { opacity: 0.8 }
          ]}
        >
          <LinearGradient
            colors={colors.outer as [string, string]}
            style={[
              styles.activeNodeOuter,
              isCurrent && styles.currentNodeGlow
            ]}
          >
            <LinearGradient
              colors={colors.inner as [string, string]}
              style={styles.activeNodeGradient}
            >
              <View style={[
                styles.activeNodeInner,
                isLocked && { backgroundColor: 'rgb(39, 49, 66)' }
              ]}>
                <ThemedText style={[
                  styles.nodeIconActive,
                  isLocked && styles.nodeIconGray
                ]}>
                  {isLocked ? '🔒' : node.icon}
                </ThemedText>
              </View>
            </LinearGradient>

            {/* Stars for completed */}
            {node.state === 'completed' && node.stars > 0 && (
              <View style={styles.nodeStars}>
                {[1, 2, 3].map(i => (
                  <ThemedText key={i} style={styles.nodeStar}>
                    {i <= node.stars ? '⭐' : '☆'}
                  </ThemedText>
                ))}
              </View>
            )}

            {/* Checkmark for completed */}
            {node.state === 'completed' && (
              <View style={styles.nodeCheckmark}>
                <ThemedText style={styles.checkmarkText}>✓</ThemedText>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Title and XP */}
      <View style={styles.nodeInfo}>
        <ThemedText style={[
          styles.nodeTitle,
          isLocked && styles.nodeTitleLocked
        ]}>
          {node.title}
        </ThemedText>
        {!isLocked && (
          <View style={styles.xpBadge}>
            <ThemedText style={styles.xpText}>{node.xp} XP</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

// Character node component
function CharacterNode({ node, onPress, offsetDirection }: {
  node: NodeData;
  onPress: () => void;
  offsetDirection?: 'left' | 'right' | 'none';
}) {
  const offsetStyle = offsetDirection === 'left' ? styles.characterLeft :
                      offsetDirection === 'right' ? styles.characterRight : {};

  return (
    <Pressable
      onPress={onPress}
      style={[styles.characterWrapper, offsetStyle]}
    >
      <View style={styles.characterBubble}>
        <ThemedText style={styles.characterEmoji}>{node.icon}</ThemedText>
      </View>
      <View style={styles.starsRow}>
        {[1, 2, 3].map(i => (
          <ThemedText key={i} style={styles.starSmall}>
            {i <= node.stars ? '⭐' : '☆'}
          </ThemedText>
        ))}
      </View>
      <ThemedText style={styles.characterTitle}>{node.title}</ThemedText>
    </Pressable>
  );
}

export default function NoweScreen() {
  const router = useRouter();
  const [nodes] = useState<NodeData[]>([
    { id: 1, type: 'lesson', icon: '🤖', title: 'Czym jest n8n?', state: 'current', stars: 0, xp: 40 },
    { id: 2, type: 'lesson', icon: '⚙️', title: 'Podstawy Workflow', state: 'available', stars: 0, xp: 45 },
    { id: 3, type: 'character', icon: '👩‍💼', title: 'Historia Ani', state: 'available', stars: 3, xp: 30 },
    { id: 4, type: 'lesson', icon: '🔗', title: "Node'y w n8n", state: 'available', stars: 0, xp: 60 },
    { id: 5, type: 'practice', icon: '🎯', title: 'Dopasuj node\'y', state: 'available', stars: 0, xp: 40 },
    { id: 6, type: 'lesson', icon: '🪝', title: 'Webhook i Triggery', state: 'available', stars: 0, xp: 50 },
    { id: 7, type: 'practice', icon: '🎮', title: 'Zbuduj workflow', state: 'locked', stars: 0, xp: 60 },
    { id: 8, type: 'practice', icon: '❓', title: 'Node IF', state: 'locked', stars: 0, xp: 50 },
    { id: 9, type: 'lesson', icon: '📊', title: 'Praca z danymi', state: 'available', stars: 0, xp: 60 },
    { id: 10, type: 'character', icon: '💡', title: 'Wskazówki', state: 'locked', stars: 0, xp: 20 },
    { id: 11, type: 'lesson', icon: '🚀', title: 'Pierwszy workflow', state: 'available', stars: 0, xp: 105 },
    { id: 12, type: 'practice', icon: '✍️', title: 'Ćwicz składnię', state: 'locked', stars: 0, xp: 50 },
    { id: 13, type: 'review', icon: '🏆', title: 'Finałowe wyzwanie', state: 'locked', stars: 0, xp: 105 },
  ]);

  const [moduleProgress] = useState({ completed: 0, total: 13 });

  // Mapowanie węzłów na moduleId lekcji
  const getModuleIdForNode = (nodeId: number): string => {
    const lessonMapping: Record<number, string> = {
      1: 'n8n-lesson-1',   // Czym jest n8n?
      2: 'n8n-lesson-2',   // Podstawy Workflow
      3: 'n8n-lesson-1',   // Historia Ani (w lesson-1)
      4: 'n8n-lesson-3',   // Node'y w n8n
      5: 'n8n-lesson-3',   // Dopasuj node'y (practice w lesson-3)
      6: 'n8n-lesson-4',   // Webhook i Triggery
      7: 'n8n-lesson-6',   // Zbuduj workflow (practice w lesson-6)
      8: 'n8n-lesson-3',   // Node IF (w lesson-3)
      9: 'n8n-lesson-5',   // Praca z danymi
      10: 'n8n-lesson-5',  // Wskazówki (tips w lesson-5)
      11: 'n8n-lesson-6',  // Pierwszy workflow
      12: 'n8n-lesson-5',  // Ćwicz składnię (practice w lesson-5)
      13: 'n8n-lesson-6',  // Finałowe wyzwanie
    };
    return lessonMapping[nodeId] || 'n8n-lesson-1';
  };

  const handleNodePress = (node: NodeData) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const moduleId = getModuleIdForNode(node.id);

    if (node.state === 'locked') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Węzeł zablokowany - shake animation już wykonana w komponencie
      return;
    }
    
    // Bezpośrednie uruchomienie lekcji (jak w Duolingo)
    if (node.state === 'current' || node.state === 'available' || node.state === 'completed') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.push(`/lesson-n8n?moduleId=${moduleId}`);
    }
  };

  const handleTopBarPress = (item: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(item, 'Funkcja w przygotowaniu...');
  };

  // Automatyczne generowanie ścieżki z przemiennymi offsetami
  const generatePathFromNodes = () => {
    const offsets: ('left' | 'right' | 'none')[] = ['none', 'left', 'right', 'none', 'left', 'right'];
    let offsetIndex = 0;

    return nodes.map((node) => {
      const offset = offsets[offsetIndex % offsets.length];
      offsetIndex++;

      // Określ stan linii - aktywna tylko dla pierwszego węzła jeśli jest current/available
      const lineState = (node.state === 'current' || node.state === 'available') ? 'active' : 'locked';

      return {
        nodeId: node.id,
        offset,
        lineState
      };
    });
  };

  const pathNodes = generatePathFromNodes();

  // Funkcja obliczająca pozycję X na podstawie offsetu węzła
  // WAŻNE: To musi odpowiadać rzeczywistym pozycjom węzłów po zastosowaniu margin
  const getNodeXPosition = (offset: string) => {
    const screenWidth = 400; // Szerokość SVG
    const centerX = screenWidth / 2; // 200 - środek ekranu

    switch (offset) {
      case 'left':
        // marginRight: 100 przesuwa węzeł w lewo
        return centerX - 50; // 150
      case 'right':
        // marginLeft: 100 przesuwa węzeł w prawo
        return centerX + 50; // 250
      case 'none':
      default:
        // Węzeł na środku
        return centerX; // 200
    }
  };

  // Funkcja generująca ścieżkę SVG łączącą dwa węzły
  const generatePathBetweenNodes = (fromOffset: string, toOffset: string) => {
    const startX = getNodeXPosition(fromOffset);
    const endX = getNodeXPosition(toOffset);

    // Wysokość linii - dostosowana do spacing między węzłami
    const height = 80;

    // Oblicz różnicę w X
    const deltaX = Math.abs(endX - startX);

    // Im większa różnica w X, tym bardziej kręta krzywa
    const curveFactor = deltaX > 50 ? 0.4 : 0.3;

    // Punkty kontrolne dla krzywej Béziera
    const controlY1 = height * curveFactor;
    const controlY2 = height * (1 - curveFactor);

    // Punkty kontrolne X - tworzą płynną S-curve lub prostą krzywą
    const midX = (startX + endX) / 2;

    // Dla większych różnic dodaj więcej krzywizny
    const controlX1 = startX + (midX - startX) * 0.6;
    const controlX2 = midX + (endX - midX) * 0.6;

    // Cubic Bezier curve
    return `M ${startX} 0 C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${height}`;
  };

  const getLineColor = (state: string) => state === 'active' ? '#58CC02' : '#132D1E';

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Górna belka ze statystykami */}
      <View style={styles.topStatusBar}>
        <Pressable onPress={() => handleTopBarPress('Zmień język')} style={styles.statItem}>
          <ThemedText style={styles.flagIcon}>🇺🇸</ThemedText>
          <View style={styles.redDot} />
        </Pressable>

        <View style={styles.statItemsRight}>
          <Pressable onPress={() => handleTopBarPress('Lingots')} style={styles.statItem}>
            <ThemedText style={styles.statIcon}>💧</ThemedText>
            <ThemedText style={styles.statValue}>0</ThemedText>
          </Pressable>

          <Pressable onPress={() => handleTopBarPress('Diamenty')} style={styles.statItem}>
            <ThemedText style={styles.statIcon}>💎</ThemedText>
            <ThemedText style={styles.statValueBlue}>683</ThemedText>
          </Pressable>

          <Pressable onPress={() => handleTopBarPress('Energia')} style={styles.statItem}>
            <ThemedText style={styles.statIcon}>⚡</ThemedText>
            <ThemedText style={styles.statValuePink}>25</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Czerwona karta modułu z postępem */}
      <Pressable onPress={() => Alert.alert('Sekcja 1', 'Podstawy n8n - poznaj automatyzację workflow')}>
        <View style={styles.moduleCardContainer}>
          <LinearGradient
            colors={['#FF4B4B', '#E03C3C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.moduleCard}
          >
            <View style={styles.moduleCardContent}>
              <View style={styles.moduleTextContainer}>
                <ThemedText style={styles.moduleHeader}>SEKCJA 1</ThemedText>
                <ThemedText style={styles.moduleTitle}>Podstawy n8n</ThemedText>
                <View style={styles.moduleProgress}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(moduleProgress.completed / moduleProgress.total) * 100}%` }]} />
                  </View>
                  <ThemedText style={styles.progressText}>
                    {moduleProgress.completed}/{moduleProgress.total} lekcji
                  </ThemedText>
                </View>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Alert.alert('Opcje sekcji', '', [
                    { text: 'Informacje', onPress: () => Alert.alert('Podstawy n8n', 'Poznaj automatyzację workflow, node\'y i wyrażenia. 38 kroków, 380 XP do zdobycia!') },
                    { text: 'Przewodnik', onPress: () => Alert.alert('Przewodnik', 'Dowiedz się czym jest n8n, jak budować workflow i pracować z danymi.') },
                    { text: 'Anuluj', style: 'cancel' }
                  ]);
                }}
                style={styles.menuIcon}
              >
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </Pressable>

      {/* Ścieżka z węzłami */}
      <View style={styles.pathContainer}>
        {pathNodes.map((pathNode, index) => {
          const node = nodes.find(n => n.id === pathNode.nodeId)!;
          const nextNode = pathNodes[index + 1];

          return (
            <View key={node.id}>
              {/* Render node */}
              {node.type === 'character' ? (
                <CharacterNode
                  node={node}
                  onPress={() => handleNodePress(node)}
                  offsetDirection={pathNode.offset as 'left' | 'right' | 'none'}
                />
              ) : (
                <LessonNode
                  node={node}
                  onPress={() => handleNodePress(node)}
                  offsetDirection={pathNode.offset as 'left' | 'right' | 'none'}
                />
              )}

              {/* Render connecting line */}
              {nextNode && (
                <View style={styles.pathConnector}>
                  <Svg height="80" width="400" style={styles.svgPath}>
                    <Path
                      d={generatePathBetweenNodes(pathNode.offset, nextNode.offset)}
                      stroke={getLineColor(pathNode.lineState)}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="12,10"
                    />
                  </Svg>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </View>

      {/* Przycisk akcji na dole */}
      <View style={styles.bottomButtonContainer}>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            // Znajdź pierwszy dostępny lub current node
            const currentNode = nodes.find(n => n.state === 'current' || n.state === 'available');
            const moduleId = currentNode ? getModuleIdForNode(currentNode.id) : 'n8n-lesson-1';
            router.push(`/lesson-n8n?moduleId=${moduleId}`);
          }}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed
          ]}
        >
          <LinearGradient
            colors={['#58CC02', '#46A302']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <ThemedText style={styles.actionText}>KONTYNUUJ</ThemedText>
            <ThemedText style={styles.actionSubtext}>Podstawy n8n • 360 XP</ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'rgb(19 29 45)',
  },
  contentContainer: {
    paddingBottom: 140,
  },

  // Górna belka ze statystykami
  topStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
    paddingBottom: 12,
    marginBottom: 30,
  },
  statItemsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  flagIcon: {
    fontSize: 32,
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4B4B',
    borderWidth: 2,
    borderColor: '#273142',
  },
  statIcon: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
  },
  statValueBlue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statValuePink: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF69B4',
  },

  // Czerwona karta modułu
  moduleCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  moduleCard: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  moduleCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  moduleTextContainer: {
    flex: 1,
    gap: 6,
  },
  moduleHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    opacity: 0.95,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  moduleProgress: {
    marginTop: 8,
    gap: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    opacity: 0.9,
  },
  menuIcon: {
    gap: 5,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  menuLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },

  // Ścieżka z węzłami
  pathContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },

  // Węzły - wrapper z touch area
  nodeTouchWrapper: {
    alignItems: 'center',
    zIndex: 10,
  },
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeOffsetLeft: {
    marginRight: 100,
  },
  nodeOffsetRight: {
    marginLeft: 100,
  },

  // Aktywny węzeł - efekt 3D monety z gradientem
  activeNodeOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'visible',
  },
  currentNodeGlow: {
    shadowColor: '#FF4B4B',
    shadowOpacity: 0.8,
    shadowRadius: 25,
  },
  activeNodeGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  activeNodeInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  nodeIconActive: {
    fontSize: 48,
  },

  nodeIconGray: {
    fontSize: 40,
    opacity: 0.3,
  },

  // Node info (title & XP)
  nodeInfo: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 4,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  nodeTitleLocked: {
    opacity: 0.4,
  },
  xpBadge: {
    backgroundColor: 'rgba(88, 204, 2, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.4)',
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#58CC02',
  },

  // Node stars
  nodeStars: {
    position: 'absolute',
    bottom: -5,
    flexDirection: 'row',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nodeStar: {
    fontSize: 12,
  },

  // Checkmark
  nodeCheckmark: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#58CC02',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },

  // Linie łączące
  pathConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    opacity: 0.8,
  },
  svgPath: {
    alignSelf: 'center',
  },

  // Postacie
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 6,
    marginBottom: 8,
  },
  characterLeft: {
    marginRight: 100,
  },
  characterRight: {
    marginLeft: 100,
  },
  characterBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgb(39, 49, 66)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  characterEmoji: {
    fontSize: 60,
  },
  characterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  starSmall: {
    fontSize: 16,
    opacity: 0.6,
  },

  // Przycisk akcji
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});
