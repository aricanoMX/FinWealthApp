import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';

interface ProgressBarProps {
  progress: number;
  label?: string;
  spent: number;
  limit: number;
  currency?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  spent,
  limit,
  currency = 'USD',
}) => {
  // Ensure progress is within 0-100 for the bar width, but allow >100 for color logic
  const displayProgress = Math.min(Math.max(progress, 0), 100);

  const getBarColor = () => {
    if (progress <= 70) return theme.colors.secondary; // Green
    if (progress <= 90) return '#FFCC00'; // Yellow/Orange
    return theme.colors.error; // Red
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label || 'Presupuesto'}</Text>
        <Text style={styles.percentage}>{progress.toFixed(0)}%</Text>
      </View>

      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${displayProgress}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.amount}>
          <Text style={styles.spent}>{formatCurrency(spent)}</Text>
          <Text style={styles.limit}> / {formatCurrency(limit)}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  percentage: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    marginTop: theme.spacing.4,
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 12,
  },
  spent: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  limit: {
    color: theme.colors.textMuted,
  },
});

export default React.memo(ProgressBar);
