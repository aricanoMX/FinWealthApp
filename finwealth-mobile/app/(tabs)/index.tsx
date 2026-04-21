import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../src/theme/theme';
import FadeInView from '../../src/components/ui/FadeInView';
import { useAnalyticsStore } from '../../src/store/analytics.store';
import { useAuthStore } from '../../src/store/auth.store';
import { QuickTransactionModal } from '../../src/components/ui/QuickTransactionModal';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return currencyFormatter.format(isNaN(num) ? 0 : num);
};

const LEDGER_ID = 'default-ledger';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const { netWorth, cashFlow, isLoading, error, fetchNetWorth, fetchCashFlow } =
    useAnalyticsStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    await Promise.all([fetchNetWorth(LEDGER_ID), fetchCashFlow(LEDGER_ID, firstDay, today)]);
  }, [isAuthenticated, fetchNetWorth, fetchCashFlow]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Inicia sesión para ver tu dashboard</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
            tintColor={theme.colors.primary}
          />
        }
      >
        <FadeInView>
          <Text style={styles.welcomeText}>Hola, {user?.email.split('@')[0]}</Text>
          <Text style={styles.title}>Tu Resumen Financiero</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Net Worth Widget */}
          <View style={[styles.card, styles.netWorthCard]}>
            <Text style={styles.cardLabel}>Patrimonio Neto</Text>
            <Text style={styles.netWorthAmount}>{formatCurrency(netWorth?.netWorth ?? '0')}</Text>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View>
                <Text style={styles.miniLabel}>Activos</Text>
                <Text style={styles.miniValue}>{formatCurrency(netWorth?.assets ?? '0')}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text style={styles.miniLabel}>Pasivos</Text>
                <Text style={[styles.miniValue, styles.errorTextValue]}>
                  {formatCurrency(netWorth?.liabilities ?? '0')}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly Summary Widget */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Resumen del Mes</Text>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.miniLabel}>Ingresos</Text>
                <Text style={[styles.summaryValue, styles.successText]}>
                  {formatCurrency(cashFlow?.income ?? '0')}
                </Text>
              </View>
              <View style={[styles.flex1, styles.alignRight]}>
                <Text style={styles.miniLabel}>Gastos</Text>
                <Text style={[styles.summaryValue, styles.errorTextValue]}>
                  {formatCurrency(cashFlow?.expenses ?? '0')}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.miniLabel}>Flujo Neto</Text>
              <Text
                style={[
                  styles.miniValue,
                  {
                    color:
                      parseFloat(cashFlow?.netCashFlow ?? '0') >= 0
                        ? theme.colors.secondary
                        : theme.colors.error,
                  },
                ]}
              >
                {formatCurrency(cashFlow?.netCashFlow ?? '0')}
              </Text>
            </View>
          </View>

          {isLoading && !netWorth && !cashFlow && (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          )}
        </FadeInView>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <QuickTransactionModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          fetchData(); // Refresh data after transaction
        }}
        ledgerId={LEDGER_ID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[24],
    paddingTop: theme.spacing[48],
    paddingBottom: 100, // Extra space for FAB
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  welcomeText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing[24],
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[24],
    borderRadius: 20,
    marginBottom: theme.spacing[24],
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)', // Subtle Gold border
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  netWorthCard: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  cardLabel: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing[8],
  },
  netWorthAmount: {
    fontSize: 40,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: theme.spacing[16],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  miniValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  flex1: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  errorTextValue: {
    color: theme.colors.error,
  },
  successText: {
    color: theme.colors.secondary,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: theme.spacing[16],
    borderRadius: 12,
    marginBottom: theme.spacing[24],
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing[24],
    bottom: theme.spacing[32],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});

