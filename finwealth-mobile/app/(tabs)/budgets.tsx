import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { theme } from '../../src/theme/theme';
import FadeInView from '../../src/components/ui/FadeInView';
import ProgressBar from '../../src/components/ui/ProgressBar';
import { useBudgetsStore } from '../../src/store/budgets.store';
import { useAuthStore } from '../../src/store/auth.store';

const LEDGER_ID = 'default-ledger'; // Consistent with Dashboard

export default function BudgetsScreen() {
  const { isAuthenticated } = useAuthStore();
  const { budgetsPerformance, isLoading, error, fetchBudgetsPerformance } = useBudgetsStore();

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();

    await fetchBudgetsPerformance(LEDGER_ID, month, year);
  }, [isAuthenticated, fetchBudgetsPerformance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.budgetItem}>
      <ProgressBar
        label={
          item.category || (item.accountId ? `Cuenta: ${item.accountId}` : 'Presupuesto Global')
        }
        progress={item.percentage}
        spent={item.amountSpent}
        limit={item.amountLimit}
        currency="USD"
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Aún no tienes metas de ahorro</Text>
      <Text style={styles.emptySubtitle}>
        Crea presupuestos para tomar el control total de tus finanzas y alcanzar tus objetivos.
      </Text>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Inicia sesión para ver tus presupuestos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FadeInView style={styles.flex1}>
        <View style={styles.header}>
          <Text style={styles.title}>Presupuestos</Text>
          <Text style={styles.subtitle}>Progreso del mes actual</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <FlatList
          data={budgetsPerformance}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchData}
              tintColor={theme.colors.primary}
            />
          }
          ListFooterComponent={
            isLoading && budgetsPerformance.length === 0 ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            ) : null
          }
        />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex1: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[24],
    paddingTop: theme.spacing[32],
    marginBottom: theme.spacing[16],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: theme.spacing[24],
    paddingBottom: theme.spacing[32],
  },
  budgetItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[16],
    borderRadius: 16,
    marginBottom: theme.spacing[16],
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.05)',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    marginHorizontal: theme.spacing[24],
    padding: theme.spacing[16],
    borderRadius: 12,
    marginBottom: theme.spacing[16],
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
});
