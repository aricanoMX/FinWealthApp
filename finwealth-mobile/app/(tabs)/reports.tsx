import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/theme';
import FadeInView from '../../src/components/ui/FadeInView';

export default function ReportsScreen() {
  return (
    <FadeInView style={styles.container}>
      <Text style={styles.title}>Reportes</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Analizando tus activos...</Text>
      </View>
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
    marginBottom: theme.spacing[16],
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[24],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    width: '100%',
    alignItems: 'center',
  },
  cardText: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});
