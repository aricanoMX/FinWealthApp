import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Tabs, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { theme } from '../../src/theme/theme';
import { useTransactionsStore } from '../../src/store/transactions.store';
import { SessionService } from '../../src/auth/session.service';
import type { Transaction, TransactionEntry } from '../../src/api/transactions.api';

const LEDGER_ID = 'default-ledger'; // Used across tabs currently

function ExportButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
}

export default function TransactionsScreen() {
  const { transactions, isLoading, isLoadingMore, fetchTransactions, fetchNextPage } =
    useTransactionsStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTransactions(LEDGER_ID, true);
  }, [fetchTransactions]);

  const handleExport = useCallback(async () => {
    try {
      const token = await SessionService.getToken();
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const url = `${API_URL}/api/v1/analytics/export?ledgerId=${LEDGER_ID}`;
      const fileUri = `${(FileSystem as any).documentDirectory || ''}transacciones.csv`;

      const downloadRes = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (downloadRes.status !== 200) {
        throw new Error('Error downloading file');
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(downloadRes.uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exportar Transacciones',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Error', 'Compartir no está disponible en este dispositivo');
      }
    } catch {
      Alert.alert('Error', 'No se pudo exportar las transacciones');
    }
  }, []);

  const renderHeaderRight = useCallback(
    () => <ExportButton onPress={handleExport} />,
    [handleExport],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  const renderItem = ({ item }: { item: Transaction }) => {
    const amount =
      item.entries
        ?.filter((e: TransactionEntry) => parseFloat(e.amount) > 0)
        .reduce((acc: number, e: TransactionEntry) => acc + parseFloat(e.amount), 0) || 0;

    const formattedDate = new Date(item.date).toLocaleDateString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.amount}>
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)}
          </Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!isLoadingMore && !isLoading) {
      fetchNextPage(LEDGER_ID);
    }
  };

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{}} />

      {isLoading && transactions.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay movimientos registrados.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    marginRight: theme.spacing[16],
  },
  listContent: {
    padding: theme.spacing[16],
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[16],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    marginBottom: theme.spacing[12],
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  description: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing[8],
  },
  amount: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: theme.spacing[16],
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing[32],
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 16,
  },
});
