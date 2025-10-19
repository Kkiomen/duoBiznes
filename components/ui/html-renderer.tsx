import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface HtmlRendererProps {
  html: string;
}

interface TextStyle {
  color?: string;
  fontSize?: number;
  fontWeight?: '400' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline';
  marginBottom?: number;
  marginTop?: number;
  lineHeight?: number;
}

export function HtmlRenderer({ html }: HtmlRendererProps) {
  // Prosta funkcja do parsowania HTML i renderowania jako React Native komponenty
  const parseHtml = (htmlString: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let key = 0;

    // Usuń nadmiarowe białe znaki między tagami
    htmlString = htmlString.replace(/>\s+</g, '><').trim();

    // Regex do znajdowania tagów HTML
    const tagRegex = /<(\w+)>(.*?)<\/\1>|<br\s*\/?>/gs;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(htmlString)) !== null) {
      const [fullMatch, tagName, content] = match;

      // Dodaj tekst przed tagiem (jeśli istnieje)
      if (match.index > lastIndex) {
        const textBefore = htmlString.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          elements.push(
            <Text key={`text-${key++}`} style={styles.paragraph}>
              {textBefore.trim()}
            </Text>
          );
        }
      }

      // Renderuj tag
      if (fullMatch.startsWith('<br')) {
        elements.push(<View key={`br-${key++}`} style={styles.break} />);
      } else {
        elements.push(renderTag(tagName, content, key++));
      }

      lastIndex = match.index + fullMatch.length;
    }

    // Dodaj pozostały tekst po ostatnim tagu
    if (lastIndex < htmlString.length) {
      const textAfter = htmlString.substring(lastIndex);
      if (textAfter.trim()) {
        elements.push(
          <Text key={`text-${key++}`} style={styles.paragraph}>
            {textAfter.trim()}
          </Text>
        );
      }
    }

    return elements;
  };

  const renderTag = (tagName: string, content: string, key: number): React.ReactNode => {
    // Rekurencyjnie parsuj zawartość dla zagnieżdżonych tagów
    const parseInlineContent = (text: string): React.ReactNode[] => {
      const inlineElements: React.ReactNode[] = [];
      let inlineKey = 0;

      // Obsługa inline tagów: <strong>, <u>, <em>
      const inlineRegex = /<(strong|u|em)>(.*?)<\/\1>/gs;
      let lastInlineIndex = 0;
      let inlineMatch;

      while ((inlineMatch = inlineRegex.exec(text)) !== null) {
        const [fullInlineMatch, inlineTag, inlineContent] = inlineMatch;

        // Tekst przed tagiem inline
        if (inlineMatch.index > lastInlineIndex) {
          const textBefore = text.substring(lastInlineIndex, inlineMatch.index);
          if (textBefore) {
            inlineElements.push(textBefore);
          }
        }

        // Renderuj inline tag
        let inlineStyle = {};
        if (inlineTag === 'strong') {
          inlineStyle = { fontWeight: '700', color: '#FFFFFF' };
        } else if (inlineTag === 'u') {
          inlineStyle = { textDecorationLine: 'underline', textDecorationColor: '#1cb0f6' };
        } else if (inlineTag === 'em') {
          inlineStyle = { fontStyle: 'italic' };
        }

        inlineElements.push(
          <Text key={`inline-${key}-${inlineKey++}`} style={inlineStyle}>
            {inlineContent}
          </Text>
        );

        lastInlineIndex = inlineMatch.index + fullInlineMatch.length;
      }

      // Dodaj pozostały tekst
      if (lastInlineIndex < text.length) {
        const textAfter = text.substring(lastInlineIndex);
        if (textAfter) {
          inlineElements.push(textAfter);
        }
      }

      return inlineElements.length > 0 ? inlineElements : [text];
    };

    switch (tagName) {
      case 'h1':
        return (
          <Text key={`h1-${key}`} style={styles.h1}>
            {parseInlineContent(content)}
          </Text>
        );
      case 'h2':
        return (
          <Text key={`h2-${key}`} style={styles.h2}>
            {parseInlineContent(content)}
          </Text>
        );
      case 'h3':
        return (
          <Text key={`h3-${key}`} style={styles.h3}>
            {parseInlineContent(content)}
          </Text>
        );
      case 'p':
        return (
          <Text key={`p-${key}`} style={styles.paragraph}>
            {parseInlineContent(content)}
          </Text>
        );
      case 'ul':
        return renderList(content, key, false);
      case 'ol':
        return renderList(content, key, true);
      default:
        return (
          <Text key={`unknown-${key}`} style={styles.paragraph}>
            {content}
          </Text>
        );
    }
  };

  const renderList = (content: string, key: number, ordered: boolean): React.ReactNode => {
    const listItemRegex = /<li>(.*?)<\/li>/gs;
    const items: React.ReactNode[] = [];
    let itemMatch;
    let itemIndex = 0;

    while ((itemMatch = listItemRegex.exec(content)) !== null) {
      const itemContent = itemMatch[1];
      const bullet = ordered ? `${itemIndex + 1}.` : '•';

      items.push(
        <View key={`li-${key}-${itemIndex}`} style={styles.listItem}>
          <Text style={styles.bullet}>{bullet}</Text>
          <Text style={styles.listItemText}>{itemContent}</Text>
        </View>
      );
      itemIndex++;
    }

    return (
      <View key={`list-${key}`} style={styles.list}>
        {items}
      </View>
    );
  };

  return <View style={styles.container}>{parseHtml(html)}</View>;
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  h1: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  h2: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 16,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 24,
  },
  paragraph: {
    color: '#D1D5DB',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  list: {
    marginBottom: 12,
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    color: '#1cb0f6',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    minWidth: 20,
  },
  listItemText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 16,
    lineHeight: 24,
  },
  break: {
    height: 8,
  },
});
