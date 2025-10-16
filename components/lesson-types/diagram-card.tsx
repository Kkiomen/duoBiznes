import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.badge}>
        <ThemedText style={styles.badgeText}>WORKFLOW</ThemedText>
      </View>

      <LinearGradient
        colors={['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)']}
        style={styles.card}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>

        <View style={styles.diagramContainer}>
          {nodes.map((node, index) => (
            <View key={index}>
              {/* Node */}
              <View style={styles.nodeWrapper}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.node}
                >
                  <ThemedText style={styles.nodeIcon}>{node.icon}</ThemedText>
                </LinearGradient>
                <ThemedText style={styles.nodeLabel}>{node.label}</ThemedText>
              </View>

              {/* Arrow connector */}
              {index < nodes.length - 1 && (
                <View style={styles.arrowContainer}>
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
                </View>
              )}
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nodeIcon: {
    fontSize: 36,
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
