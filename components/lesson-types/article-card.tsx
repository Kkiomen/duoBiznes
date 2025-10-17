import { HtmlRenderer } from '@/components/ui/html-renderer';
import { StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type ArticleCardProps = {
  htmlContent: string;
};

export function ArticleCard({ htmlContent }: ArticleCardProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <HtmlRenderer html={htmlContent} />
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
});
