import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, ZoomIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

type DiagramNode = {
  icon: string;
  label: string;
};

type DiagramCardProps = {
  title: string;
  nodes: DiagramNode[];
};

export function DiagramCard({ title, nodes }: DiagramCardProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500)}>
      <Animated.View style={styles.badge} entering={SlideInLeft.delay(100).duration(400)}>
        <ThemedText style={styles.badgeText}>WORKFLOW</ThemedText>
      </Animated.View>

      <LinearGradient
        colors={['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)']}
        style={styles.card}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>

        <View style={styles.diagramContainer}>
          {nodes.map((node, index) => (
            <View key={index}>
              {/* Node */}
              <Animated.View
                style={styles.nodeWrapper}
                entering={ZoomIn.delay(300 + index * 150).duration(500)}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.node}
                >
                  <ThemedText style={styles.nodeIcon}>{node.icon}</ThemedText>
                </LinearGradient>
                <ThemedText style={styles.nodeLabel}>{node.label}</ThemedText>
              </Animated.View>

              {/* Arrow connector */}
              {index < nodes.length - 1 && (
                <Animated.View
                  style={styles.arrowContainer}
                  entering={FadeInDown.delay(400 + index * 150).duration(300)}
                >
                  <Svg height="40" width="60" style={styles.svg}>
                    <Path
                      d="M 30 0 L 30 40"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Arrow head */}
                    <Path
                      d="M 30 40 L 25 33 M 30 40 L 35 33"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </Animated.View>
              )}
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  diagramContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  nodeWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nodeIcon: {
    fontSize: 36,
    lineHeight: 42,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  nodeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5E7EB',
    textAlign: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  svg: {
    alignSelf: 'center',
  },
});
