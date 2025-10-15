import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function NoweScreen() {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Górna belka ze statystykami */}
      <View style={styles.topStatusBar}>
        {/* Flaga USA z czerwoną kropką */}
        <View style={styles.statItem}>
          <ThemedText style={styles.flagIcon}>🇺🇸</ThemedText>
          <View style={styles.redDot} />
        </View>

        <View style={styles.statItemsRight}>
          {/* Kropla z 0 */}
          <View style={styles.statItem}>
            <ThemedText style={styles.statIcon}>💧</ThemedText>
            <ThemedText style={styles.statValue}>0</ThemedText>
          </View>

          {/* Diament z 683 */}
          <View style={styles.statItem}>
            <ThemedText style={styles.statIcon}>💎</ThemedText>
            <ThemedText style={styles.statValueBlue}>683</ThemedText>
          </View>

          {/* Energia z 25 */}
          <View style={styles.statItem}>
            <ThemedText style={styles.statIcon}>⚡</ThemedText>
            <ThemedText style={styles.statValuePink}>25</ThemedText>
          </View>
        </View>
      </View>

      {/* Czerwona karta modułu */}
      <View style={styles.moduleCardContainer}>
        <LinearGradient
          colors={['#FF4B4B', '#E03C3C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.moduleCard}
        >
          <View style={styles.moduleCardContent}>
            <View style={styles.moduleTextContainer}>
              <ThemedText style={styles.moduleHeader}>MODUŁ 1, SEKCJA 9</ThemedText>
              <ThemedText style={styles.moduleTitle}>Porozmawiaj o pogodzie</ThemedText>
            </View>
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Ścieżka z węzłami */}
      <View style={styles.pathContainer}>
        
        {/* 1. Czerwony aktywny węzeł - odświeżanie */}
        <View style={styles.nodeWrapper}>
          <LinearGradient
            colors={['#2C3544', '#1A2332']}
            style={styles.activeNodeOuter}
          >
            <LinearGradient
              colors={['#FF4B4B', '#CC3333']}
              style={styles.activeNodeGradient}
            >
              <View style={styles.activeNodeInner}>
                <ThemedText style={styles.nodeIconActive}>🔄</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 200 0 C 200 20, 180 35, 160 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 2. Szary węzeł - gwiazdka */}
        <View style={[styles.nodeWrapper, styles.nodeOffsetLeft]}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>⭐</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="80" width="400" style={styles.svgPath}>
            <Path
              d="M 160 0 C 160 25, 140 45, 120 80"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 3. Postać lewa z 3 gwiazdkami */}
        <View style={[styles.characterWrapper, styles.characterLeft]}>
          <View style={styles.characterBubble}>
            <ThemedText style={styles.characterEmoji}>🧑‍💼</ThemedText>
          </View>
          <View style={styles.starsRow}>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
          </View>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 120 0 C 120 20, 140 35, 160 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 4. Szary węzeł - kamera */}
        <View style={[styles.nodeWrapper, styles.nodeOffsetRight]}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>🎥</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 240 0 C 240 20, 220 35, 200 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 5. Szary węzeł - książka */}
        <View style={styles.nodeWrapper}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>📖</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 200 0 C 200 20, 180 35, 160 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 6. Szary węzeł - słuchawki */}
        <View style={[styles.nodeWrapper, styles.nodeOffsetLeft]}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>🎧</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 160 0 C 160 20, 180 35, 200 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 7. Szary węzeł - gwiazdka */}
        <View style={styles.nodeWrapper}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>⭐</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 200 0 C 200 20, 220 35, 240 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 8. Szary węzeł - kamera */}
        <View style={[styles.nodeWrapper, styles.nodeOffsetRight]}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>🎥</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="80" width="400" style={styles.svgPath}>
            <Path
              d="M 240 0 C 240 25, 180 50, 160 80"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 9. Szary węzeł - książka */}
        <View style={styles.nodeWrapper}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>📖</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="80" width="400" style={styles.svgPath}>
            <Path
              d="M 160 0 C 160 25, 200 50, 240 80"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 10. Postać prawa z 3 gwiazdkami */}
        <View style={[styles.characterWrapper, styles.characterRight]}>
          <View style={styles.characterBubble}>
            <ThemedText style={styles.characterEmoji}>🙋</ThemedText>
          </View>
          <View style={styles.starsRow}>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
            <ThemedText style={styles.starSmall}>⭐</ThemedText>
          </View>
        </View>

        {/* Linia łącząca */}
        <View style={styles.pathConnector}>
          <Svg height="60" width="400" style={styles.svgPath}>
            <Path
              d="M 240 0 C 240 20, 220 35, 200 60"
              stroke="#132D1E"
              strokeWidth="0"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="12,10"
            />
          </Svg>
        </View>

        {/* 11. Szary węzeł - słuchawki */}
        <View style={[styles.nodeWrapper, styles.nodeOffsetRight]}>
          <LinearGradient
            colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
            style={styles.inactiveNodeOuter}
          >
            <LinearGradient
              colors={['rgb(39, 49, 66)', 'rgb(39, 49, 66)']}
              style={styles.inactiveNode}
            >
              <View style={styles.inactiveNodeInner}>
                <ThemedText style={styles.nodeIconGray}>🎧</ThemedText>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Dodatkowy odstęp na dole */}
        <View style={{ height: 100 }} />
      </View>

      {/* Przycisk SZACHY na dole */}
      <View style={styles.bottomButtonContainer}>
        <Pressable style={({ pressed }) => [
          styles.szachyButton,
          pressed && styles.szachyButtonPressed
        ]}>
          <LinearGradient
            colors={['#58CC02', '#46A302']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.szachyGradient}
          >
            <ThemedText style={styles.szachyText}>SZACHY</ThemedText>
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
    paddingBottom: 120,
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
    alignItems: 'center',
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
  
  // Węzły
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  nodeOffsetLeft: {
    marginRight: 100,
  },
  nodeOffsetRight: {
    marginLeft: 100,
  },
  
  // Aktywny czerwony węzeł - efekt 3D monety z gradientem
  activeNodeOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
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
  
  // Nieaktywne szare węzły - efekt 3D monety z gradientem
  inactiveNodeOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 12,
    overflow: 'hidden',
  },
  inactiveNode: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inactiveNodeInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgb(39, 49, 66)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  nodeIconActive: {
    fontSize: 48,
  },
  
  nodeIconGray: {
    fontSize: 48,
    opacity: 0.4,
  },

  // Linie łączące
  pathConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    opacity: 0.6,
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
  },
  characterLeft: {
    marginRight: 140,
  },
  characterRight: {
    marginLeft: 140,
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
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  starSmall: {
    fontSize: 16,
    opacity: 0.4,
  },

  // Przycisk SZACHY
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    zIndex: 100,
  },
  szachyButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  szachyButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  szachyGradient: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 24,
  },
  szachyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

