import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';
import { useAppStore } from '../src/store/app.store';
import { Button } from '../src/components/ui/Button';
import { theme } from '../src/theme/theme';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const { isInitialized, setInitialized } = useAppStore();

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>FinWealth App</Text>
        <Text style={styles.subtitle}>Inicializando el motor de riqueza...</Text>
        <Button title="Comenzar Experiencia Elite" onPress={() => setInitialized(true)} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[24],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing[8],
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing[32],
    textAlign: 'center',
  },
});
