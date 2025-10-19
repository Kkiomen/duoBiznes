import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Komponent ikony emoji
function EmojiIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={[styles.emojiIcon, focused ? styles.emojiIconFocused : styles.emojiIconUnfocused]}>
      {emoji}
    </Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#58CC02',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'rgb(19, 29, 45)' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: colorScheme === 'dark' ? 0.4 : 0.15,
          shadowRadius: 10,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <EmojiIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nowe"
        options={{
          title: 'Nauka',
          tabBarIcon: ({ focused }) => (
            <EmojiIcon emoji="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: 'Ćwiczenia',
          tabBarIcon: ({ focused }) => (
            <EmojiIcon emoji="💪" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <EmojiIcon emoji="👤" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  emojiIcon: {
    marginBottom: 6,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  emojiIconFocused: {
    fontSize: 28,
    lineHeight: 40,
    height: 40,
  },
  emojiIconUnfocused: {
    fontSize: 24,
    lineHeight: 36,
    height: 36,
  },
});
