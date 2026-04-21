import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { theme } from '../../theme/theme';
import { Input } from './Input';
import { Button } from './Button';
import { useTransactionsStore } from '../../store/transactions.store';
import FadeInView from './FadeInView';

interface QuickTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  ledgerId: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({
  isVisible,
  onClose,
  ledgerId,
}) => {
  const { suggestions, fetchSuggestions, createTransaction, isLoading } = useTransactionsStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentAccount, setPaymentAccount] = useState({ id: '', name: '' });
  const [categoryAccount, setCategoryAccount] = useState({ id: '', name: '' });

  useEffect(() => {
    if (isVisible) {
      fetchSuggestions(ledgerId);
    }
  }, [isVisible, ledgerId, fetchSuggestions]);

  const balance = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    if (paymentAccount.id && categoryAccount.id && numAmount !== 0) {
      // Simplificado: un lado es -monto y el otro es +monto.
      // En partida doble: Crédito (Pago) vs Débito (Gasto)
      return 0;
    }
    return numAmount === 0 ? 0 : numAmount; // Si falta una cuenta, no hay balance cero.
  }, [amount, paymentAccount.id, categoryAccount.id]);

  const isBalanceZero =
    balance === 0 &&
    amount !== '' &&
    parseFloat(amount) !== 0 &&
    paymentAccount.id !== '' &&
    categoryAccount.id !== '';

  const handleSave = async () => {
    if (!isBalanceZero) return;

    try {
      await createTransaction({
        ledgerId,
        date: new Date().toISOString(),
        description,
        entries: [
          {
            accountId: paymentAccount.id,
            amount: `-${amount}`,
          },
          {
            accountId: categoryAccount.id,
            amount: amount,
          },
        ],
      });
      handleClose();
    } catch (error) {
      // Error is handled by store
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setPaymentAccount({ id: '', name: '' });
    setCategoryAccount({ id: '', name: '' });
    onClose();
  };

  const renderSuggestions = useCallback(
    (onSelect: (acc: { id: string; name: string }) => void, selectedId: string) => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScroll}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.accountId}
            style={[
              styles.suggestionChip,
              selectedId === suggestion.accountId && styles.suggestionChipSelected,
            ]}
            onPress={() => onSelect({ id: suggestion.accountId, name: suggestion.name })}
          >
            <Text
              style={[
                styles.suggestionText,
                selectedId === suggestion.accountId && styles.suggestionTextSelected,
              ]}
            >
              {suggestion.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ),
    [suggestions],
  );

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <FadeInView style={styles.contentInner}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Ingesta Rápida</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.formScroll} bounces={false}>
                  <Input
                    label="Monto"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    style={styles.amountInput}
                  />

                  <Text style={styles.sectionLabel}>Cuenta de Pago</Text>
                  {renderSuggestions(setPaymentAccount, paymentAccount.id)}
                  <Input
                    label=""
                    placeholder="Selecciona o escribe cuenta..."
                    value={paymentAccount.name}
                    editable={false}
                    style={styles.readOnlyInput}
                  />

                  <Text style={styles.sectionLabel}>Categoría / Destino</Text>
                  {renderSuggestions(setCategoryAccount, categoryAccount.id)}
                  <Input
                    label=""
                    placeholder="Selecciona o escribe categoría..."
                    value={categoryAccount.name}
                    editable={false}
                    style={styles.readOnlyInput}
                  />

                  <Input
                    label="Descripción"
                    placeholder="¿En qué gastaste?"
                    value={description}
                    onChangeText={setDescription}
                  />

                  <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Balance:</Text>
                    <Text
                      style={[
                        styles.balanceValue,
                        isBalanceZero ? styles.balanceSuccess : styles.balanceError,
                      ]}
                    >
                      {currencyFormatter.format(balance)}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.footer}>
                  <Button
                    title="Guardar Transacción"
                    onPress={handleSave}
                    disabled={!isBalanceZero || isLoading}
                    isLoading={isLoading}
                    style={styles.saveButton}
                  />
                </View>
              </FadeInView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  contentInner: {
    padding: theme.spacing[24],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[24],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textMuted,
    padding: 4,
  },
  formScroll: {
    maxHeight: 500,
  },
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing[8],
  },
  amountInput: {
    fontSize: 32,
    height: 70,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  suggestionsScroll: {
    marginBottom: theme.spacing[12],
  },
  suggestionChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  suggestionChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  suggestionText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  suggestionTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  readOnlyInput: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginBottom: theme.spacing[16],
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[16],
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    marginTop: theme.spacing[8],
    marginBottom: theme.spacing[24],
  },
  balanceLabel: {
    fontSize: 18,
    color: theme.colors.textMuted,
    marginRight: 8,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  balanceSuccess: {
    color: theme.colors.secondary,
  },
  balanceError: {
    color: theme.colors.error,
  },
  footer: {
    marginTop: 'auto',
  },
  saveButton: {
    height: 65,
    borderRadius: 16,
  },
});
