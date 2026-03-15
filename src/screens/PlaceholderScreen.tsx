import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import type { AppScreen, Navigate } from './types';

type ScreenAction = {
  label: string;
  screen: AppScreen;
};

type PlaceholderScreenProps = {
  title: string;
  subtitle: string;
  actions: ScreenAction[];
  navigate: Navigate;
};

export function PlaceholderScreen({
  title,
  subtitle,
  actions,
  navigate,
}: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => navigate(action.screen)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#111111',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
