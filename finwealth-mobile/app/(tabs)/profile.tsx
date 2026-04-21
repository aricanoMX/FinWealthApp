import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/theme';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/auth.store';
import { useRouter } from 'expo-router';
import FadeInView from '../../src/components/ui/FadeInView';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <FadeInView style={styles.container}>
      <Text style={styles.title}>Perfil Elite</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'Inversionista'}</Text>
      </View>
      <Button title="Cerrar Sesión" onPress={logout} style={styles.logoutButton} />
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing[24],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing[32],
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[24],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    width: '100%',
    marginBottom: theme.spacing[32],
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: theme.spacing[4],
  },
  value: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: theme.colors.error,
  },
});
